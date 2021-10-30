import * as PIXI from 'pixi.js'
import { loader } from './app'
import game from './game'

export default class Bunny extends PIXI.Sprite {
    constructor(name, x, y) {
        super()
        game.addChild(this)
        this.name = name
        this.speed = 3
        this.anchor.set(0.5)
        this.scale.set(2)
        this.vx = 0
        this.vy = 0
        this.position.x = x
        this.position.y = y
        this.initialPosition = [this.position.x, this.position.y]
        this.texture = loader.resources.bunny.texture
        this.state = 'idle'
    }
}
