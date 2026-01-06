import { _decorator, Component, Sprite, SpriteFrame, Rect } from 'cc'

const { ccclass, property } = _decorator

@ccclass('HeroController')
export class HeroController extends Component {
  @property(Sprite)
  sprite!: Sprite

  private frameWidth = 32
  private frameHeight = 50
  private frameIndex = 0

  private duration = 0.1
  start() {
  }

  update(dt: number) {
    this.duration += dt
    if (this.duration >= 0.1) {
      this.playFrame()
      this.duration = 0
    }
  }

  playFrame() {
    const originSf = this.sprite.spriteFrame!
    const origin = originSf.originalSize

    const x = this.frameIndex * this.frameWidth

    // 克隆一份 SpriteFrame（关键）
    const sf = originSf.clone()


    // 防止越界
    // if (y + this.frameWidth > origin.width) {
    //   this.frameIndex = 0
    //   return
    // }

    if (this.frameIndex >= 5) {
      this.frameIndex = 0
      return
    }

    // 裁剪
    sf.rect = new Rect(
      x,
      0,
      this.frameWidth,
      this.frameHeight
    )

    // 强制刷新
    this.sprite.spriteFrame = sf

    this.frameIndex++
  }
}
