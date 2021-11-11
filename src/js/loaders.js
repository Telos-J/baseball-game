import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'

const loadingManager = new THREE.LoadingManager()
const imageLoader = new THREE.ImageLoader(loadingManager)
const gltfLoader = new GLTFLoader(loadingManager)

loadingManager.onLoad = () => {
    setTimeout(() => {
        const spinner = document.querySelector('.loader-wrap')
        spinner.classList.add('fadeOut')
        spinner.addEventListener('transitionend', () => spinner.classList.add('turnOff'))
    }, 1000)
}

export { imageLoader, gltfLoader }
