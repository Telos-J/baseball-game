import * as THREE from 'three'
import Bunny from './bunny'
import { worldDimensions } from './world'
import { setSwingBat } from './animations/swingBat'

export default class Batter extends Bunny {
    constructor() {
        super()
        this.rotateY(Math.PI / 2)
        this.position.set(-worldDimensions.stadiumWidth * 0.014, 0, 0)
        this.name = 'batter'
        this.isBunting = false
        this.isSwinging = false

        const leftArm = this.getObjectByName('leftArm')
        leftArm.rotateY(-Math.PI / 1.3)

        const rightArm = this.getObjectByName('rightArm')
        rightArm.rotateY(Math.PI / 1.5)
    }

    equipBat(bat) {
        const prevBat = this.getObjectByName('bat')
        if (prevBat) this.remove(prevBat)

        const rightHand = this.getObjectByName('rightHand')
        rightHand.add(bat)
        bat.rotation.set(0, -Math.PI / 1.3, -Math.PI / 6)
        bat.name = 'bat'

        setSwingBat(this)
    }

    swingBat() {
        this.swingBatAction.play()
    }

    hit(ball) {
        if (!ball.inBattersBox()) this.isBunting = true

        if (ball.inBattersBox()) {
            if (this.isBunting) ball.velocity.set(0, 5, -15)
            else ball.velocity.set(0, 10, -30)
            ball.physicsOn = true
            ball.state = 'hit'
            console.log(ball.state)
        }
    }
}
