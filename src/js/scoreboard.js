import * as PIXI from 'pixi.js'
import { app, loader } from './app'
import game from './game'

export default class Scoreboard extends PIXI.Graphics {
    constructor() {
        super()
        this.points = 0
        this.strikes = 0
        this.outs = 0
        app.stage.addChild(this)

        this.beginFill(0x9d373a)
        this.drawRect(10, 10, 200, 300)
        this.beginFill(0x991e23)
        this.drawRect(10, 160, 200, 150)
        this.beginFill(0x9d373a)
        this.drawRect(10, 310, 200, 150)

        let text = new PIXI.Text('Score', { fontFamily: 'serif', fontSize: 50, fill: 0xffffff });
        text.anchor.set(0.5)
        this.addChild(text)
        text.position.set(110, 45)

        text = new PIXI.Text('Outs', { fontFamily: 'serif', fontSize: 50, fill: 0xffffff });
        text.anchor.set(0.5)
        this.addChild(text)
        text.position.set(110, 200)
        this.score = new PIXI.Text(parseInt('0'), { fontFamily: 'serif', fontSize: 50, fill: 0xffffff });
        this.score.anchor.set(0.5)
        this.addChild(this.score)
        this.score.position.set(110, 105)

        text = new PIXI.Text('Strikes', { fontFamily: 'serif', fontSize: 50, fill: 0xffffff });
        text.anchor.set(0.5)
        text.position.set(110, 350)
        this.addChild(text)
    }
}

