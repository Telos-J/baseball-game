import * as THREE from 'three'

export default async function Ball(objLoader, mtlLoader) {
    const materials = await mtlLoader.loadAsync('models/baseball.mtl')
    materials.preload()
    objLoader.setMaterials(materials)

    const object = await objLoader.loadAsync('models/baseball.obj')
    object.scale.set(0.05, 0.05, 0.05)

    const box = new THREE.Box3().setFromObject(object)
    const boxSize = box.getSize(new THREE.Vector3())
    object.boxSize = boxSize

    return object
}
