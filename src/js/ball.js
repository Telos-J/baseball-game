import * as THREE from 'three'
import { gltfLoader } from './loaders'
import { worldDimensions } from './world'

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
        ball.velocity = new THREE.Vector3(0, 0, 0)
        ball.angularVelocity = new THREE.Euler(0, 0, 0)
        ball.physicsOn = false
    }

    ball.move = () => {
        if (ball.physicsOn) ball.velocity.y -= g

        ball.position.add(ball.velocity)
        ball.rotateY(ball.angularVelocity.y)

        if (ball.position.y < ball.boxSize.y / 2) {
            ball.reset()
        }
    }

    ball.bound = pitcher => {
        if (ball.position.z > worldDimensions.stadiumHeight * 0.02) {
            ball.reset()
            pitcher.equipBall(ball)
            setTimeout(() => {
                pitcher.pitch(ball)
            }, 1000)
        }
    }

    ball.reset = () => {
        ball.physicsOn = false
        ball.velocity.set(0, 0, 0)
        ball.angularVelocity.set(0, 0, 0)
    }

    ball.inBattersBox = () => {
        return ball.position.z < 20 && ball.position.z > -40
    }

    return ball
}
