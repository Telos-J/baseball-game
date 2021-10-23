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
        this.vz = 0
        this.theta = 0 //phi
        this.rotation = Math.PI / 2
        this.anchor.set(0.5)
        this.scale.set(0.01)
        this.texture = loader.resources.baseball.texture
        this.timeoutset = false
    }



    move(deltaTime) {
        let airResistance = 0.01
        let g = 1
        this.vx = this.speed * Math.cos(this.theta) * Math.cos(this.rotation)
        this.vy = this.speed * Math.cos(this.theta) * Math.sin(this.rotation)
        if (this.vy < 0) this.vz = this.speed * Math.sin(this.theta) - g * deltaTime

        this.speed = Math.hypot(this.vx, this.vy, this.vz)
        this.theta = Math.atan2(this.vz, Math.hypot(this.vy, this.vx))

        this.x += this.vx * deltaTime
        this.y += this.vy * deltaTime
        if (this.vy < 0) this.z += this.vz * deltaTime - g * deltaTime ** 2

        if (this.vy < 0) this.speed -= this.speed * airResistance
        if (this.z < 0) {
            this.speed = 0
            this.vz = 0
            this.z = 0
        }

        // if (this.vy < 0) {
        //     this.speed -= airResistance
        //     if (this.speed < 0) {
        //         this.speed = 0
        //     }
        // }
        // if (this.z > 0) {
        //     this.vz -= 0.2
        // } else {
        //     this.vz = 0
        //     this.z = 0
        // }

        this.scale.set(this.z / 20000 + 0.01)

        if (game.pitched === true && this.speed === 0 && this.timeoutset === false) {
            setTimeout(() => {
                this.position.set(app.screen.width / 2, 366)
                game.reset()
            }, 2 * 1000)
            this.timeoutset = true
            game.scoreboard.score.text = parseInt(game.scoreboard.score.text) + game.pointsEarned
            game.pointsEarned = 0
            console.log(this.position.x, this.position.y)
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
        } else if (Math.hypot(this.x - app.screen.width / 2, this.y - 810) > 1900) {
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
