import * as PIXI from 'pixi.js'
import { app, loader } from './app'

class Game extends PIXI.Container {
    constructor() {
        super()
        this.inningSituation = false
        this.pitched = false
        this.homerun = false
        this.pointsEarned = 0
        this.fielders = []
        this.prediction = {
            x: null,
            y: null
        }
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
        game.addChild(this)
        this.x = app.screen.width / 2 - 15
        this.y = 366
        this.z = 0
        this.speed = 0
        this.vx = 0
        this.vy = 0
        this.vz = 0
        this.theta = 0
        this.rotation = Math.PI / 2
        this.texture = loader.resources.baseball.texture
        this.anchor.set(0.5)
        this.scale.set(0.01)
        this.timeoutset = false
    }

    calcPosition() {
        let speed = this.speed
        let theta = this.theta
        let rotation = this.rotation
        let x = this.x
        let y = this.y
        let z = 0
        let vx, vy, vz
        const airResistance = 0.01
        const g = 1

        do {
            vx = speed * Math.cos(theta) * Math.cos(rotation)
            vy = speed * Math.cos(theta) * Math.sin(rotation)
            vz = speed * Math.sin(theta) - g

            speed = Math.hypot(vx, vy, vz) - airResistance * speed
            theta = Math.atan2(vz, Math.hypot(vx, vy))
            x += vx
            y += vy
            z += vz - g
        } while (z > 0)

        game.prediction.x = x
        game.prediction.y = y
    }

    move(deltaTime) {
        const airResistance = 0.01
        const g = 1
        this.vx = this.speed * Math.cos(this.theta) * Math.cos(this.rotation)
        this.vy = this.speed * Math.cos(this.theta) * Math.sin(this.rotation)
        if (this.vy < 0) this.vz = this.speed * Math.sin(this.theta) - g ** deltaTime

        this.speed = Math.hypot(this.vx, this.vy, this.vz)
        this.theta = Math.atan2(this.vz, Math.hypot(this.vx, this.vy))

        this.x += this.vx * deltaTime
        this.y += this.vy * deltaTime
        if (this.vy < 0) this.z += this.vz * deltaTime - g * deltaTime ** 2

        if (this.vy < 0) this.speed -= airResistance * this.speed
        if (this.z < 0) {
            this.speed = 0
            this.vz = 0
            this.z = 0
        }

        this.scale.set(Math.sqrt(this.z) / 1000 + 0.01)

        if (game.pitched === true && this.speed === 0 && this.timeoutset === false) {
            setTimeout(() => {
                this.position.set(app.screen.width / 2, 366)
                game.x = 0
                game.y = 0
                game.pitched = false
                for (const fielder of game.fielders) {
                    fielder.position.set(fielder.initialPosition[0], fielder.initialPosition[1])
                }
            }, 2 * 1000)
            this.timeoutset = true
            game.scoreboard.score.text = parseInt(game.scoreboard.score.text) + game.pointsEarned
            game.pointsEarned = 0
        }
    }

    bound() {
        if (this.y > 850) {
            this.position.set(app.screen.width / 2, 366)
            this.speed = 0
        } else if ((this.x - app.screen.width / 2) ** 2 + (this.y - 800) ** 2 > 1900 ** 2) {
            setTimeout(() => {
                this.position.set(app.screen.width / 2, 366)
                this.z = 0
                game.y = 0
                game.homerun = false
            }, 2 * 1000)
            //this.speed = 0
            //game.vy = 0
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

        //if (this.rotationSpeed !== 0 && game.ball.y > 780 && game.ball.vy > 0 && game.ball.y < 800 && this.rotation > Math.PI - Math.PI && this.rotation < Math.PI - Math.PI / 1.5) {
        //    game.ball.speed = 30
        //    game.ball.theta = Math.PI / 3
        //    game.ball.rotation = Math.PI * (0.4 * Math.random() + 1.3)
        //    game.pointsEarned = 100
        //} else if (this.rotationSpeed !== 0 && game.ball.y > 760 && game.ball.vy > 0 && game.ball.y < 820 && this.rotation > Math.PI - Math.PI && this.rotation < Math.PI - Math.PI / 1.5) {
        //    game.ball.speed = 5 * Math.random() + 10
        //    game.ball.theta = Math.PI / 3
        //    game.ball.rotation = Math.PI * (0.4 * Math.random() + 1.3)
        //    game.pointsEarned = 20
        //} else if (this.rotationSpeed !== 0 && game.ball.y > 730 && game.ball.vy > 0 && game.ball.y < 840 && this.rotation > Math.PI - Math.PI && this.rotation < Math.PI - Math.PI / 1.5) {
        //    game.ball.speed = 5 * Math.random() + 5
        //    game.ball.theta = Math.PI / 3
        //    game.ball.rotation = Math.PI * (0.4 * Math.random() + 1.3)
        //    game.pointsEarned = 5
        //}
        if (this.rotationSpeed !== 0 && game.ball.y > 730 && game.ball.vy > 0 && game.ball.y < 840 && this.rotation > Math.PI - Math.PI && this.rotation < Math.PI - Math.PI / 1.5) {
            game.ball.speed = 55
            game.ball.theta = Math.PI / 2.3
            game.ball.rotation = Math.PI * (0.4 * Math.random() + 1.3)
            game.pointsEarned = 5
            game.ball.calcPosition()
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

class Bunny extends PIXI.Sprite {
    constructor(name, x, y) {
        super()
        this.name = name
        if (this.name.includes('fielder')) game.fielders.push(this)
        this.speed = 3
        this.anchor.set(0.5)
        this.scale.set(2)
        this.vx = 0
        this.vy = 0
        this.position.x = x
        this.position.y = y
        this.initialPosition = [this.position.x, this.position.y]
        this.range = 50
        this.rangeGraphic = new PIXI.Graphics()
        this.rangeGraphic.beginFill(0xffffff)
        this.rangeGraphic.arc(0, 9, this.range, 0, Math.PI * 2)
        //this.addChild(this.rangeGraphic)
        this.rangeGraphic.alpha = 0.2
        this.texture = loader.resources.bunny.texture
        game.addChild(this)
    }

    drawRange() {
        const angle = Math.atan2(this.y - 780, this.x - app.screen.width / 2)
        const line = new PIXI.Graphics()
        line.beginFill(0x000)
        line.drawRect(0, 0, 1000, 2)
        line.position.set(app.screen.width / 2, 780)
        line.rotation = angle + Math.PI * 0.05
        game.addChild(line)
        const line2 = new PIXI.Graphics()
        line2.beginFill(0x000)
        line2.drawRect(0, 0, 1000, 2)
        line2.position.set(app.screen.width / 2, 780)
        line2.rotation = angle - Math.PI * 0.05
        game.addChild(line2)
    }

    move() {
        const angle = Math.atan2(this.y - 780, this.x - app.screen.width / 2) + Math.PI * 2
        if (angle - Math.PI * 0.05 < game.ball.rotation && angle + Math.PI * 0.05 > game.ball.rotation && game.pitched) {
            console.log(`${this.name} detected the ball!!`)
            const diff = [game.prediction.x - this.x, game.prediction.y - this.y]
            const distance = Math.hypot(diff[0], diff[1])
            if (distance < this.speed) return
            const velocity = [diff[0] / distance * this.speed, diff[1] / distance * this.speed]
            this.position.set(this.x + velocity[0], this.y + velocity[1])
        }
    }
}

export { game, Ball, Bat, Stadium, Scoreboard, Bunny }
