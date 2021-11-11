import * as THREE from 'three'

const ambientLight = new THREE.AmbientLight(0xffffff, 0.8)
const dirLight = new THREE.DirectionalLight(0xffffff, 0.8)
dirLight.position.set(0, 100, 50)

export { ambientLight, dirLight }
