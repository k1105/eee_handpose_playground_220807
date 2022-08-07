import { ReactP5Wrapper } from "react-p5-wrapper";

export const CreateIndexFinger = ({ predictionsRef }) => {
  let lostAt = 0;
  let mouseClickedLastCall = 0;
  let lost = false;
  const keyflames = [[], []];
  const positions = [];
  const calcAverageKeypoints = (keyarr) => {
    const keys = [];
    if (keyarr.length > 0) {
      for (let i = 0; i < 21; i++) {
        let totalWeight = 0;
        let val = { x: 0, y: 0 };
        for (let j = 0; j < keyarr.length; j++) {
          const weight =
            (keyarr.length - 1) / 2 - Math.abs((keyarr.length - 1) / 2 - j) + 1;
          totalWeight += weight;
          val.x += keyarr[j][i].x * weight;
          val.y += keyarr[j][i].y * weight;
        }
        keys.push({ x: val.x / totalWeight, y: val.y / totalWeight });
      }

      return keys;
    } else {
      return [];
    }
  };

  const drawIndexFingerFrom = (p5, hands, x, y) => {
    const key = hands[0];
    const base_x = key[0].x;
    const base_y = key[0].y;

    p5.push();
    p5.translate(x, y);
    p5.ellipse(0, 0, 10);
    for (let i = 0; i < 4; i++) {
      //thumb
      p5.line(
        3 * (key[i].x - base_x),
        3 * (key[i].y - base_y),
        3 * (key[i + 1].x - base_x),
        3 * (key[i + 1].y - base_y)
      );
    }
    p5.pop();
  };
  function sketch(p5) {
    p5.setup = () => {
      p5.createCanvas(window.innerWidth, window.innerHeight);

      p5.stroke(220);
      p5.strokeWeight(10);
    };

    p5.draw = () => {
      let hands = [];
      p5.background(57, 127, 173);
      p5.text(p5.frameRate(), 10, 10);
      p5.push();
      if (typeof predictionsRef.current == "object") {
        try {
          if (predictionsRef.current.length === 0) {
            if (!lost) {
              lost = true;
              lostAt = new Date().getTime();
            }
          } else {
            lost = false;
          }
          for (let index = 0; index < predictionsRef.current.length; index++) {
            keyflames[index].push(predictionsRef.current[index].keypoints);
            if (keyflames[index].length > 5) {
              keyflames[index].shift();
            }
            hands.push(calcAverageKeypoints(keyflames[index]));
          }
          for (let i = 0; i < positions.length; i++) {
            drawIndexFingerFrom(p5, hands, positions[i].x, positions[i].y);
          }
        } catch (e) {}
      }
    };

    p5.mouseClicked = () => {
      if (new Date().getTime() - mouseClickedLastCall > 1) {
        console.log("clicked");
        positions.push({ x: p5.mouseX, y: p5.mouseY });
      }

      return false;
    };
  }
  return <ReactP5Wrapper sketch={sketch} />;
};
