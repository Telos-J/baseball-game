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
let score = 0
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
    game.y += 5
    game.ball.move()
    game.ball.bound()
    game.bat.swing()
    // camera.move()
}

class Game extends PIXI.Container {
    constructor() {
        super()
        app.stage.addChild(this)
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
                camera.x = 0
                camera.y = 0
                pitched = false
            }, 2 * 1000)
            this.timeoutset = true
            score += pointsEarned
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
                camera.y = 0
                homerun = false
            }, 2 * 1000)
            this.speed = 0
            camera.vy = 0
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

        if (this.rotationSpeed !== 0 && ball.y > 760 && ball.vy > 0 && ball.y < 780 && this.rotation > Math.PI - Math.PI && this.rotation < Math.PI - Math.PI / 1.5) {
            ball.speed = 6 * Math.random() + 42
            ball.rotation = Math.PI / (0.4 * Math.random() + 1.3)
            pointsEarned = 10
        } else if (this.rotationSpeed !== 0 && ball.y > 745 && ball.vy > 0 && ball.y < 810 && this.rotation > Math.PI - Math.PI && this.rotation < Math.PI - Math.PI / 1.5) {
            ball.speed = 20 * Math.random() + 15
            ball.rotation = Math.PI / (0.4 * Math.random() + 1.3)
            pointsEarned = 5
        } else if (this.rotationSpeed !== 0 && ball.y > 670 && ball.vy > 0 && ball.y < 900 && this.rotation > Math.PI - Math.PI && this.rotation < Math.PI - Math.PI / 1.5) {
            ball.speed = 10 * Math.random() + 10
            ball.rotation = Math.PI * (0.4 * Math.random() + 1.3)
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

// class Camera {
//     constructor() {
//         this.x = 0
//         this.y = 0
//         this.vy = 0
//         this.vx = 0
//     }
//     move () {
//         if (ball.y < 366) {
//             this.x += ball.vx 
//             this.y += ball.vy 
//         }
//     }
// }

// class Scoreboard {
//     contructor(){
//         this.points = 0
//         this.strikes = 0
//         this.outs = 0
//     }

//     draw() {
//         context.fillStyle = '#9d373a'
//         context.fillRect(10, 10, 200, 300)
//         context.fillStyle = '#991e23'
//         context.fillRect(10, 160, 200, 150)
//         context.font = '50px serif'
//         context.fillStyle = 'White'
//         context.fillText('Score', 50, 70)
//         context.font = '50px serif'
//         context.fillStyle = 'White'
//         context.fillText(`${score}`, 90, 130)
//     }
// }

addEventListener('keydown', e => {
    if (e.code === 'Space') {
        if (inningSituation === true) {
            ball.vy = 15
        } else {
            bat.rotationSpeed = Math.PI / 10
        }
    }
})

