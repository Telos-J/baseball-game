import * as THREE from 'three'
import { imageLoader } from './loaders'

export default async function Stadium({ worldWidth, worldHeight, stadiumWidth, stadiumHeight }) {
    const image = await imageLoader.loadAsync('img/stadium.png')

    const canvas = document.createElement('canvas')
    const context = canvas.getContext('2d')
    canvas.width = worldWidth
    canvas.height = worldHeight
    context.fillStyle = '#ffc08c'
    context.arc(canvas.width / 2, canvas.height / 2, canvas.width / 2, 0, Math.PI * 2)
    context.fill()
    context.drawImage(
        image,
        (canvas.width - stadiumWidth) / 2,
        canvas.height / 2 - stadiumHeight * 0.806,
        stadiumWidth,
        stadiumHeight
    )

    const texture = new THREE.CanvasTexture(canvas)
    const geometry = new THREE.PlaneGeometry(canvas.width, canvas.height)
    const material = new THREE.MeshBasicMaterial({
        transparent: true,
        side: THREE.DoubleSide,
        map: texture,
    })
    const stadium = new THREE.Mesh(geometry, material)
    stadium.rotateX(Math.PI / 2)
    stadium.rotateZ(Math.PI)

    return stadium
}
