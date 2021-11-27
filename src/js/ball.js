import * as THREE from 'three'
import { gltfLoader } from './loaders'

export default async function Ball() {
    const gltf = await gltfLoader.loadAsync('models/baseball/scene.gltf')
    const ball = gltf.scene
    ball.scale.set(0.05, 0.05, 0.05)

    const box = new THREE.Box3().setFromObject(ball)
    const boxSize = box.getSize(new THREE.Vector3())
    ball.boxSize = boxSize

    let g = 1
    let airResistance = 0.01

    {
        ball.name = 'ball'
        ball.speed = 10
        ball.velocity = new THREE.Vector3(0, 0, 10)
        ball.physicsOn = false
    }

    ball.move = () => {
        if (ball.physicsOn) ball.velocity.y -= g
        ball.position.add(ball.velocity)
        if (ball.position.y >= ball.boxSize.y / 2) ball.rotateY(Math.PI / 30)
        if (ball.position.y < ball.boxSize.y / 2) {
            ball.physicsOn = false
            ball.velocity.set(0, 0, 0)
        }
        console.log(ball.position.y)
    }

    ball.hit = () => {
        console.log(ball.position.z)
        if (ball.position.z < 20 && ball.position.z > -40) {
            ball.speed = -20
            console.log('hit')
            ball.velocity.set(0, 5, -40)
            ball.physicsOn = true
        }
    }

    return ball
}
