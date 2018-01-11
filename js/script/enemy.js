
import Sprite from '../base/sprite'
import DataBus from '../databus'

const ENEMY_IMG_SRC = 'images/enemy.png'
const ENEMY_WIDTH = 30
const ENEMY_HEIGHT = 30

let databus = new DataBus()

function rnd(start, end) {
  return Math.floor(Math.random() * (end - start) + start)
}

export default class Enemy extends Sprite{
  constructor() {
    super(ENEMY_IMG_SRC, ENEMY_WIDTH, ENEMY_HEIGHT)
  }
  init(speed) {
    this.x = rnd(0, window.innerWidth - ENEMY_WIDTH)
    this.y = -this.height

    this.speed = speed

    this.visible = true
  }

  // 每一帧更新位置
  update() {
    this.y += this.speed

    // 对象回收
    if (this.y > window.innerHeight + this.height)
      databus.removeEnemey(this)
  }
}