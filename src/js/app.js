import '../css/style.scss'
import * as PIXI from 'pixi.js'
import game from './game'
import Ball from './ball'
import Bat from './bat'
import Stadium from './stadium'
import Bunny from './bunny'
import Scoreboard from './scoreboard'

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

    game.start()
    app.ticker.add(() => game.loop())
}

addEventListener('keydown', e => {
    if (e.code === 'Space') {
        game.bat.rotationSpeed = Math.PI / 10
    }
})

export { app, loader }

