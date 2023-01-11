import Bunny from './bunny'
import {worldDimensions} from './world'

export default class Pitcher extends Bunny {
    constructor() {
        super()
        this.position.z = -worldDimensions.stadiumHeight * 0.19
        this.position.x = worldDimensions.stadiumWidth * 0.005
        this.name = 'pitcher'
        this.state = 'pitchReady'
    }

    pitch(ball) {
        let speed = 10 * Math.random() + 10
        ball.velocity.set(0, 0, speed)
        ball.angularVelocity.set(0, Math.PI / 30, 0)
        ball.state = 'pitching'
        this.state = 'pitched'
    }

    equipBall(ball) {
        const rightHand = this.getObjectByName('rightHand')
        ball.pitcher = this
        rightHand.getWorldPosition(ball.position)
        ball.position.y -= ball.boxSize.y / 2
        ball.position.x -= ball.boxSize.x / 2
        this.state = 'pitchReady'
    }
}
