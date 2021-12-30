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
import Batter from './batter'
import Bat from './bat'

async function setupGame() {
    const stadium = await Stadium(worldDimensions)
    const batter = new Batter()
    const pitcher = new Pitcher()
    const fielder1B = new Fielder('fielder1B', ...toWorldDimensions(518, 405))
    const fielder2B = new Fielder('fielder2B', ...toWorldDimensions(476, 342))
    const fielder3B = new Fielder('fielder3B', ...toWorldDimensions(275, 394))
    const fielderSS = new Fielder('fielderSS', ...toWorldDimensions(334, 326))
    const fielderLF = new Fielder('fielderLF', ...toWorldDimensions(201, 193))
    const fielderCF = new Fielder('fielderCF', ...toWorldDimensions(377, 130))
    const fielderRF = new Fielder('fielderRF', ...toWorldDimensions(574, 171))
    const ball = await Ball()
    const bat = await Bat()

    scene.add(ball)
    scene.add(bat)
    scene.add(stadium)
    scene.add(pitcher)
    scene.add(batter)
    scene.add(fielder1B)
    scene.add(fielder2B)
    scene.add(fielder3B)
    scene.add(fielderSS)
    scene.add(fielderLF)
    scene.add(fielderCF)
    scene.add(fielderRF)

    pitcher.equipBall(ball)
    batter.equipBat(bat)
    renderer.render(scene, camera)
}

function resetGame() {
    const ball = scene.getObjectByName('ball')
    const batter = scene.getObjectByName('batter')
    const pitcher = scene.getObjectByName('pitcher')

    for (const fielder of fielders) {
        fielder.reset()
        ball.reset()
    }
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
    const batter = scene.getObjectByName('batter')

    ball.move()
    ball.bound()

    batter.swingBatMixer.update(1 / 30)

    for (const fielder of fielders) {
        fielder.update(ball)
    }

    if (ball.position.y < ball.boxSize.y / 2 && ball.state !== 'stop') {
        ball.position.y = ball.boxSize.y / 2
        ball.stop()
        setTimeout(() => {
            resetGame()
        }, 5000)
    }

    controls.update()

    renderer.render(scene, camera)
    requestAnimationFrame(gameLoop)
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
