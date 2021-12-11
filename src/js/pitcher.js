import Bunny from './bunny'
import { worldDimensions } from './world'

export default class Pitcher extends Bunny {
    constructor() {
        super()
        this.position.z = -worldDimensions.stadiumHeight * 0.19
        this.name = 'pitcher'
        this.state = 'pitchReady'
    }

    pitch(ball) {
        ball.velocity.set(0, 0, 10)
        ball.angularVelocity.set(0, Math.PI / 30, 0)
        ball.state = 'pitching'
        this.state = 'pitched'
    }

    equipBall(ball) {
        ball.pitcher = this
        ball.position.set(-13 - ball.boxSize.x / 2, 23 - ball.boxSize.y / 2, this.position.z)
        this.state = 'pitchReady'
    }
}
