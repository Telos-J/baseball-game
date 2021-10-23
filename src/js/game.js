import * as PIXI from 'pixi.js'

class Game extends PIXI.Container {
    constructor() {
        super()
        this.pitched = false
        this.homerun = false
        this.pointsEarned = 0
        this.fielders = []
    }

    move() {
        if (this.ball.y < 366) {
            this.x -= this.ball.vx
            this.y -= this.ball.vy
        }
    }

    start() {
        setInterval(() => {
            if (this.ball.vy === 0 && this.pitched === false) {
                this.ball.pitch()
            }
        }, 3 * 1000)
    }

    reset() {
        this.x = 0
        this.y = 0
        this.pitched = false
        for (const fielder of this.fielders) {
            fielder.position.set(fielder.initialPosition[0], fielder.initialPosition[1])
            fielder.prediction.set(0, 0)
            fielder.updateSpotlight()
        }
    }

    loop(deltaTime) {
        this.ball.move(deltaTime)
        this.ball.bound()
        this.bat.swing()
        this.move()
        this.fielder1B.move()
        this.fielder2B.move()
        this.fielder3B.move()
        this.fielderSS.move()
    }
}

export default new Game()
