import * as PIXI from 'pixi.js'
import { app, loader } from './app'
import game from './game'

export default class Stadium extends PIXI.Sprite {
    constructor() {
        super()
        game.addChild(this)
        this.position.set(app.screen.width / 2, app.screen.height / 2 - 350)
        this.anchor.set(0.5)
        this.scale.set(0.8)
        this.texture = loader.resources.stadium.texture
    }
}


