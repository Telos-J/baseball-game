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
        this.range = 80
        this.texture = loader.resources.bunny.texture
        this.prediction = new PIXI.Point()
        game.addChild(this)
    }

    drawRange() {
        this.rangeGraphic = new PIXI.Graphics()
        this.rangeGraphic.beginFill(0xffffff)
        this.rangeGraphic.alpha = 0.2
        this.rangeGraphic.arc(0, 0, this.range, 0, Math.PI * 2)
        this.addChild(this.rangeGraphic)
    }

    drawSpotlight() {
        const angle = Math.atan2(this.y - 810, this.x - app.screen.width / 2)
        const d = Math.hypot(this.y - 810, this.x - app.screen.width / 2)
        const theta = Math.asin(this.range / d) * 2
        this.spotlight = new PIXI.Graphics()
        this.spotlight.beginFill(0xffffff)
        this.spotlight.alpha = 0.2
        this.spotlight.moveTo(0, 0)
        this.spotlight.arc(0, 0, 5000, -theta, theta)
        this.spotlight.position.set(app.screen.width / 2, 810)
        this.spotlight.rotation = angle
        game.addChild(this.spotlight)
    }

    updateSpotlight() {
        const angle = Math.atan2(this.y - 810, this.x - app.screen.width / 2)
        const d = Math.hypot(this.y - 810, this.x - app.screen.width / 2)
        const theta = Math.asin(this.range / d) * 2
        this.spotlight.clear()
        this.spotlight.beginFill(0xffffff)
        this.spotlight.alpha = 0.2
        this.spotlight.moveTo(0, 0)
        this.spotlight.arc(0, 0, 5000, -theta, theta)
        this.spotlight.position.set(app.screen.width / 2, 810)
        this.spotlight.rotation = angle
    }

    predict() {
        let airResistance = 0.01
        let g = 1
        let speed = game.ball.speed
        let theta = game.ball.theta
        let rotation = game.ball.rotation
        let x = game.ball.x
        let y = game.ball.y
        let z = game.ball.z
        let vx, vy, vz

        do {
            vx = speed * Math.cos(theta) * Math.cos(rotation)
            vy = speed * Math.cos(theta) * Math.sin(rotation)
            vz = speed * Math.sin(theta) - g

            speed = Math.hypot(vx, vy, vz)
            theta = Math.atan2(vz, Math.hypot(vy, vx))

            x += vx
            y += vy
            z += vz - g

            speed -= speed * airResistance
        } while (z > 0)

        this.prediction.set(x, y)
    }

    move() {
        const angle = Math.atan2(this.y - 810, this.x - app.screen.width / 2) + Math.PI * 2
        const d = Math.hypot(this.y - 810, this.x - app.screen.width / 2)
        const theta = Math.asin(this.range / d) * 2
        if (angle - theta < game.ball.rotation && angle + theta > game.ball.rotation && game.pitched) {
            console.log(`${this.name} detected the ball!!`)

            if (!Math.hypot(this.prediction.x, this.prediction.y)) this.predict()
            else {
                const diff = [this.prediction.x - this.x, this.prediction.y - this.y]
                const distance = Math.hypot(diff[0], diff[1])
                if (distance < this.speed) return
                const velocity = [diff[0] / distance * this.speed, diff[1] / distance * this.speed]
                this.position.set(this.x + velocity[0], this.y + velocity[1])
                this.updateSpotlight()
            }
        }
    }
}

