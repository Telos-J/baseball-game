import { gltfLoader } from './loaders'
export default async function Glove() {
    const gltf = await gltfLoader.loadAsync('models/baseballGlove/scene.gltf')
    const glove = gltf.scene
    glove.scale.set(3.5, 3.5, 3.5)

    const rootNode = glove.getObjectByName('RootNode')
    rootNode.children[0].children[0].material.color.set(0xa67a5b)

    return glove
}

