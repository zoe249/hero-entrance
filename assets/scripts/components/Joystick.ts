import {
  _decorator,
  Component,
  Node,
  Vec2,
  Vec3,
  UITransform,
  EventTouch,
  Graphics,
  Color
} from 'cc'

const { ccclass } = _decorator

@ccclass('Joystick')
export class Joystick extends Component {

  private g!: Graphics

  private radius = 80
  private stickRadius = 30
  private stickPos = new Vec2(0, 0)

  start() {
    this.g = this.getComponent(Graphics)!
    this.draw()

    this.node.on(Node.EventType.TOUCH_START, this.onTouch, this)
    this.node.on(Node.EventType.TOUCH_MOVE, this.onTouch, this)
    this.node.on(Node.EventType.TOUCH_END, this.onEnd, this)
    this.node.on(Node.EventType.TOUCH_CANCEL, this.onEnd, this)
  }

  onTouch(e: EventTouch) {
    const ui = this.getComponent(UITransform)!
    const pos = e.getUILocation()
    const local = ui.convertToNodeSpaceAR(new Vec3(pos.x, pos.y))

    const len = local.length()
    if (len > this.radius) {
      local.normalize().multiplyScalar(this.radius)
    }

    this.stickPos.set(local.x, local.y)
    this.draw()
  }

  onEnd() {
    this.stickPos.set(0, 0)
    this.draw()
  }

  draw() {
    this.g.clear()

    // 底座
    this.g.lineWidth = 4
    this.g.strokeColor = Color.WHITE
    this.g.circle(0, 0, this.radius)
    this.g.stroke()

    // 摇杆
    this.g.fillColor = new Color(180, 180, 180, 255)
    this.g.circle(this.stickPos.x, this.stickPos.y, this.stickRadius)
    this.g.fill()
  }
}
