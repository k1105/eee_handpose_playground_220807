import { ReactP5Wrapper } from "react-p5-wrapper";
import { spreadFinger } from "./spreadFinger";
import { organizeFinger } from "./organizeFinger";
import { pileFinger } from "./pileFinger";
import { calcAverageKeypoints } from "../lib/calcAverageKeypoints";

export const DisplayFinger = ({ predictionsRef }) => {
  const functions = [spreadFinger, organizeFinger, pileFinger];
  let styleIndex = 0;
  let lostAt = 0;
  let lost = false;
  const keyflames = [[], []];
  function sketch(p5) {
    p5.setup = () => {
      p5.createCanvas(window.innerWidth, window.innerHeight);

      p5.stroke(220);
      p5.strokeWeight(10);
    };

    p5.draw = () => {
      let hands = [];
      p5.background(57, 127, 173);
      p5.push();
      if (typeof predictionsRef.current == "object") {
        try {
          if (predictionsRef.current.length === 0) {
            if (!lost) {
              lost = true;
              lostAt = new Date().getTime();
            }
          } else {
            if (lost && new Date().getTime() - lostAt > 1000) {
              // //トラッキングがロストしてから1s経ったら
              styleIndex = (styleIndex + 1) % functions.length;
              // styleIndex = 5;
            }
            lost = false;
          }

          for (let index = 0; index < predictionsRef.current.length; index++) {
            keyflames[index].push(predictionsRef.current[index].keypoints);
            if (keyflames[index].length > 5) {
              keyflames[index].shift();
            }
            hands.push(calcAverageKeypoints(keyflames[index]));
          }
          functions[styleIndex](p5, hands);
        } catch (e) {}
      }
    };
  }
  return <ReactP5Wrapper sketch={sketch} />;
};
