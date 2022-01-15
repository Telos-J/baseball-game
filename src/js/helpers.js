import * as THREE from 'three'
import { GUI } from 'three/examples/jsm/libs/dat.gui.module'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import camera from './camera'
import { dirLight } from './light'

function setHelpers(scene, renderer) {
    // const axesHelper = new THREE.AxesHelper(100)
    // scene.add(axesHelper)

    // const gridHelper = new THREE.GridHelper(100, 10)
    // scene.add(gridHelper)

    const controls = new OrbitControls(camera, renderer.domElement)
    controls.minDistance = 10
    controls.maxDistance = 1000
    controls.object.position.set(0, 100, 200)
    controls.target = new THREE.Vector3(0, 50, 0)
    controls.update()

    const gui = new GUI()
    const cameraFolder = gui.addFolder('camera')
    cameraFolder.add(camera.position, 'x', 0, 300)
    cameraFolder.add(camera.position, 'y', 0, 300)
    cameraFolder.add(camera.position, 'z', 0, 300)
    const dirLightFolder = gui.addFolder('dirLight')
    dirLightFolder.add(dirLight.position, 'x', 0, 300)
    dirLightFolder.add(dirLight.position, 'y', 0, 300)
    dirLightFolder.add(dirLight.position, 'z', 0, 300)

    return { controls }
}

export { setHelpers }
