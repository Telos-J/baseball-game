import * as THREE from 'three'

const ambientLight = new THREE.AmbientLight(0xffffff, 0.6)
const dirLight = new THREE.DirectionalLight(0xffffff, 0.6)
dirLight.position.set(0, 100, 50)

export {ambientLight, dirLight}
