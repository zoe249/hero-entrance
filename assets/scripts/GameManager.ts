import { _decorator, Component, Node, Sprite, SpriteFrame } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('GameManager')
export class GameManager extends Component {
    start() {

    }

    update(deltaTime: number) {
        
    }

    init() {
        console.log('init game manager');
    }
}


