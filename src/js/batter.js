import Bunny from './bunny'
import game from './game'
import * as PIXI from 'pixi.js'
import { app } from './app'

export default class Batter extends Bunny{
    constructor(name, x, y){
        super(name, x, y)
        if (name.includes('batter')) game.batters.push(this)
        this.power = 0.4 * Math.random() + 0.8
        this.speed = 4
    }

    move() {
        if (game.state === 'hit'){
            const diff = [1200 - this.x, 365 - this.y]
            const distance = Math.hypot(diff[0], diff[1])
            const velocity = [diff[0] / distance * this.speed, diff[1] / distance * this.speed]
            this.position.set(this.x + velocity[0], this.y + velocity[1])   
        } 
    }

    reset() {
        this.position.set(this.initialPosition[0], this.initialPosition[1])
    }
}

