import * as PIXI from 'pixi.js'
import { app } from './app'
import game from './game'
import Bunny from './bunny'
import Batter from './batter'

export default class Fielder extends Bunny {
    constructor(name, x, y, showRange = false) {
        super(name, x, y)
        if (name.includes('fielder')) game.fielders.push(this)
        this.range = 100
        this.prediction = new PIXI.Point()
        this.drawRange()
        this.drawSpotlight()
        this.showRange = showRange
        this.hasBall = false
    }

    reset() {
        this.position.set(this.initialPosition[0], this.initialPosition[1])
        this.prediction.set(0, 0)
        this.updateSpotlight()
        this.hasBall = false
    }

    drawRange() {
        this.rangeGraphic = new PIXI.Graphics()
        this.rangeGraphic.beginFill(0xffffff)
        this.rangeGraphic.alpha = this.showRange ? 0.2 : 0
        this.rangeGraphic.arc(0, 0, this.range, 0, Math.PI * 2)
        this.addChild(this.rangeGraphic)
    }

    drawSpotlight() {
        const angle = Math.atan2(this.y - 810, this.x - app.screen.width / 2)
        const d = Math.hypot(this.y - 810, this.x - app.screen.width / 2)
        const theta = Math.asin(this.range / d) * 2
        this.spotlight = new PIXI.Graphics()
        this.spotlight.beginFill(0xffffff)
        this.spotlight.alpha = this.showRange ? 0.2 : 0
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
        this.spotlight.alpha = this.showRange ? 0.2 : 0
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

        return [x, y]
    }

    ballInRange() {
        const angle = Math.atan2(this.y - 810, this.x - app.screen.width / 2) + Math.PI * 2
        const d = Math.hypot(this.y - 810, this.x - app.screen.width / 2)
        const theta = Math.asin(this.range / d) * 2

        return angle - theta < game.ball.rotation && angle + theta > game.ball.rotation
    }

    hasPrediction() {
        return Math.hypot(this.prediction.x, this.prediction.y) !== 0
    }

    shouldDetect() {
        return ['hit', 'landing'].includes(game.state)
    }

    detect() {
        if (this.ballInRange() && !this.hasPrediction()) {
            const prediction = this.predict()
            this.prediction.set(...prediction)
            console.log(`${this.name} detected the ball`)
        }
    }

    shouldMove() {
        return ['hit', 'landing', 'throwBall'].includes(game.state)
    }

    move() {
        if (this.shouldMoveToPrediction()) this.moveToPrediction()
        if (this.shouldMoveToBase()) this.moveToBase()
        this.updateSpotlight()
    }

    shouldMoveToPrediction() {
        return this.hasPrediction() && ['hit', 'landing'].includes(game.state) && !this.hasBall
    }

    moveToPrediction() {
        const diff = [this.prediction.x - this.x, this.prediction.y - this.y]
        const distance = Math.hypot(diff[0], diff[1])
        if (distance < this.speed) return
        const velocity = [diff[0] / distance * this.speed, diff[1] / distance * this.speed]
        this.position.set(this.x + velocity[0], this.y + velocity[1])
    }

    caughtBall() {
        const distance = Math.hypot(game.ball.x - this.x, game.ball.y - this.y, game.ball.z)
        return distance < Math.max(this.speed, game.ball.speed)
    }

    shouldCatch() {
        return !['out'].includes(game.state) && !this.hasBall
    }

    catchBall() {
        if (this.caughtBall()) {
            console.log(`${this.name} caught the ball`)
            this.hasBall = true
            game.ball.stop()
            game.ball.position.set(this.x, this.y)
            this.prediction.set(0, 0)
        }
    }

    shouldThrow() {
        return this.caughtBall() &&
            this.name !== 'fielder1B'
    }

    throwBall() {
        const firstBase = [1200, 365]
        game.ball.speed = 20
        game.ball.theta = 0
        game.ball.rotation = Math.atan2(firstBase[1] - this.y, firstBase[0] - this.x)
        game.state = 'throwBall'
        this.hasBall = false
        game.ball.move()
    }

    shouldMoveToBase() {
        return (this.caughtBall() && this.name === 'fielder1B') ||
            (!this.ballInRange() && this.name === 'fielder1B')
    }

    moveToBase() {
        const firstBase = [1200, 365]
        const diff = [firstBase[0] - this.x, firstBase[1] - this.y]
        const distance = Math.hypot(diff[0], diff[1])
        if (distance < this.speed) return
        const velocity = [diff[0] / distance * this.speed, diff[1] / distance * this.speed]
        this.position.set(this.x + velocity[0], this.y + velocity[1])
        if (this.hasBall) game.ball.position.set(this.x, this.y)
    }

    canMakeOut() {
        const firstBase = [1200, 365]
        const diff = [firstBase[0] - this.x, firstBase[1] - this.y]
        const distance = Math.hypot(diff[0], diff[1])
        return game.batter.state !== 'out' && distance < this.speed && this.hasBall
    }

    makeOut() {
        game.batter.state = 'out'
        if (!game.batters.some(batter => batter.state === null)) {
            game.state = 'finish'
            dispatchEvent(new Event('finish'))
        }
    }

    update() {
        if (this.shouldDetect()) this.detect()
        if (this.shouldMove()) this.move()
        if (this.shouldCatch()) this.catchBall()
        if (this.shouldThrow()) this.throwBall()
        if (this.canMakeOut()) this.makeOut()
    }
}

addEventListener('finish', () => {
    setTimeout(() => {
        game.reset()
        game.batter = new Batter('batter', app.screen.width / 2 - 28, 805)

    }, 2000)
})

