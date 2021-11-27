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
        ball.velocity = new THREE.Vector3(0, 0, 10)
        ball.angularVelocity = new THREE.Euler(0, Math.PI / 30, 0)
        ball.physicsOn = false
        ball.isBunting = false
    }

    ball.move = () => {
        if (ball.physicsOn) ball.velocity.y -= g

        ball.position.add(ball.velocity)
        ball.rotateY(ball.angularVelocity.y)

        if (ball.position.y < ball.boxSize.y / 2) {
            ball.physicsOn = false
            ball.velocity.set(0, 0, 0)
            ball.angularVelocity.set(0, 0, 0)
        }
    }

    ball.inBattersBox = () => {
        return ball.position.z < 20 && ball.position.z > -40
    }

    return ball
}
