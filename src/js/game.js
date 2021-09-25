import * as PIXI from 'pixi.js'
import { app, loader } from './app'

class Game extends PIXI.Container {
    constructor() {
        super()
        this.inningSituation = false
        this.pitched = false
        this.homerun = false
        this.pointsEarned = 0
    }

    move() {
        if (this.ball.y < 366) {
            this.x -= this.ball.vx
            this.y -= this.ball.vy
        }
    }
}

const game = new Game()

class Ball extends PIXI.Sprite {
    constructor() {
        super()
        this.position.set(app.screen.width / 2, 366)
        this.speed = 0
        this.anchor.set(0.5)
        this.scale.set(0.01)
        this.vx = 0
        this.vy = 0
        this.rotation = Math.PI / 2
        this.texture = loader.resources.baseball.texture
        game.addChild(this)
        this.timeoutset = false
    }

    move() {
        let windResistance = 0.1
        this.vx = this.speed * Math.cos(this.rotation)
        this.vy = this.speed * Math.sin(this.rotation)
        this.x += this.vx
        this.y += this.vy
        if (this.vy < 0) {
            this.speed -= windResistance
            if (this.speed < 0) {
                this.speed = 0
            }
        }

        if (game.pitched === true && this.speed === 0 && this.timeoutset === false) {
            setTimeout(() => {
                this.position.set(app.screen.width / 2, 366)
                game.x = 0
                game.y = 0
                game.pitched = false
            }, 2 * 1000)
            this.timeoutset = true
            game.scoreboard.score.text = parseInt(game.scoreboard.score.text) + game.pointsEarned
            game.pointsEarned = 0
        }
    }

    bound() {
        if (this.y > 851) {
            this.position.set(app.screen.width / 2, 366)
            this.speed = 0
        } else if (this.y < -900) {
            setTimeout(() => {
                this.position.set(app.screen.width / 2, 366)
                game.y = 0
                game.homerun = false
            }, 2 * 1000)
            this.speed = 0
            game.vy = 0
            game.homerun = true
        }
    }
}

class Bat extends PIXI.Sprite {
    constructor() {
        super()
        this.position.set(750, 800)
        this.scale.set(0.05)
        this.rotation = Math.PI
        this.rotationSpeed = 0
        this.anchor.set(0, 1)
        this.texture = loader.resources.baseballBat.texture
        game.addChild(this)
    }


    swing() {
        this.rotation -= this.rotationSpeed
        if (this.rotation < Math.PI - Math.PI * 2) {
            this.rotation = Math.PI
            this.rotationSpeed = 0
        }

        if (this.rotationSpeed !== 0 && game.ball.y > 760 && game.ball.vy > 0 && game.ball.y < 780 && this.rotation > Math.PI - Math.PI && this.rotation < Math.PI - Math.PI / 1.5) {
            game.ball.speed = 6 * Math.random() + 42
            game.ball.rotation = Math.PI / (0.4 * Math.random() + 1.3)
            game.pointsEarned = 10
        } else if (this.rotationSpeed !== 0 && game.ball.y > 745 && game.ball.vy > 0 && game.ball.y < 810 && this.rotation > Math.PI - Math.PI && this.rotation < Math.PI - Math.PI / 1.5) {
            game.ball.speed = 20 * Math.random() + 15
            game.ball.rotation = Math.PI / (0.4 * Math.random() + 1.3)
            game.pointsEarned = 5
        } else if (this.rotationSpeed !== 0 && game.ball.y > 670 && game.ball.vy > 0 && game.ball.y < 900 && this.rotation > Math.PI - Math.PI && this.rotation < Math.PI - Math.PI / 1.5) {
            game.ball.speed = 10 * Math.random() + 10
            game.ball.rotation = Math.PI * (0.4 * Math.random() + 1.3)
            game.pointsEarned = 100
        }
    }
}

class Stadium extends PIXI.Sprite {
    constructor() {
        super()
        this.position.set(app.screen.width / 2, app.screen.height / 2 - 350)
        this.anchor.set(0.5)
        this.scale.set(3)
        this.texture = loader.resources.stadium.texture
        game.addChild(this)
    }
}

class Scoreboard extends PIXI.Graphics {
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

export { game, Ball, Bat, Stadium, Scoreboard }
