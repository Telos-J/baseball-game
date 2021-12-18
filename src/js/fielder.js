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
    }

    async equipGlove(){
        const glove = await Glove()
        const leftHand = this.getObjectByName('leftHand')
        const leftArm = this.getObjectByName('leftArm')
        leftArm.rotateY(-Math.PI / 2)
        leftHand.add(glove)
        glove.position.y -= 15
        glove.position.x += 5
        glove.position.z += 5
        glove.rotateY(Math.PI/2)
        glove.rotateZ(Math.PI)
        glove.rotateX(Math.PI/4)

    }
    reset() {
        this.position.copy(this.initialPosition)
        this.rotation.set(0, 0, 0)
        this.prediction = null
        this.state = 'idle'
    }

    shouldPredict(ball) {
        return ball.state === 'hit' && this.state === 'idle'
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

        position.y = ball.boxSize.y / 2

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
            this.state = 'caughtBall'
        } else this.position.add(prediction.normalize().multiplyScalar(this.speed))
    }

    update(ball) {
        if (this.shouldPredict(ball)) this.predict(ball)
        if (this.shouldMoveToPrediction()) this.moveToPrediction()
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
