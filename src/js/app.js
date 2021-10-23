import '../css/style.scss'
import * as PIXI from 'pixi.js'
import { game, Ball, Bat, Stadium, Scoreboard, Bunny } from './game'

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
    app.stage.addChild(game)
    game.stadium = new Stadium()
    game.pitcher = new Bunny('pitcher', app.screen.width / 2 + 15, 365)
    game.batter = new Bunny('batter', app.screen.width / 2 - 40, 810)
    game.fielder1B = new Bunny('fielder1B', 1200, 190)
    game.fielder2B = new Bunny('fielder2B', 960, 60)
    game.fielderSS = new Bunny('fielderSS', 650, 60)
    game.fielder3B = new Bunny('fielder3B', 400, 190)
    game.ball = new Ball()
    game.bat = new Bat()
    game.scoreboard = new Scoreboard()

    //game.fielder1B.drawRange()
    //game.fielder.drawRange()
    //game.fielder3B.drawRange()
    //game.fielderSS.drawRange()

    setInterval(() => {
        if (game.inningSituation === false && game.ball.vy === 0 && game.pitched === false) {
            game.pitched = true
            game.ball.speed = 1 * Math.random() + 5
            game.ball.timeoutset = false
            game.ball.rotation = Math.PI / 2
        }
    }, 3 * 1000)
    app.ticker.add(gameLoop)
}

function gameLoop(deltaTime) {
    game.ball.move(deltaTime)
    game.ball.bound()
    game.bat.swing()
    game.move()
    game.fielder1B.move()
    game.fielder2B.move()
    game.fielder3B.move()
    game.fielderSS.move()
}

class Game extends PIXI.Container {
    constructor() {
        super()
    }

    move() {
        if (this.ball.y < 366) {
            this.x -= this.ball.vx
            this.y -= this.ball.vy
        }
    }
}

addEventListener('keydown', e => {
    if (e.code === 'Space') {
        if (game.inningSituation === true) {
            game.ball.vy = 15
        } else {
            game.bat.rotationSpeed = Math.PI / 10
        }
    }
})

export { app, loader }

