import '../favicon.ico'
import '../image.png'
import '../icon-192.png'
import '../icon-512.png'
import '../css/style.scss'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js'
import { MTLLoader } from 'three/examples/jsm/loaders/MTLLoader.js'
import Ball from './ball'
import Bunny from './bunny'
import camera from './camera'
import Stadium from './stadium'
import { setHelpers } from './helpers'
import { ambientLight, dirLight } from './light'

const worldDimensions = {
    worldWidth: 10000,
    worldHeight: 10000,
    stadiumWidth: 1500,
    stadiumHeight: 1500,
    pitcher: 0,
}

const scene = new THREE.Scene()
scene.background = new THREE.Color(0x87ceeb)

const renderer = new THREE.WebGLRenderer()
renderer.setSize(window.innerWidth, window.innerHeight)
document.body.appendChild(renderer.domElement)

const controls = new OrbitControls(camera, renderer.domElement)

setHelpers(scene)
scene.add(ambientLight)
scene.add(dirLight)

const objLoader = new OBJLoader()
const mtlLoader = new MTLLoader()
const imageLoader = new THREE.ImageLoader()

async function setup() {
    const bunny = new Bunny()
    bunny.position.z = -worldDimensions.stadiumHeight * 0.19
    scene.add(bunny)

    const ball = await Ball(objLoader, mtlLoader)
    ball.position.set(-13 - ball.boxSize.x / 2, 23 - ball.boxSize.y / 2, bunny.position.z)
    scene.add(ball)

    const stadium = await Stadium(imageLoader, worldDimensions)
    scene.add(stadium)
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

main()
