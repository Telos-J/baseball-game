import * as THREE from 'three'

function setHelpers(scene) {
    const axesHelper = new THREE.AxesHelper(100)
    scene.add(axesHelper)

    const gridHelper = new THREE.GridHelper(100, 10)
    scene.add(gridHelper)
}

export { setHelpers }
