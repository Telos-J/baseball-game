import * as PIXI from 'pixi.js'

class Game extends PIXI.Container {
    constructor() {
        super()
        this.homerun = false
        this.pointsEarned = 0
        this.fielders = []
        this.state = 'beforePitch'
    }

    moveCamera() {
        if (this.ball.y < 366) {
            this.x -= this.ball.vx
            this.y -= this.ball.vy
        }
    }

    start() {
        setTimeout(() => {
            this.ball.pitch()
        }, 3000)
    }

    reset() {
        this.x = 0
        this.y = 0
        this.state = 'beforePitch'
        this.ball.reset()
        for (const fielder of this.fielders) {
            fielder.position.set(fielder.initialPosition[0], fielder.initialPosition[1])
            fielder.prediction.set(0, 0)
            fielder.updateSpotlight()
        }
        this.scoreboard.update()
        this.start()
    }

    loop(deltaTime) {
        this.ball.move(deltaTime)
        this.ball.bound()
        this.bat.swing()
        this.moveCamera()
        if (['hit', 'landing'].includes(this.state)) {
            this.fielder1B.move()
            this.fielder2B.move()
            this.fielder3B.move()
            this.fielderSS.move()
        }
        console.log(this.state)
    }
}

export default new Game()
