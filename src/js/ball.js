import * as THREE from 'three'
import { gltfLoader } from './loaders'

export default async function Ball() {
    const gltf = await gltfLoader.loadAsync('models/baseball/scene.gltf')
    const ball = gltf.scene
    ball.scale.set(0.05, 0.05, 0.05)

    const box = new THREE.Box3().setFromObject(ball)
    const boxSize = box.getSize(new THREE.Vector3())
    ball.boxSize = boxSize

    ball.name = 'ball'
    ball.speed = 10
    ball.move = () => {
        ball.position.z += ball.speed
        ball.rotateY(Math.PI / 30)
    }

    ball.hit = () => {
        console.log(ball.position.z)
        if (ball.position.z < 20 && ball.position.z > -40) {
            ball.speed = -20
            console.log('hit')
        }
    }

    return ball
}
