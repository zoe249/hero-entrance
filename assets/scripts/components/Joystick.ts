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

import { Direction, HeroState } from '../state/index'
import { HeroController } from './HeroController'

const { ccclass, property } = _decorator

@ccclass('Joystick')
export class Joystick extends Component {
  private g!: Graphics
  private deadRadius = 15 // 死区半径（像素）
  private radius = 80
  private stickRadius = 30
  private stickPos = new Vec2(0, 0)

  @property(HeroController)
  hero: HeroController

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

    const dir = new Vec2(local.x, local.y)
    let len = dir.length()

    // 1️⃣ 限制最大半径
    if (len > this.radius) {
      dir.normalize().multiplyScalar(this.radius)
      len = this.radius
    }

    // 2️⃣ 计算力度（软死区）
    let strength = 0
    if (len > this.deadRadius) {
      strength = (len - this.deadRadius) / (this.radius - this.deadRadius)
      strength = Math.min(Math.max(strength, 0), 1)
    }

    // 3️⃣ 更新摇杆显示（始终跟手）
    this.stickPos.set(dir.x, dir.y)
    this.draw()

    // 4️⃣ 方向 + 力度
    if (strength === 0) {
      this.hero.setMoveDir(0, 0)
      this.hero.setDirection(Direction.idle)
      return
    }

    const moveDir = dir.clone().normalize().multiplyScalar(strength)

    // 5️⃣ 更新英雄状态
    this.hero.setState(HeroState.run)
    this.hero.setMoveDir(moveDir.x, moveDir.y)
    this.hero.setDirection(this.getJoystickDirection(moveDir))
  }

  onEnd() {
    this.stickPos.set(0, 0)
    this.draw()

    this.hero.setMoveDir(0, 0)
    this.hero.setDirection(Direction.idle)
    this.hero.setState(HeroState.idle)
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

  getJoystickDirection(dir: Vec2): Direction | null {
    if (dir.length() < 0.2) return Direction.idle

    let angle = (Math.atan2(dir.x, dir.y) * 180) / Math.PI
    if (angle < 0) angle += 360

    return this.angleToDirection(angle)
  }

  angleToDirection(angle: number): Direction {
    // 上
    if ((angle >= 0 && angle < 22.5) || (angle >= 337.5 && angle < 360)) {
      return Direction.up
    }

    if (angle >= 22.5 && angle < 67.5) {
      return Direction.upRight
    }

    if (angle >= 67.5 && angle < 112.5) {
      return Direction.right
    }

    if (angle >= 112.5 && angle < 157.5) {
      return Direction.downRight
    }

    if (angle >= 157.5 && angle < 202.5) {
      return Direction.down
    }

    if (angle >= 202.5 && angle < 247.5) {
      return Direction.downLeft
    }

    if (angle >= 247.5 && angle < 292.5) {
      return Direction.left
    }

    if (angle >= 292.5 && angle < 337.5) {
      return Direction.upLeft
    }

    // 理论上不会到这
    return Direction.up
  }
}
