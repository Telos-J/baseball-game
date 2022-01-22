import Bunny from './bunny'
import Glove from './glove'

export const fielders = []

export default class Fielder extends Bunny {
    constructor(name, x, z) {
        super()
        this.position.set(x, 0, z)
        this.initialPosition = this.position.clone()
        this.name = name
        this.state = 'idle'
        this.prediction = null
        this.equipGlove()
        this.speed = 4
        fielders.push(this)
    }

    async equipGlove() {
        const glove = await Glove()
        const leftHand = this.getObjectByName('leftHand')
        const leftArm = this.getObjectByName('leftArm')
        leftHand.add(glove)
        leftArm.rotation.set(0, -Math.PI / 2, -Math.PI / 6)
        glove.position.set(7, -3, 0)
        glove.rotation.set(-Math.PI / 2, 0, -Math.PI / 2)
    }

    reset() {
        this.position.copy(this.initialPosition)
        this.rotation.set(0, 0, 0)
        this.prediction = null
        this.state = 'idle'
    }

    shouldPredict(ball) {
        return ball.state === 'hit' && this.state === 'idle' && !this.prediction
    }

    predict(ball) {
        const position = ball.position.clone()
        const velocity = ball.velocity.clone()
        const g = 0.6
        const airResistance = 0.03
        while (position.y >= ball.boxSize.y / 2) {
            velocity.y -= g
            velocity.sub(velocity.clone().multiplyScalar(airResistance))
            position.add(velocity)
        }
        position.y = 0
        this.prediction = position
    }

    shouldMoveToPrediction() {
        return this === closestFielder() && this.position.distanceTo(this.prediction)
    }

    moveToPrediction() {
        this.state = 'moveToPrediction'
        const prediction = this.prediction.clone()
        this.lookAt(prediction)
        prediction.sub(this.position)
        if (prediction.length() < this.speed) {
            this.position.copy(this.prediction)
        } else this.position.add(prediction.normalize().multiplyScalar(this.speed))
    }

    shouldCatchBall(ball) {
        const ballPosition = ball.position.clone()
        ballPosition.y = 0
        ballPosition.sub(this.position)
        return (
            this.state !== 'caughtBall' &&
            ballPosition.length() < this.speed &&
            ball.position.y < this.boxSize.y
        )
    }

    catchBall(ball, batter) {
        ball.removeFromParent()
        this.add(ball)
        this.state = 'caughtBall'
        ball.stop()
        ball.position.set(6, 12, 14)
        ball.state = 'caught' 
        this.rotation.set(0, 0, 0)
    }

    shouldMakeBatterOut(ball, batter) {
        const ballPosition = ball.position.clone()
        ballPosition.y = 0
        ballPosition.sub(this.position)
        return (
            ballPosition.length() < this.speed &&
            ball.position.y > ball.boxSize.y/2  &&
            ball.position.y < this.boxSize.y 
        )
    }

    makeBatterOut(batter) {
        batter.state = 'out'
    }

    update(ball, batter) {
        if (this.shouldPredict(ball)) this.predict(ball)
        if (this.shouldMoveToPrediction()) this.moveToPrediction()
        if (this.shouldMakeBatterOut(ball, batter)) this.makeBatterOut(batter)
        if (this.shouldCatchBall(ball)) this.catchBall(ball)
    }
}

export function closestFielder() {
    for (const fielder of fielders) if (!fielder.prediction) return

    const sortedFielders = fielders.sort(
        (fielder1, fielder2) =>
            fielder1.position.distanceTo(fielder1.prediction) -
            fielder2.position.distanceTo(fielder2.prediction)
    )

    return sortedFielders[0]
}
