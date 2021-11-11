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

async function setup() {
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
    setup()
    animate()
}

addEventListener('keydown', e => {
    const batter = scene.getObjectByName('batter')
    const bat = scene.getObjectByName('bat')
    if (e.code === 'Space') {
        batter.swingBat(bat)
    } else if (e.code === 'ArrowRight') {
        batter.position.x += 1
        batter.equipBat(bat)
    } else if (e.code === 'ArrowLeft') {
        batter.position.x -= 1
        batter.equipBat(bat)
    }
})

addEventListener('keyup', e => {
    const batter = scene.getObjectByName('batter')
    const bat = scene.getObjectByName('bat')
    if (e.code === 'Space') {
        batter.rotation.set(0, Math.PI / 2, 0)
        batter.equipBat(bat)
    }
})

main()
