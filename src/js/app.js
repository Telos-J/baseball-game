import '../css/style.scss'
import * as PIXI from 'pixi.js'
import game from './game'
import Ball from './ball'
import Bat from './bat'
import Stadium from './stadium'
import Fielder from './fielder'
import Bunny from './bunny'
import Scoreboard from './scoreboard'
import Batter from './batter'

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
    game.pitcher = new Bunny('pitcher', app.screen.width / 2 + 25, 365)
    game.batter = new Batter('batter', app.screen.width / 2 - 28, 805)
    game.fielder1B = new Fielder('fielder1B', 1200, 190)
    game.fielder2B = new Fielder('fielder2B', 960, 60)
    game.fielderSS = new Fielder('fielderSS', 650, 60)
    game.fielder3B = new Fielder('fielder3B', 400, 190)
    game.ball = new Ball()
    game.bat = new Bat()
    game.scoreboard = new Scoreboard()

    game.start()
    app.ticker.add(deltaTime => game.loop(deltaTime))
}

export { app, loader }

