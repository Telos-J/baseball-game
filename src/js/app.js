import '../css/style.scss'
import * as PIXI from 'pixi.js'

const type = PIXI.utils.isWebGLSupported() ? 'WebGL' : 'canvas'
PIXI.utils.sayHello(type)

const app = new PIXI.Application({
    width: 1600,
    height: 900,
    backgroundColor: 0xffc08b,
    resolution: devicePixelRatio || 1,
});

document.body.appendChild(app.view)

const loader = PIXI.Loader.shared

let homerun = false
let inningSituation = false
let pitched = false
let pointsEarned = 0

loader.add('bunny', 'img/bunny.png')
    .add('baseball', 'img/baseball.png')
    .add('baseballBat', 'img/baseballbat.png')
    .add('stadium', 'img/stadium.png')
    .add('homerunSign', 'img/homerunSign.png')

loader.onProgress.add(handleProgress)

function handleProgress(loader, resource) {
    console.log(`Progress: ${loader.progress}%`);
}

loader.load(onAssetsLoaded)

function onAssetsLoaded(loader, resources) {
    game.stadium = new Stadium()
    game.ball = new Ball()
    game.bat = new Bat()
    game.scoreboard = new Scoreboard()

    setInterval(() => {
        if (inningSituation === false && game.ball.vy === 0 && pitched === false) {
            pitched = true
            game.ball.speed = Math.random() + 5
            game.ball.timeoutset = false
            game.ball.rotation = Math.PI / 2
        }
    }, 3 * 1000)
    app.ticker.add(gameLoop)
}

function gameLoop() {
    game.ball.move()
    game.ball.bound()
    game.bat.swing()
    game.move()
}

class Game extends PIXI.Container {
    constructor() {
        super()
        app.stage.addChild(this)
    }
    move () {
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

        if (pitched === true && this.speed === 0 && this.timeoutset === false) {
            setTimeout(() => {
                this.position.set(app.screen.width / 2, 360)
                game.x = 0
                game.y = 0
                pitched = false
            }, 2 * 1000)
            this.timeoutset = true
            game.scoreboard.score.text += parseInt(game.scoreboard.score.text) + pointsEarned
            console.log(pointsEarned)

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
                homerun = false
            }, 2 * 1000)
            this.speed = 0
            game.vy = 0
            homerun = true
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
            pointsEarned = 10
        } else if (this.rotationSpeed !== 0 && game.ball.y > 745 && game.ball.vy > 0 && game.ball.y < 810 && this.rotation > Math.PI - Math.PI && this.rotation < Math.PI - Math.PI / 1.5) {
            game.ball.speed = 20 * Math.random() + 15
            game.ball.rotation = Math.PI / (0.4 * Math.random() + 1.3)
            pointsEarned = 5
        } else if (this.rotationSpeed !== 0 && game.ball.y > 670 && game.ball.vy > 0 && game.ball.y < 900 && this.rotation > Math.PI - Math.PI && this.rotation < Math.PI - Math.PI / 1.5) {
            game.ball.speed = 10 * Math.random() + 10
            game.ball.rotation = Math.PI * (0.4 * Math.random() + 1.3)
            pointsEarned = 100
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

class Scoreboard extends PIXI.Graphics{
    constructor(){
        super()
        this.points = 0
        this.strikes = 0
        this.outs = 0
        app.stage.addChild(this)
        this.beginFill(0x9d373a)
        this.drawRect(10, 10, 200, 300)
        this.beginFill(0x991e23)
        this.drawRect(10, 160, 200, 150)
        let text = new PIXI.Text('Score',{fontFamily : 'serif', fontSize: 50, fill : 0xffffff, align : 'center'});
        text.anchor.set(0.5)
        this.addChild(text)
        text.position.set(110, 45)
        text = new PIXI.Text('Outs', { fontFamily: 'serif', fontSize: 50, fill: 0xffffff, align: 'center' });
        text.anchor.set(0.5)
        this.addChild(text)
        text.position.set(110, 200)
        this.score = new PIXI.Text(parseInt('0'), { fontFamily: 'serif', fontSize: 50, fill: 0xffffff, align: 'center' });
        this.score.anchor.set(0.5)
        this.addChild(this.score)
        this.score.position.set(110, 105)
    }

    draw() {
        context.fillStyle = '#9d373a'
        context.fillRect(10, 10, 200, 300)
        context.fillStyle = '#991e23'
        context.fillRect(10, 160, 200, 150)
        context.font = '50px serif'
        context.fillStyle = 'White'
        context.fillText('Score', 50, 70)
        context.font = '50px serif'
        context.fillStyle = 'White'
        context.fillText(`${score}`, 90, 130)
    }
}

addEventListener('keydown', e => {
    if (e.code === 'Space') {
        if (inningSituation === true) {
            game.ball.vy = 15
        } else {
            game.bat.rotationSpeed = Math.PI / 10
        }
    }
})

