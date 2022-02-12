import * as THREE from 'three'
import { gltfLoader } from './loaders'
import { worldDimensions } from './world'
import camera from './camera'

export default async function Ball() {
    const gltf = await gltfLoader.loadAsync('models/baseball/scene.gltf')
    const ball = gltf.scene
    ball.scale.set(0.06, 0.06, 0.06)

    const box = new THREE.Box3().setFromObject(ball)
    const boxSize = box.getSize(new THREE.Vector3())
    ball.boxSize = boxSize

    const g = 0.6
    const airResistance = 0.03

    Object.defineProperty(ball, 'state', {
        get: function () {
            return this._state
        },
        set: function (state) {
            console.log(`ball state: ${state}`)
            this._state = state
        },
    })

    {
        ball.name = 'ball'
        ball.velocity = new THREE.Vector3(0, 0, 0)
        ball.angularVelocity = new THREE.Euler(0, 0, 0)
        ball.physicsOn = false
        ball.state = 'pitchReady'
    }

    ball.move = () => {
        if (ball.physicsOn) {
            ball.velocity.y -= g
            ball.velocity.sub(ball.velocity.clone().multiplyScalar(airResistance))
        }

        ball.position.add(ball.velocity)
        ball.rotateY(ball.angularVelocity.y)
    }

    ball.bound = scene => {
        if (ball.position.y < ball.boxSize.y / 2) {
            ball.position.y = ball.boxSize.y / 2
            ball.stop()
        }

        if (ball.position.z > worldDimensions.stadiumHeight * 0.02) {
            ball.stop()
            ball.reset(scene)
        }
    }

    ball.reset = scene => {
        const pitcher = ball.pitcher
        // camera.setAngleBatting()
        ball.state = 'pitchReady'
        ball.removeFromParent()
        scene.add(ball)
        pitcher.equipBall(ball)
        setTimeout(() => {
            pitcher.pitch(ball)
        }, 1000)
    }

    ball.stop = () => {
        ball.physicsOn = false
        ball.velocity.set(0, 0, 0)
        ball.angularVelocity.set(0, 0, 0)
        ball.state = 'stop'
    }

    ball.inBattersBox = () => {
        return ball.position.z < 20 && ball.position.z > -40
    }

    return ball
}
