import Bunny from './bunny'
import { worldDimensions } from './world'

export default class Pitcher extends Bunny {
    constructor() {
        super()
        this.position.z = -worldDimensions.stadiumHeight * 0.19
        this.name = 'pitcher'
    }

    pitch(ball) {
        ball.velocity.set(0, 0, 10)
        ball.angularVelocity.set(0, Math.PI / 30, 0)
    }

    equipBall(ball) {
        ball.position.set(-13 - ball.boxSize.x / 2, 23 - ball.boxSize.y / 2, this.position.z)
    }
}
