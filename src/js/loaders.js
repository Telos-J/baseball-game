import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'

const loadingManager = new THREE.LoadingManager()
const imageLoader = new THREE.ImageLoader(loadingManager)
const gltfLoader = new GLTFLoader(loadingManager)

let itemsLoaded = 0
const itemsTotal = 3
function onLoadDo(callback) {
    loadingManager.onLoad = () => {
        itemsLoaded++
        if (itemsLoaded === itemsTotal) {
            const spinner = document.querySelector('.loader-wrap')
            spinner.classList.add('fadeOut')
            spinner.addEventListener('transitionend', () => {
                spinner.classList.add('turnOff')
                callback()
            })
        }
    }
}

export { imageLoader, gltfLoader, onLoadDo }
