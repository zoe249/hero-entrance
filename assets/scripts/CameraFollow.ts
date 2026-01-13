import { _decorator, Component, Node, Vec3 } from 'cc'
const { ccclass, property } = _decorator

@ccclass('CameraFollow')
export class CameraFollow extends Component {
  @property(Node)
  target: Node = null!

  private offset = new Vec3()

  start() {
    const camPos = this.node.worldPosition
    const targetPos = this.target.worldPosition
    this.offset.set(
      camPos.x - targetPos.x,
      camPos.y - targetPos.y,
      0 // 2D：z 不参与 offset
    )
  }

  lateUpdate(deltaTime: number) {
    if (!this.target) return

    const targetPos = this.target.worldPosition
    this.node.setWorldPosition(
      targetPos.x + this.offset.x,
      targetPos.y + this.offset.y,
      this.node.worldPosition.z
    )
  }
}
