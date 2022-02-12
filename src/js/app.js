import '../favicon.ico'
import '../image.png'
import '../icon-192.png'
import '../icon-512.png'
import '../css/style.scss'
import * as THREE from 'three'
import { setHelpers } from './helpers'
import { onLoadDo } from './loaders'
import { ambientLight, dirLight } from './light'
import { worldDimensions, toWorldDimensions } from './world'
import { setupListeners } from './listeners'
import camera from './camera'
import Ball from './ball'
import Stadium from './stadium'
import Pitcher from './pitcher'
import Fielder, { fielders } from './fielder'
import Batter, { batters, controlBatter } from './batter'
import Bat from './bat'
import { Vector3 } from 'three'

async function setupGame() {
    const stadium = await Stadium(worldDimensions)

    const pitcher = new Pitcher()
    const fielder1B = new Fielder('fielder1B', toWorldDimensions(518, 0, 405))
    const fielder2B = new Fielder('fielder2B', toWorldDimensions(476, 0, 342))
    const fielder3B = new Fielder('fielder3B', toWorldDimensions(275, 0, 394))
    const fielderSS = new Fielder('fielderSS', toWorldDimensions(334, 0, 326))
    const fielderLF = new Fielder('fielderLF', toWorldDimensions(201, 0, 193))
    const fielderCF = new Fielder('fielderCF', toWorldDimensions(377, 0, 130))
    const fielderRF = new Fielder('fielderRF', toWorldDimensions(574, 0, 171))
    for (let i = 0; i < 9; i++) {
        const batter = new Batter(`batter${ i + 1 }`, toWorldDimensions(482 + (i - 1) * 15, 0, 596 - (i - 1) * 15))
        scene.add(batter)
        batter.state = 'waiting'
    }
    console.log(batters)
    controlBatter = batters[0]
    const ball = await Ball()
    const bat = await Bat()

    scene.add(ball)
    scene.add(bat)
    scene.add(stadium)
    scene.add(pitcher)
    scene.add(fielder1B)
    scene.add(fielder2B)
    scene.add(fielder3B)
    scene.add(fielderSS)
    scene.add(fielderLF)
    scene.add(fielderCF)
    scene.add(fielderRF)


    pitcher.equipBall(ball)
    controlBatter.equipBat(bat)
    renderer.render(scene, camera)
}

let isReset = false

function shouldReset() {
    const ball = scene.getObjectByName('ball')
    return ball.state === 'caught' && !isReset
    
}

function resetGame() {
    const ball = scene.getObjectByName('ball')
    const pitcher = scene.getObjectByName('pitcher')

    for (const fielder of fielders) {
        fielder.reset()
    }

    ball.reset(scene)
    // camera.setAngleBatting()

    const waiting = batters.filter(batter => batter.state === 'waiting')

    for (const b of batters) {
        if (b.state === 'waiting' && controlBatter.state === 'out') {
            const prevPosition = b.position
            b.position.set(prevPosition.x - 15, 0, prevPosition.z + 15)
        }
    }
    if (controlBatter.state === 'out') {
        controlBatter.rotation.set(0, Math.PI * 1.26, 0)
        controlBatter.position.copy(toWorldDimensions(482 + 15*(waiting.length), 0, 596 - 15*(waiting.length)))
    }
    isReset = false
}

function startGame() {
    const pitcher = scene.getObjectByName('pitcher')
    const ball = scene.getObjectByName('ball')

    setTimeout(() => {
        pitcher.pitch(ball)
    }, 1000)

    gameLoop()
}

function gameLoop() {
    const ball = scene.getObjectByName('ball')
    ball.move()
    ball.bound(scene)

    controlBatter.swingBatMixer.update(1 / 30)

    for (const fielder of fielders) {
        fielder.update(ball, controlBatter)
    }

    if (shouldReset()) {
        isReset = true
        setTimeout(() => {
            resetGame()
        }, 5000)
    }

    // controls.update()

    renderer.render(scene, camera)
    requestAnimationFrame(gameLoop)
    if (controlBatter.state === 'running') {
        controlBatter.run()
    }
}

function main() {
    setupGame()
    setupListeners(scene, renderer)
}

let scene = new THREE.Scene()
scene.background = new THREE.Color(0x87ceeb)

const renderer = new THREE.WebGLRenderer()
renderer.setSize(window.innerWidth, window.innerHeight)
document.body.appendChild(renderer.domElement)

const { controls } = setHelpers(scene, renderer)
scene.add(ambientLight)
scene.add(dirLight)

onLoadDo(startGame)

main()
