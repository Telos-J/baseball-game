import * as THREE from 'three'
import { gltfLoader } from './loaders'
export default async function Glove() {
    const gltf = await gltfLoader.loadAsync('models/baseballGlove/scene.gltf')
    const glove = gltf.scene
    glove.scale.set(5, 5, 5)
    return glove
}