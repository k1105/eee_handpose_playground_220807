import { Finger } from "./FingerClass";

export class NetworkedFinger extends Finger {
  constructor(
    id,
    parent,
    followRotate,
    position,
    rotation,
    targetFinger,
    skin
  ) {
    super(position, rotation, targetFinger, skin);
    this.id = id;
    this.parent = parent;
    this.followRotate = followRotate;
  }

  update(parent, key) {
    if (parent !== null) {
      this.bottom_position = parent.tip_position;
      this.bottom_angle = parent.bottom_angle;
      if (this.followRotate) {
        this.bottom_angle += parent.vector_angle;
      }
    }
    this.setVectorAngle(key);
    this.setTipPosition(key);
  }

  draw(p5, key) {
    //key: 現在の手の形状
    //targetFinger: どの指を描画するか(0: 親指, 1: 人差し指, 2: 中指, 3: 薬指, 4: 小指)
    // position: 始点をどこにするか
    // angle: 始点からどれだけ回転させるか
    p5.push();
    p5.fill(0);
    p5.noStroke();
    p5.pop();
    p5.push();
    p5.translate(this.bottom_position.x, this.bottom_position.y);
    p5.rotate(this.bottom_angle);

    // ゆくゆくはSkinClass.style(p5, key)関数で代替する.
    // 同時に, SkinClassにはFingerClass, NetworkedFingerClassのプロパティは含めないので、p5.translate, p5.rotateの使用も検討する.

    this.skin.style(p5, key, this.start, this.end);
    p5.pop();
  }
}
