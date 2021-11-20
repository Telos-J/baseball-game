import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'

const loadingManager = new THREE.LoadingManager()
const imageLoader = new THREE.ImageLoader(loadingManager)
const gltfLoader = new GLTFLoader(loadingManager)

export { loadingManager, imageLoader, gltfLoader }
