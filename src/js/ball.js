import * as THREE from 'three'

export default async function Ball(gltfLoader) {
    const gltf = await gltfLoader.loadAsync('models/baseball/scene.gltf', req => {
        console.log(req)
    })
    const object = gltf.scene
    object.scale.set(0.05, 0.05, 0.05)

    const box = new THREE.Box3().setFromObject(object)
    const boxSize = box.getSize(new THREE.Vector3())
    object.boxSize = boxSize

    return object
}
