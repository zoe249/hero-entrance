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
  @property(Node)
  public stick: Node = null // 摇杆的控制部分

  @property(Node)
  public joystickBackground: Node = null // 摇杆的背景部分

  private isTouching: boolean = false // 标记是否正在触摸
  private maxDistance: number = 100 // 摇杆的最大距离（背景半径）

  private startPos: Vec2 = new Vec2() // 摇杆背景的起始位置
  static direction: Vec2 = new Vec2(0, 0) // 摇杆的方向（x, y）

  @property(HeroController)
  hero: HeroController

  onLoad() {
    // 初始化摇杆背景的起始位置
    const worldPos = new Vec3()
    this.joystickBackground.getWorldPosition(worldPos)
    this.startPos = new Vec2(worldPos.x, worldPos.y)
    // this.joystickBackground.active = false
    this.joystickBackground.active = true
  }

  start() {
    // 确保节点有 UITransform 组件且大小合适
    let uiTransform = this.node.getComponent(UITransform)
    if (!uiTransform) {
      uiTransform = this.node.addComponent(UITransform)
    }
    // 设置合适的大小，确保能够接收到触摸事件
    uiTransform.setContentSize(500, 500)
    
    // 添加触摸事件监听
    this.node.on(Node.EventType.TOUCH_START, this.onTouchStart, this)
    this.node.on(Node.EventType.TOUCH_MOVE, this.onTouchMove, this)
    this.node.on(Node.EventType.TOUCH_END, this.onTouchEnd, this)
    this.node.on(Node.EventType.TOUCH_CANCEL, this.onTouchEnd, this)
  }

  // 开始触摸时记录触摸起始点
  onTouchStart(event: EventTouch) {
    this.isTouching = true

    this.joystickBackground.active = true

    // 获取触摸位置的屏幕坐标
    const touchPos = event.getUILocation()

    // 更新摇杆背景的位置为触摸位置
    // this.joystickBackground.setPosition(touchPos.x, touchPos.y)
    
    // 更新起始位置
    this.startPos = new Vec2(touchPos.x, touchPos.y)
  }

  // 在触摸移动过程中更新摇杆的位置
  onTouchMove(event: EventTouch | Vec2) {
    if (!this.isTouching) return

    let touchPos: Vec2
    if (event instanceof EventTouch) {
      touchPos = event.getUILocation()
    } else {
      touchPos = event
    }

    // 计算触摸位置相对于摇杆背景的偏移量
    let offset = touchPos.subtract(this.startPos)

    const distance = offset.mag()

    // 限制摇杆的偏移量不能超过最大距离
    if (distance > this.maxDistance) {
      offset = offset.normalize().multiplyScalar(this.maxDistance) // 保证摇杆位置不超过最大距离
    }

    // 更新摇杆控制部分的位置
    this.stick.setPosition(offset.x, offset.y)

    // 计算方向，确保方向范围为[-1, 1]
    Joystick.direction = new Vec2(
      offset.x / this.maxDistance,
      offset.y / this.maxDistance
    )
    this.hero.setMoveDir(Joystick.direction.x, Joystick.direction.y)
    this.hero.setDirection(this.getJoystickDirection(Joystick.direction))
    this.hero.setState(HeroState.run)
  }

  // 结束触摸时，恢复摇杆到原点
  onTouchEnd(event: EventTouch) {
    this.isTouching = false

    // this.joystickBackground.active = false

    this.stick.setPosition(0, 0) // 摇杆指针返回原位
    Joystick.direction.set(new Vec2(0, 0)) // 正确的重置方向
    this.hero.setMoveDir(0, 0)
    this.hero.setState(HeroState.idle)
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
