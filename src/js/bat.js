import * as THREE from 'three'
import { gltfLoader } from './loaders'

export default async function Bat() {
    const gltf = await gltfLoader.loadAsync('models/scene.gltf')
    const object = gltf.scene.getObjectByName('RootNode').children[0]
    object.scale.set(50, 50, 50)

    const box = new THREE.Box3().setFromObject(object)
    const boxSize = box.getSize(new THREE.Vector3())
    object.boxSize = boxSize
    object.position.set(-boxSize.x / 2, 0, 0)

    const bat = new THREE.Group()
    bat.add(object)
    bat.name = 'bat'

    return bat
}
