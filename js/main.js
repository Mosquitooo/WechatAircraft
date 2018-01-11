
import Player from './script/player'
import Enemy from './script/enemy'
import DataBus from './databus'
import Music from './runtime/music'

var ctx = canvas.getContext('2d')
let databus = new DataBus() // 全局数据管理对象(单例)

//用于其它模块导出, export default仅会导出一个
export default class Main {
  constructor() {
    this.restart()
  }

  restart() {
    databus.reset()
    this.player = new Player(ctx)
    this.music  = new Music()   // 音效管理对象(单例)

    canvas.removeEventListener('touchstart', this.touchHandler)
    window.requestAnimationFrame(this.loop.bind(this), canvas)
  }

  //游戏结束后的触摸事件处理逻辑
  touchEventHandler(e) {
    e.preventDefault()
    this.restart()
  }

  // 游戏帧循环
  loop() {
    this.update()

    this.render()

    databus.frame++
    if (databus.frame % 20 === 0) {
      // 发射子弹(由飞机发射)
      this.player.shoot()
      this.music.playShoot()
    }

    // 游戏结束停止帧循环
    if (databus.gameOver) {
      this.touchHandler = this.touchEventHandler.bind(this)
      canvas.addEventListener('touchstart', this.touchHandler)
      return
    }

    window.requestAnimationFrame(this.loop.bind(this), canvas)
  }

  /**
   * 随着帧数变化的敌机生成逻辑
   * 帧数取模定义成生成的频率
   */
  enemyGenerate() {
    if (databus.frame % 30 === 0) {
      //let enemy = new Enemy()
      let enemy = databus.pool.getItemByClass('enemy', Enemy)
      enemy.init(6)
      databus.enemys.push(enemy)
    }
  }

  // 全局碰撞检测
  collisionDetection() {
    let that = this

    databus.bullets.forEach((bullet) => {
      for (let i = 0, il = databus.enemys.length; i < il; i++) {
        let enemy = databus.enemys[i]
        if (enemy.isCollideWith(bullet)) 
        {
          this.music.playExplosion()
          enemy.visible = false
          bullet.visible = false
          break
        }
      }
    })

    for (let i = 0, il = databus.enemys.length; i < il; i++) {
      let enemy = databus.enemys[i]
      if (this.player.isCollideWith(enemy)) {
        databus.gameOver = true
        break
      }
    }
  }

  // 游戏逻辑更新
  update()
  {
    // 敌人生成
    this.enemyGenerate()

    // 子弹位置更新
    databus.bullets.forEach((item) => {item.update()})

    // 敌人位置更新
    databus.enemys.forEach((item) => {item.update()})

    // 碰撞检测
    this.collisionDetection()

  }

  // 画布重新渲染
  render()
  {
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // 主角渲染
    this.player.drawToCanvas(ctx)

    // 子弹渲染
    databus.bullets.forEach((item) => {item.drawToCanvas(ctx)})

    // 敌人渲染
    databus.enemys.forEach((item) => {item.drawToCanvas(ctx)})
  }
}