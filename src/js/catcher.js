import Bunny from './bunny'
import Glove from './glove'
import {toWorldDimensions, worldDimensions, isBaseSituation} from './world'

export default class Catcher extends Bunny {
    constructor() {
        super()
        this.position.z = worldDimensions.stadiumHeight * 0.02
        this.position.x = worldDimensions.stadiumWidth * 0.0
        this.initialPosition = this.position.clone()
        this.name = 'catcher'
        this.state = 'idle'
        this.equipGlove()
        this.rotateY(Math.PI)
        this.priorityBase = toWorldDimensions(...worldDimensions[`base4Position`])
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
        this.rotation.set(0, Math.PI, 0)
        this.state = 'idle'
    }

    shouldMoveToPriorityBase(ball) {
        return ball.state === 'hit' && (isBaseSituation([false, false, true])
            || isBaseSituation([false, true, true])
            || isBaseSituation([true, false, true])
            || isBaseSituation([true, true, true]))
    }

    moveToPriorityBase() {
        const priorityBase = this.priorityBase.clone()
        this.lookAt(priorityBase)
        priorityBase.sub(this.position)
        if (priorityBase.length() < this.speed) {
            this.position.copy(this.priorityBase)
        } else this.position.add(priorityBase.normalize().multiplyScalar(this.speed))
    }

    update(ball) {
        if (this.shouldMoveToPriorityBase(ball)) this.moveToPriorityBase()
    }
}
