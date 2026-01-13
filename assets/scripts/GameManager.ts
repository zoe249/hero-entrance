import {
  _decorator,
  Component,
  Node,
  Sprite,
  SpriteFrame,
  PhysicsSystem2D,
  EPhysics2DDrawFlags
} from 'cc'
const { ccclass, property } = _decorator

@ccclass('GameManager')
export class GameManager extends Component {
  @property({
    tooltip: '是否开启调试模式',
    type: Boolean
  })
  private isDebug: boolean = false
  start() {
    if (this.isDebug) {
      PhysicsSystem2D.instance.debugDrawFlags = EPhysics2DDrawFlags.All
    } else {
      PhysicsSystem2D.instance.debugDrawFlags = EPhysics2DDrawFlags.None
    }
  }

  update(deltaTime: number) {}

  init() {
    console.log('init game manager')
  }
}
