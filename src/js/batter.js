import Bunny from './bunny'
import { setSwingBat } from './animations/swingBat'
import camera from './camera'
import * as THREE from 'three'
import { worldDimensions, toWorldDimensions } from './world'

export const batters = []

export default class Batter extends Bunny {
    constructor() {
        super()
        this.rotateY(Math.PI / 2)
        this.position.set(-worldDimensions.stadiumWidth * 0.014, 0, 0)
        this.name = 'batter'
        this.isBunting = false
        this.isSwinging = false
        this.state = 'batReady'
        this.speed = 6.5 
        this.base = 1

        const leftArm = this.getObjectByName('leftArm')
        leftArm.rotateY(-Math.PI / 1.3)

        const rightArm = this.getObjectByName('rightArm')
        rightArm.rotateY(Math.PI / 1.5)

        batters.push(this)
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

    makeReady() {
        const bat = this.getObjectByName('bat')
        this.state = 'batReady'
        this.swingBatAction.stop()
        this.rotation.set(0, Math.PI / 2, 0)
        bat.rotation.set(0, -Math.PI / 1.3, -Math.PI / 6)
    }

    swingBat() {
        if (this.state === 'swing') return
        this.state = 'swing'
        this.swingBatAction.play()
    }

    hit(ball) {
        if (!ball.inBattersBox()) return

        //if (this.isBunting) ball.velocity.set(0, 5, -15)
        const speed = 30 + Math.random() * 70
        const theta = Math.random() * ((Math.PI * 2) / 3) - Math.PI / 3
        const phi = Math.PI / 6
        ball.velocity.set(
            speed * Math.sin(phi) * Math.sin(theta),
            speed * Math.sin(phi),
            -speed * Math.cos(phi) * Math.cos(theta)
        )
        ball.physicsOn = true
        ball.state = 'hit'
        this.state = 'running'
        console.log(`${ this.state} 1`)
        camera.setAngleHit()
    }

    run() {
        if (this.base === 1)
        {
            const [x, z] = toWorldDimensions(...worldDimensions.base1Position)
            const base1 = new THREE.Vector3(x, 0, z)
            base1.sub(this.position)
            if (base1.length() < this.speed) {
                this.position.copy(new THREE.Vector3(x, 0, z))
                this.state = "atBase"
            } else this.position.add(base1.normalize().multiplyScalar(this.speed))
        } else if (this.base === 2) {
            
        }
    }
}
