export class Finger {
  constructor(position, offset_angle, targetFinger) {
    this.bottom_position = position;
    this.tip_position = { x: 0, y: 0 };
    this.bottom_angle = offset_angle;
    this.offset_angle = offset_angle;
    this.vector_angle = 0;
    this.targetFinger = this.#convertFingerNameToInteger(targetFinger);
    this.start = 4 * this.targetFinger + 1;
    this.end = 4 * this.targetFinger + 4;
    this.skin = {
      drawStyle: () => {},
      getTipPosition: () => {},
      getAngle: () => {},
    }; /* comming soon... */
  }
  #convertFingerNameToInteger(str) {
    switch (str) {
      case "thumb":
        return 0;
      case "index":
        return 1;
      case "middle":
        return 2;
      case "ring":
        return 3;
      case "pinky":
        return 4;
      default:
        console.error(
          `convertFingerNameToInteger in Finger Class: given string doesn't match any finger names!\n given finger name: ${str}`
        );
    }
  }

  setBottomAngle() {}

  setTipPosition(key) {
    //ゆくゆくはSkinClassが定義するtipPosition()と統合する.
    const x = key[this.end].x - key[this.start].x;
    const y = key[this.end].y - key[this.start].y;
    const theta = this.bottom_angle;

    this.tip_position = {
      x: Math.cos(theta) * x - Math.sin(theta) * y + this.bottom_position.x,
      y: Math.sin(theta) * x + Math.cos(theta) * y + this.bottom_position.y,
    };
  }

  setVectorAngle(key) {
    //ゆくゆくはSkinClassが定義するvectorAngle()と統合する.
    this.vector_angle =
      Math.PI / 2 +
      Math.atan2(
        key[this.end].y - key[this.end - 1].y,
        key[this.end].x - key[this.end - 1].x
      );
  }
}
