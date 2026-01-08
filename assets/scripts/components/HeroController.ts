import { _decorator, Component, Sprite, SpriteFrame, Rect, Vec2 } from 'cc'

import { Direction, HeroState } from '../state'

const { ccclass, property } = _decorator

@ccclass('HeroController')
export class HeroController extends Component {
  @property(Sprite)
  sprite!: Sprite

  private frameWidth = 32
  private frameHeight = 35
  private frameIndex = 0

  private duration = 0.1

  @property({ tooltip: '移动速度' })
  private speed = 10

  moveDir = new Vec2()
  private direction: Direction = Direction.idle

  private state: HeroState = HeroState.idle

  start() {}

  update(dt: number) {
    this.duration += dt
    if (this.duration >= 0.1) {
      this.playFrame()
      this.duration = 0
    }

    // 位移 = 方向向量 dir × 速度 speed × 时间 dt
    // 新位置 = 旧位置 + 位移
    if (this.moveDir.length() === 0) return

    const pos = this.node.position
    this.node.setPosition(
      pos.x + this.moveDir.x * this.speed * dt,
      pos.y + this.moveDir.y * this.speed * dt
    )
  }

  playFrame() {
    const originSf = this.sprite.spriteFrame!
    const row = this.state - 1
    const col = this.frameIndex

    // 克隆一份 SpriteFrame（关键）
    const sf = originSf.clone()

    if (this.frameIndex >= 5) {
      this.frameIndex = 0
      return
    }

    sf.rect = new Rect(
      col * this.frameWidth,
      row * this.frameHeight,
      this.frameWidth,
      this.frameHeight
    )

    // 强制刷新
    this.sprite.spriteFrame = sf

    this.frameIndex++
  }
  flipX(isRight: boolean) {
    const s = this.sprite.node.scale
    this.sprite.node.setScale(isRight ? Math.abs(s.x) : -Math.abs(s.x), s.y)
  }

  setMoveDir(x: number, y: number) {
    this.moveDir.set(x, y)
  }

  setDirection(dir: Direction) {
    if (this.direction === dir) return
    this.direction = dir
    this.updateAnim()
  }

  setState(state: HeroState) {
    if (this.state === state) return
    this.state = state
    // this.updateState()
  }

  updateAnim() {
    switch (this.direction) {
      case Direction.idle:
        console.log('播放待机动画')
        break
      case Direction.up:
        console.log('播放向上动画')
        break
      case Direction.upRight:
        this.flipX(false)
        break
      case Direction.right:
        this.flipX(true)
        break
      case Direction.downRight:
        this.flipX(false)
        break
      case Direction.down:
        console.log('播放向下动画')
        break
      case Direction.downLeft:
        this.flipX(true)
        break
      case Direction.left:
        this.flipX(false)
        break
    }
  }

  // updateState() {
  //   switch (this.state) {
  //     case HeroState.idle:
  //       console.log('播放待机动画222')
  //       break
  //     case HeroState.run:
  //       console.log('播放跑步动画')
  //       break
  //   }
  // }
}
