import '../favicon.ico'
import '../image.png'
import '../icon-192.png'
import '../icon-512.png'
import '../css/style.scss'
import * as THREE from 'three'
import { imageLoader, gltfLoader } from './loaders'
import { setHelpers } from './helpers'
import { ambientLight, dirLight } from './light'
import { worldDimensions } from './world'
import { setupListeners } from './listeners'
import camera from './camera'
import Ball from './ball'
import Stadium from './stadium'
import Pitcher from './pitcher'
import Batter from './batter'
import Bat from './bat'

const scene = new THREE.Scene()
scene.background = new THREE.Color(0x87ceeb)

const renderer = new THREE.WebGLRenderer()
renderer.setSize(window.innerWidth, window.innerHeight)
document.body.appendChild(renderer.domElement)

const { controls } = setHelpers(scene, renderer)
scene.add(ambientLight)
scene.add(dirLight)

async function setupGame() {
    const ball = await Ball(gltfLoader)
    const bat = await Bat(gltfLoader)
    const stadium = await Stadium(imageLoader, worldDimensions)

    bat.name = 'bat'
    scene.add(ball)
    scene.add(bat)
    scene.add(stadium)

    const pitcher = new Pitcher()
    scene.add(pitcher)

    ball.position.set(-13 - ball.boxSize.x / 2, 23 - ball.boxSize.y / 2, pitcher.position.z)

    const batter = new Batter()
    batter.name = 'batter'
    scene.add(batter)

    batter.equipBat(bat)
}

function animate() {
    controls.update()
    requestAnimationFrame(animate)
    renderer.render(scene, camera)
}

function main() {
    setupGame()
    setupListeners(scene, renderer)
    animate()
}

main()
