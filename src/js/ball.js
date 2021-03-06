import * as PIXI from 'pixi.js'
import { app, loader } from './app'
import game from './game'

export default class Ball extends PIXI.Sprite {
    constructor() {
        super()
        game.addChild(this)
        this.x = app.screen.width / 2
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
        this.zIndex = 10
    }

    move(deltaTime = 1) {
        let airResistance = 0.01
        let g = 1
        this.vx = this.speed * Math.cos(this.theta) * Math.cos(this.rotation)
        this.vy = this.speed * Math.cos(this.theta) * Math.sin(this.rotation)
        if (!this.physicsOff()) this.vz = this.speed * Math.sin(this.theta) - g * deltaTime

        this.speed = Math.hypot(this.vx, this.vy, this.vz)
        this.theta = Math.atan2(this.vz, Math.hypot(this.vy, this.vx))

        this.x += this.vx * deltaTime
        this.y += this.vy * deltaTime
        if (!this.physicsOff()) this.z += this.vz * deltaTime - g * deltaTime ** 2

        if (!this.physicsOff()) this.speed -= this.speed * airResistance
        if (this.z < 0) {
            this.stop()
        }

        this.scale.set(this.z / 20000 + 0.01)

        if (game.state === 'hit' && this.speed === 0) {
            game.state = 'landing'
            dispatchEvent(new Event('landing'))
        }
    }

    stop() {
        this.speed = 0
        this.vx = 0
        this.vy = 0
        this.vz = 0
        this.z = 0
    }

    physicsOff() {
        return ['beforePitch', 'pitch', 'throwBall', 'finish'].includes(game.state)
    }

    pitch() {
        game.state = 'pitch'
        this.speed = 2 * Math.random() + 5
        this.rotation = Math.PI / 2
    }

    reset() {
        this.stop()
        this.position.set(app.screen.width / 2, 366)
    }

    isStrike() {
        return game.state !== 'strike' && this.y > 850
    }

    isHomeRun() {
        return game.state !== 'homerun' && Math.hypot(this.x - app.screen.width / 2, this.y - 810) > 1900
    }

    shouldMove() {
        return ['pitch', 'hit', 'throwBall', 'finish'].includes(game.state)
    }

    update(deltaTime) {
        if (this.shouldMove()) this.move(deltaTime)
        if (this.isStrike()) {
            game.state = 'strike'
            dispatchEvent(new Event('strike'))
        } else if (this.isHomeRun()) {
            game.state = 'homerun'
            dispatchEvent(new Event('homerun'))
        }
    }
}

addEventListener('strike', () => {
    setTimeout(() => {
        game.reset()
    }, 1000)
})

addEventListener('landing', () => {
})

addEventListener('homerun', () => {
    setTimeout(() => {
        game.reset()
    }, 2000)
})
