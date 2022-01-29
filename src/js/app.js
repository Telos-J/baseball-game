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
    const batter1 = new Batter('batter2', toWorldDimensions(482, 0, 592))
    const batter2 = new Batter('batter3', toWorldDimensions(497, 0, 576)) 
    const batter3 = new Batter('batter4', toWorldDimensions(512, 0, 560))
    const batter4 = new Batter('batter5', toWorldDimensions(527, 0, 544))
    const batter5 = new Batter('batter6', toWorldDimensions(542, 0, 528))
    const batter6 = new Batter('batter7', toWorldDimensions(557, 0, 512))
    const batter7 = new Batter('batter8', toWorldDimensions(572, 0, 496))
    const batter8 = new Batter('batter9', toWorldDimensions(587, 0, 480))
    const batter9 = new Batter('batter', new THREE.Vector3(-worldDimensions.stadiumWidth * 0.014, 0, 0))
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
    scene.add(batter1)
    scene.add(batter2)
    scene.add(batter3)
    scene.add(batter4)
    scene.add(batter5)
    scene.add(batter6)
    scene.add(batter7)
    scene.add(batter8)
    scene.add(batter9)

    pitcher.equipBall(ball)
    batter9.equipBat(bat)
    renderer.render(scene, camera)
}

let isReset = false

function shouldReset() {
    const ball = scene.getObjectByName('ball')
    return ball.state === 'caught' && !isReset
}

function resetGame() {
    const ball = scene.getObjectByName('ball')
    const batter = scene.getObjectByName('batter')
    const pitcher = scene.getObjectByName('pitcher')

    for (const fielder of fielders) {
        fielder.reset()
    }

    ball.reset(scene)
    camera.setAngleBatting()
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
    const batter = scene.getObjectByName('batter')
    ball.move()
    ball.bound(scene)

    batter.swingBatMixer.update(1 / 30)

    for (const fielder of fielders) {
        fielder.update(ball, batter)
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
    if (batter.state === 'running') {
        batter.run()
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
