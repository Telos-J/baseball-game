import * as PIXI from 'pixi.js'

class Game extends PIXI.Container {
    constructor() {
        super()
        this.homerun = false
        this.pointsEarned = 0
        this.fielders = []
        this._state = 'beforePitch'
    }

    get state() {
        return this._state
    }

    set state(state) {
        if (state === this._state) return
        this._state = state
        console.log(`Game state: ${this._state}`)
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
        for (const fielder of this.fielders) fielder.reset()
        this.scoreboard.update()
        this.start()
    }

    loop(deltaTime) {
        this.ball.update(deltaTime)
        this.bat.update()
        for (const fielder of this.fielders) fielder.update()
        this.moveCamera()
    }
}

const game = new Game()

export default game
