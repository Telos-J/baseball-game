import * as PIXI from 'pixi.js'
import { app, loader } from './app'
import game from './game'

export default class Bunny extends PIXI.Sprite {
    constructor(name, x, y) {
        super()
        this.name = name
        if (this.name.includes('fielder')) game.fielders.push(this)
        this.speed = 3
        this.anchor.set(0.5)
        this.scale.set(2)
        this.vx = 0
        this.vy = 0
        this.position.x = x
        this.position.y = y
        this.initialPosition = [this.position.x, this.position.y]
        this.range = 50
        this.rangeGraphic = new PIXI.Graphics()
        this.rangeGraphic.beginFill(0xffffff)
        this.rangeGraphic.arc(0, 9, this.range, 0, Math.PI * 2)
        this.addChild(this.rangeGraphic)
        this.rangeGraphic.alpha = 0.2
        this.texture = loader.resources.bunny.texture
        game.addChild(this)
    }

    drawRange() {
        const angle = Math.atan2(this.y - 780, this.x - app.screen.width / 2)
        const line = new PIXI.Graphics()
        line.beginFill(0x000)
        line.drawRect(0, 0, 1000, 2)
        line.position.set(app.screen.width / 2, 780)
        line.rotation = angle + Math.PI * 0.05
        game.addChild(line)
        const line2 = new PIXI.Graphics()
        line2.beginFill(0x000)
        line2.drawRect(0, 0, 1000, 2)
        line2.position.set(app.screen.width / 2, 780)
        line2.rotation = angle - Math.PI * 0.05
        game.addChild(line2)
    }

    move(){
        const angle = Math.atan2(this.y - 780, this.x - app.screen.width / 2) + Math.PI * 2
        if (angle - Math.PI * 0.05 < game.ball.rotation && angle + Math.PI * 0.05 > game.ball.rotation && game.pitched)
        {
            console.log(`${ this.name } detected the ball!!`)
            const diff = [game.ball.x - this.x, game.ball.y - this.y]
            const distance = Math.hypot(diff[0], diff[1])
            if (distance < this.speed) return
            const velocity = [diff[0] / distance * this.speed, diff[1] / distance * this.speed]
            this.position.set(this.x + velocity[0], this.y + velocity[1])
        }
    }
}

