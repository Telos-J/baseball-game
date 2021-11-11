import * as THREE from 'three'

const camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 10000)
camera.position.set(0, 100, 200)
camera.lookAt(0, 50, 0)

export default camera
