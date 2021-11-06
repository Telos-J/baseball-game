import Bunny from './bunny'
import game from './game'
import { app } from './app'

export default class Batter extends Bunny {
    constructor(name, x, y) {
        super(name, x, y)
        game.batters.push(this)
        this.power = 0.4 * Math.random() + 0.8
        this.speed = 4
        this.state = null
        this.nextBase = 1
    }

    reset() {
        if (this.state === 'out') {
            game.batters = game.batters.filter(batter => batter !== this)
            game.removeChild(this)
        } else if (this.state === 'safe') {
            this.nextBase++
            if (this.nextBase === 5) {
                game.batters = game.batters.filter(batter => batter !== this)
                game.removeChild(this)
                game.pointsEarned = 5
            }
        }

        this.state = null
        this.tint = 0xffffff
    }

    shouldMove() {
        return !['beforePitch', 'pitch', 'strike'].includes(game.state) && this.state !== 'out'
    }

    move() {
        const nextBase = game.bases[this.nextBase - 1]
        const diff = [nextBase[0] - this.x, nextBase[1] - this.y]
        const distance = Math.hypot(diff[0], diff[1])
        if (distance < this.speed) return
        const velocity = [diff[0] / distance * this.speed, diff[1] / distance * this.speed]
        this.position.set(this.x + velocity[0], this.y + velocity[1])
    }

    canMakeSafe() {
        const nextBase = game.bases[this.nextBase - 1]
        const diff = [nextBase[0] - this.x, nextBase[1] - this.y]
        const distance = Math.hypot(diff[0], diff[1])
        return this.state !== 'safe' && distance < this.speed && game.state !== 'finish'
    }

    makeSafe() {
        this.state = 'safe'
        if (!game.batters.some(batter => batter.state === null)) {
            game.state = 'finish'
            dispatchEvent(new Event('finish'))
        }
    }

    isOut() {
        return this.state === 'out'
    }

    update() {
        if (this.isOut()) this.tint = 0xff0000
        if (this.shouldMove()) this.move()
        if (this.canMakeSafe()) this.makeSafe()
    }
}
