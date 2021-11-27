import '../favicon.ico'
import '../image.png'
import '../icon-192.png'
import '../icon-512.png'
import '../css/style.scss'
import * as THREE from 'three'
import { setHelpers } from './helpers'
import { onLoadDo } from './loaders'
import { ambientLight, dirLight } from './light'
import { worldDimensions } from './world'
import { setupListeners } from './listeners'
import camera from './camera'
import Ball from './ball'
import Stadium from './stadium'
import Pitcher from './pitcher'
import Batter from './batter'
import Bat from './bat'

async function setupGame() {
    const stadium = await Stadium(worldDimensions)
    const batter = new Batter()
    const pitcher = new Pitcher()
    const ball = await Ball()
    const bat = await Bat()

    scene.add(ball)
    scene.add(bat)
    scene.add(stadium)
    scene.add(pitcher)
    scene.add(batter)

    ball.position.set(-13 - ball.boxSize.x / 2, 23 - ball.boxSize.y / 2, pitcher.position.z)
    batter.equipBat(bat)

    renderer.render(scene, camera)
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
    batter.swingBatMixer.update(1 / 30)
    controls.update()
    renderer.render(scene, camera)
    requestAnimationFrame(gameLoop)
}

function main() {
    setupGame()
    setupListeners(scene, renderer)
}

const scene = new THREE.Scene()
scene.background = new THREE.Color(0x87ceeb)

const renderer = new THREE.WebGLRenderer()
renderer.setSize(window.innerWidth, window.innerHeight)
document.body.appendChild(renderer.domElement)

const { controls } = setHelpers(scene, renderer)
scene.add(ambientLight)
scene.add(dirLight)

onLoadDo(startGame)

main()
