import '../css/style.scss'
import * as PIXI from 'pixi.js'
import { game, Ball, Bat, Stadium, Scoreboard } from './game'

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
    game.ball = new Ball()
    game.bat = new Bat()
    game.scoreboard = new Scoreboard()

    setInterval(() => {
        if (game.inningSituation === false && game.ball.vy === 0 && game.pitched === false) {
            game.pitched = true
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
