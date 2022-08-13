import { ReactP5Wrapper } from "react-p5-wrapper";
import { NetworkedFinger } from "../lib/NetworkedFingerClass";
import { calcAverageKeypoints } from "../lib/calcAverageKeypoints";

export const DisplayMarkedUpFingers = ({ predictionsRef }) => {
  let mouseClickedLastCall = 0;
  const keyflames = [[], []];
  const positions = [];
  const data = [];
  for (let i = 0; i < 5; i++) {
    data.push(
      new NetworkedFinger(
        0,
        null,
        false,
        { x: 500, y: 500 },
        2 * (Math.PI / 5) * i,
        "thumb"
      )
    );
    data.push(
      new NetworkedFinger(
        0,
        null,
        false,
        { x: 700, y: 500 },
        2 * (Math.PI / 5) * i,
        "index"
      )
    );
    data.push(
      new NetworkedFinger(
        0,
        null,
        false,
        { x: 900, y: 500 },
        2 * (Math.PI / 5) * i,
        "middle"
      )
    );
    data.push(
      new NetworkedFinger(
        0,
        null,
        false,
        { x: 1100, y: 500 },
        2 * (Math.PI / 5) * i,
        "ring"
      )
    );
    data.push(
      new NetworkedFinger(
        0,
        null,
        false,
        { x: 1300, y: 500 },
        2 * (Math.PI / 5) * i,
        "pinky"
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
