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
    game.pitcher = new Bunny()
    game.pitcher.position.set(app.screen.width / 2 + 15, 365)
    game.batter = new Bunny()
    game.batter.position.set(app.screen.width / 2 - 40, 810)
    game.fielder1B = new Bunny()
    game.fielder1B.position.set(1200, 190)
    game.fielder2B = new Bunny()
    game.fielder2B.position.set(960, 60)
    game.fielderSS = new Bunny()
    game.fielderSS.position.set(650, 60)
    game.fielder3B = new Bunny()
    game.fielder3B.position.set(400, 190)
    game.ball = new Ball()
    game.bat = new Bat()
    game.scoreboard = new Scoreboard()
    
const angle = Math.atan2(game.fielder2B.y - 780, game.fielder2B.x - app.screen.width / 2)

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
    
    setInterval(() => {
        if (game.inningSituation === false && game.ball.vy === 0 && game.pitched === false) {
            game.pitched = true
            game.ball.speed = 1*Math.random() + 5
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
    game.fielder3B.move()
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

