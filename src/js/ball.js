import * as PIXI from 'pixi.js'
import { app, loader } from './app'
import game from './game'

export default class Ball extends PIXI.Sprite {
    constructor() {
        super()
        game.addChild(this)
        this.x = app.screen.width / 2 - 15
        this.y = 366
        this.z = 0
        this.speed = 0
        this.vx = 0
        this.vy = 0
        this.zy = 0
        this.theta = 0
        this.rotation = Math.PI / 2
        this.anchor.set(0.5)
        this.scale.set(0.01)
        this.texture = loader.resources.baseball.texture
        this.timeoutset = false
    }

    move() {
        let airResistance = 0.1
        this.vx = this.speed * Math.cos(this.rotation)
        this.vy = this.speed * Math.sin(this.rotation)
        this.x += this.vx
        this.y += this.vy
        this.z += this.vz
        if (this.vy < 0) {
            this.speed -= airResistance
            if (this.speed < 0) {
                this.speed = 0
            }
        }
        if (this.z > 0) {
            this.vz -= 0.2
        } else {
            this.vz = 0
            this.z = 0
        }

        this.scale.set(this.z / 20000 + 0.01)

        if (game.pitched === true && this.speed === 0 && this.timeoutset === false) {
            setTimeout(() => {
                this.position.set(app.screen.width / 2, 366)
                game.reset()
            }, 2 * 1000)
            this.timeoutset = true
            game.scoreboard.score.text = parseInt(game.scoreboard.score.text) + game.pointsEarned
            game.pointsEarned = 0
        }
    }

    pitch() {
        game.pitched = true
        game.ball.speed = 1 * Math.random() + 5
        game.ball.timeoutset = false
        game.ball.rotation = Math.PI / 2
    }


    bound() {
        if (this.y > 850) {
            this.position.set(app.screen.width / 2, 366)
            this.speed = 0
        } else if ((this.x - app.screen.width / 2) ** 2 + (this.y - 800) ** 2 > 1900 ** 2) {
            setTimeout(() => {
                this.position.set(app.screen.width / 2, 366)
                game.y = 0
                game.homerun = false
            }, 2 * 1000)
            this.speed = 0
            game.vy = 0
            game.homerun = true
        }
    }
}
