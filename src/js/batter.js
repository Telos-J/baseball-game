import Bunny from './bunny'
import game from './game'

export default class Batter extends Bunny {
    constructor(name, x, y) {
        super(name, x, y)
        game.batters.push(this)
        this.power = 0.4 * Math.random() + 0.8
        this.speed = 4
        this.state = 'safe'
    }

    reset() {
        if (this.state === 'out') {
            game.removeChild(this)
        }
        this.position.set(this.initialPosition[0], this.initialPosition[1])
        this.tint = 0xffffff
    }

    shouldMove() {
        return !['beforePitch', 'pitch', 'strike', 'out'].includes(game.state)
    }

    move() {
        const firstBase = [1200, 365]
        const diff = [firstBase[0] - this.x, firstBase[1] - this.y]
        const distance = Math.hypot(diff[0], diff[1])
        if (distance < this.speed && game.state !== 'safe') {
            game.state = 'safe'
            dispatchEvent(new Event('safe'))
            return
        }
        const velocity = [diff[0] / distance * this.speed, diff[1] / distance * this.speed]
        this.position.set(this.x + velocity[0], this.y + velocity[1])
    }

    isOut() {
        return game.state === 'out'
    }

    update() {
        if (this.isOut()) this.tint = 0xff0000
        if (this.shouldMove()) this.move()
    }
}

addEventListener('safe', () => {
    // setTimeout(() => {
    //     game.reset()
    // }, 2000)
})

