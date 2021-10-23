import * as PIXI from 'pixi.js'
import { app, loader } from './app'
import game from './game'

export default class Stadium extends PIXI.Sprite {
    constructor() {
        super()
        this.position.set(app.screen.width / 2, app.screen.height / 2 - 350)
        this.anchor.set(0.5)
        this.scale.set(3)
        this.texture = loader.resources.stadium.texture
        game.addChild(this)
    }
}

