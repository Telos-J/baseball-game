import Bunny from './bunny'
import Glove from './glove'
import {worldDimensions, toWorldDimensions, isBaseSituation} from './world'

export const fielders = []

export default class Fielder extends Bunny {
    constructor(name, position) {
        super()
        this.position.copy(position)
        this.initialPosition = this.position.clone()
        this.name = name
        this.state = 'idle'
        this.prediction = null
        this.priorityBase = null
        this.equipGlove()
        this.speed = 3
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
        this.priorityBase = null
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
        return this === closestFielder(this.prediction, fielders) && this.position.distanceTo(this.prediction)
    }

    moveToPrediction() {
        const prediction = this.prediction.clone()
        this.lookAt(prediction)
        prediction.sub(this.position)
        if (prediction.length() < this.speed) {
            this.position.copy(this.prediction)
            this.rotation.set(0, 0, 0)
        } else this.position.add(prediction.normalize().multiplyScalar(this.speed))
    }

    shouldCatchBall(ball) {
        const ballPosition = ball.position.clone()
        ballPosition.y = 0
        ballPosition.sub(this.position)
        return (
            this.state !== 'caughtBall' &&
            ballPosition.length() < this.speed * 3 &&
            ball.position.y < this.boxSize.y
        )
    }

    catchBall(ball) {
        console.log('catchBall')
        ball.removeFromParent()
        this.add(ball)
        this.state = 'caughtBall'
        ball.stop()
        ball.position.set(6, 12, 14)
        ball.state = 'caught'
    }

    isFlyBall(ball) {
        const ballPosition = ball.position.clone()
        ballPosition.y = 0
        ballPosition.sub(this.position)
        return (
            (ball.state === 'hit' &&
                ballPosition.length() < this.speed &&
                ball.position.y > ball.boxSize.y / 2 &&
                ball.position.y < this.boxSize.y)
        )
    }

    thrownOut(ball, batter) {
        return (
            this.priorityBase &&
            batter.priorityBase.equals(this.priorityBase) &&
            batter.state === 'running' &&
            ball.state === 'caught' &&
            this.state === 'caughtBall'
        )
    }

    shouldMakeBatterOut(ball, batter) {
        return (batter.name === 'controlBatter' && this.isFlyBall(ball)) || this.thrownOut(ball, batter)

    }

    makeBatterOut(batter) {
        batter.state = 'out'
        batter.base = 1
    }

    shouldSetPriorityBase(ball) {
        return !this.priorityBase && ball.state === 'hit'
    }

    setPriorityBase() {
        if (isBaseSituation([false, false, false])) {
            this.priorityBase = toWorldDimensions(...worldDimensions[`base1Position`])
        } else if (isBaseSituation([true, false, false])) {
            this.priorityBase = toWorldDimensions(...worldDimensions[`base2Position`])
        } else if (isBaseSituation([false, true, false])) {
            this.priorityBase = toWorldDimensions(...worldDimensions[`base1Position`])
        } else if (isBaseSituation([false, false, true])) {
            this.priorityBase = toWorldDimensions(...worldDimensions[`base4Position`])
        } else if (isBaseSituation([true, true, false])) {
            this.priorityBase = toWorldDimensions(...worldDimensions[`base3Position`])
        } else if (isBaseSituation([false, true, true])) {
            this.priorityBase = toWorldDimensions(...worldDimensions[`base4Position`])
        } else if (isBaseSituation([true, false, true])) {
            this.priorityBase = toWorldDimensions(...worldDimensions[`base4Position`])
        } else if (isBaseSituation([true, true, true])) {
            this.priorityBase = toWorldDimensions(...worldDimensions[`base4Position`])
        }
    }

    shouldMoveToPriorityBase(ball) {
        const noPredictionFielders = fielders.filter(fielder => fielder !== closestFielder(this.prediction, fielders))
        return this === closestFielder(this.priorityBase, noPredictionFielders)
            && !this.priorityBase.equals(toWorldDimensions(...worldDimensions[`base4Position`]))
            && (ball.state === 'hit' || ball.state === 'stop' || ball.state === 'caught')
    }

    //0, 0, 0: 1st Base, 1st Base, 1st Base
    //1, 0, 0: 2nd base -> 1st base, 2nd base -> 1st base, 1st base 
    //0, 1, 0: 1st base, 1st base, 1st base
    //0, 0, 1: home base -> 1st base, home base -> 1st base, 1st base
    //1, 1, 0: 3rd base -> 2nd Base, 2nd Base -> 1st Base, 1st Base
    //0, 1, 1: home base -> 1st base, home base -> 1st base, 1st base
    //1, 0, 1: home base -> 2nd base, 2nd Base -> 1st Base, 1st Base
    //1, 1, 1: home base -> 1st base, 2nd base -> 1st base, closest base to fielder with ball

    moveToPriorityBase() {
        const priorityBase = this.priorityBase.clone()
        this.lookAt(priorityBase)
        priorityBase.sub(this.position)
        if (priorityBase.length() < this.speed) {
            this.position.copy(this.priorityBase)
        } else this.position.add(priorityBase.normalize().multiplyScalar(this.speed))
    }

    shouldThrowToPriortyBase() {
        if (this.state !== 'caughtBall') return
        const noPredictionFielders = fielders.filter(fielder => fielder !== closestFielder(this.prediction, fielders))
        const closestBunny = closestFielder(this.priorityBase, noPredictionFielders)
        const priorityBase = closestBunny.priorityBase.clone()
        priorityBase.sub(closestBunny.position)
        const closestFielderIsClose = priorityBase.length() === 0
        return (this !== closestBunny && closestFielderIsClose)
    }

    throwToPriorityBase(ball) {
        this.state = 'idle'
        ball.removeFromParent()
        const scene = this.parent
        scene.add(ball)
        ball.position.copy(this.position)
        ball.position.y = this.boxSize.y / 2
        const speed = 13
        const theta = Math.atan2(this.priorityBase.z - this.position.z, this.priorityBase.x - this.position.x) + Math.PI / 2
        ball.velocity.set(
            speed * Math.sin(theta),
            0,
            -speed * Math.cos(theta)
        )
    }

    update(ball, batters) {
        if (this.shouldPredict(ball)) this.predict(ball)
        if (this.shouldMoveToPrediction()) this.moveToPrediction()
        for (const batter of batters)
            if (this.shouldMakeBatterOut(ball, batter)) this.makeBatterOut(batter)
        if (this.shouldCatchBall(ball)) this.catchBall(ball)
        if (this.shouldSetPriorityBase(ball)) this.setPriorityBase()
        if (this.shouldMoveToPriorityBase(ball)) this.moveToPriorityBase()
        if (this.shouldThrowToPriortyBase()) this.throwToPriorityBase(ball)
    }
}

export function closestFielder(position, fielders) {
    for (const fielder of fielders) if (!position) return
    const sortedFielders = fielders.sort(
        (fielder1, fielder2) =>
            fielder1.position.distanceTo(position) -
            fielder2.position.distanceTo(position)
    )



    return sortedFielders[0]
}
