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

loader.add('bunny', 'img/bunny.png')
    .add('baseball', 'img/baseball.png')
    .add('baseballBat', 'img/baseballbat.png')
    .add('stadium' , 'img/stadium.png')
    .add('homerunSign' , 'img/homerunSign.png')

    loader.onProgress.add(handleProgress)

function handleProgress(loader, resource) {
    console.log(`Progress: ${loader.progress}%`);
}

loader.load(onAssetsLoaded)

function onAssetsLoaded(loader, resources) {
  
    app.ticker.add(gameLoop)
}

function gameLoop() {

}


