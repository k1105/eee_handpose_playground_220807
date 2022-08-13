import { ReactP5Wrapper } from "react-p5-wrapper";
import { NetworkedFinger } from "../lib/NetworkedFingerClass";
import { calcAverageKeypoints } from "../lib/calcAverageKeypoints";
import { Skin } from "../lib/SkinClass";

export const DisplayMarkedUpFingers = ({ predictionsRef }) => {
  let mouseClickedLastCall = 0;
  const keyflames = [[], []];
  const positions = [];
  const skin = new Skin(
    (p5, key, start, end) => {
      p5.stroke(255);
      p5.strokeWeight(10);
      for (let i = start; i < end; i++) {
        p5.line(
          3 * (key[i].x - key[start].x),
          3 * (key[i].y - key[start].y),
          3 * (key[i + 1].x - key[start].x),
          3 * (key[i + 1].y - key[start].y)
        );
      }
    },
    (key, start, end) => {
      return (
        Math.PI / 2 +
        Math.atan2(key[end].y - key[end - 1].y, key[end].x - key[end - 1].x)
      );
    },
    (key, start, end) => {
      return {
        x: 3 * (key[end].x - key[start].x),
        y: 3 * (key[end].y - key[start].y),
      };
    }
  );
  const data = [];
  for (let i = 0; i < 5; i++) {
    data.push(
      new NetworkedFinger(
        i,
        null,
        false,
        { x: 500, y: 500 },
        2 * (Math.PI / 5) * i,
        "thumb",
        skin
      )
    );
    data.push(
      new NetworkedFinger(
        i + 1,
        i,
        true,
        { x: 700, y: 500 },
        2 * (Math.PI / 5) * i,
        "index",
        skin
      )
    );
    data.push(
      new NetworkedFinger(
        i + 2,
        i + 1,
        true,
        { x: 900, y: 500 },
        2 * (Math.PI / 5) * i,
        "middle",
        skin
      )
    );
    data.push(
      new NetworkedFinger(
        i + 3,
        i + 2,
        true,
        { x: 1100, y: 500 },
        2 * (Math.PI / 5) * i,
        "ring",
        skin
      )
    );
    data.push(
      new NetworkedFinger(
        i + 4,
        i + 3,
        true,
        { x: 1300, y: 500 },
        2 * (Math.PI / 5) * i,
        "pinky",
        skin
      )
    );
  }

  function sketch(p5) {
    p5.setup = () => {
      p5.createCanvas(window.innerWidth, window.innerHeight);

      p5.stroke(220);
      p5.strokeWeight(3);
    };

    p5.draw = () => {
      let hands = [];
      p5.background(57, 127, 173);
      p5.text(p5.frameRate(), 10, 10);
      p5.push();
      if (typeof predictionsRef.current == "object") {
        try {
          for (let index = 0; index < predictionsRef.current.length; index++) {
            //index===0: 最初に認識された手, index===1: 次に認識された手
            keyflames[index].push(predictionsRef.current[index].keypoints);
            if (keyflames[index].length > 5) {
              keyflames[index].shift();
            }
            hands.push(calcAverageKeypoints(keyflames[index]));
          }

          const key = hands[0];
          for (let i = 0; i < data.length; i++) {
            if (data[i].parent === null) {
              //origin
              data[i].update(null, key);
              data[i].draw(p5, key);
            } else {
              //obtain finger tip position
              const parent = data.find((el) => el.id === data[i].parent);

              if (parent) {
                data[i].update(parent, key);

                data[i].draw(p5, key);
              } else {
                console.error(
                  "parent doesn't exist! it should be wrong code. in DisplayMarkedUpFinger.js"
                );
              }
            }
          }
        } catch (e) {}
      }
    };

    p5.mouseClicked = () => {
      if (new Date().getTime() - mouseClickedLastCall > 1) {
        positions.push({ x: p5.mouseX, y: p5.mouseY });
      }

      return false;
    };
  }
  return <ReactP5Wrapper sketch={sketch} />;
};
