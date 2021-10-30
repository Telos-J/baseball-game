import * as PIXI from 'pixi.js'
import { loader } from './app'
import game from './game'

export default class Bat extends PIXI.Sprite {
    constructor() {
        super()
        game.addChild(this)
        this.position.set(750, 800)
        this.scale.set(0.05)
        this.rotation = Math.PI
        this.rotationSpeed = 0
        this.anchor.set(0, 1)
        this.texture = loader.resources.baseballBat.texture
    }


    update() {
        this.rotation -= this.rotationSpeed
        if (this.rotation < Math.PI - Math.PI * 2) {
            this.rotation = Math.PI
            this.rotationSpeed = 0
        }

        // if (this.rotationSpeed !== 0 && game.ball.y > 780 && game.ball.vy > 0 && game.ball.y < 800 && this.rotation > Math.PI - Math.PI && this.rotation < Math.PI - Math.PI / 1.5) {
        //     game.ball.speed = 30
        //     game.ball.vz = 7
        //     game.ball.rotation = Math.PI * (0.4 * Math.random() + 1.3)
        //     game.pointsEarned = 100
        // } else if (this.rotationSpeed !== 0 && game.ball.y > 760 && game.ball.vy > 0 && game.ball.y < 820 && this.rotation > Math.PI - Math.PI && this.rotation < Math.PI - Math.PI / 1.5) {
        //     game.ball.speed = 5 * Math.random() + 10 
        //     game.ball.vz = 10
        //     game.ball.rotation = Math.PI * (0.4 * Math.random() + 1.3)
        //     game.pointsEarned = 20
        //}
        if (this.rotationSpeed !== 0 && game.ball.y > 730 && game.ball.vy > 0 && game.ball.y < 840 && this.rotation > Math.PI - Math.PI && this.rotation < Math.PI - Math.PI / 1.5) {
            game.ball.speed = 47
            game.ball.theta = Math.PI / 3//2.4
            game.ball.rotation = Math.PI * (0.4 * Math.random() + 1.3)
            game.pointsEarned = 5
            game.state = 'hit'
        }
    }

    canSwing() {
        return game.state === 'pitch'
    }
}

addEventListener('keydown', e => {
    if (e.code === 'Space') {
        if (game.bat.canSwing()) game.bat.rotationSpeed = Math.PI / 10
    }
})

