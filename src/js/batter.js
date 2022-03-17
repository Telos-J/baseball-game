import Bunny from './bunny'
import {setSwingBat} from './animations/swingBat'
import camera from './camera'
import * as THREE from 'three'
import {worldDimensions, toWorldDimensions} from './world'
import {TextureGCSystem} from 'pixi.js'

export const batters = []

export default class Batter extends Bunny {
    constructor(name, position) {
        super()
        this.rotateY(Math.PI * 1.26)
        this.position.copy(position)
        this.name = name
        this.isBunting = false
        this.isSwinging = false
        this.state = 'waiting'
        this.speed = 6.5
        this.base = 1
        batters.push(this)
    }

    equipBat(bat) {
        this.state = 'batReady'
        this.position.copy(new THREE.Vector3(-worldDimensions.stadiumWidth * 0.014, 0, 0))
        this.rotation.set(0, Math.PI / 2, 0)

        const prevBat = this.getObjectByName('bat')
        if (prevBat) this.remove(prevBat)

        const rightHand = this.getObjectByName('rightHand')
        rightHand.add(bat)
        bat.rotation.set(0, -Math.PI / 1.3, -Math.PI / 6)
        bat.name = 'bat'

        const leftArm = this.getObjectByName('leftArm')
        leftArm.rotateY(-Math.PI / 1.3)

        const rightArm = this.getObjectByName('rightArm')
        rightArm.rotateY(Math.PI / 1.5)

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

    hit(ball, homerun) {
        if (!ball.inBattersBox()) return

        //if (this.isBunting) ball.velocity.set(0, 5, -15)
        const speed = 30 + Math.random() * 70 //homerun ? 100 : 70//
        const theta = Math.random() * ((Math.PI * 2) / 3) - Math.PI / 3//  homerun ? Math.PI / 3 : Math.PI / 6  
        const phi = Math.PI / 6
        ball.velocity.set(
            speed * Math.sin(phi) * Math.sin(theta),
            speed * Math.sin(phi),
            -speed * Math.cos(phi) * Math.cos(theta)
        )
        ball.physicsOn = true
        ball.state = 'hit'
        this.state = 'running'
        for (const batter of batters) {
            if (batter.state === 'atBase') {
                batter.state = 'running'
            }
        }
        this.unequipBat()
        camera.setAngleHit()
    }

    unequipBat() {
        const prevBat = this.getObjectByName('bat')
        prevBat.removeFromParent()
        const leftArm = this.getObjectByName('leftArm')
        leftArm.rotateY(Math.PI / 1.3)
        const rightArm = this.getObjectByName('rightArm')
        rightArm.rotateY(-Math.PI / 1.5)
    }

    run() {
        const base = toWorldDimensions(...worldDimensions[`base${this.base}Position`])
        const diff = base.clone()
        diff.sub(this.position)
        if (diff.length() < this.speed) {
            this.position.copy(base)
            this.state = 'atBase'
            this.base += 1
        } else this.position.add(diff.normalize().multiplyScalar(this.speed))

        if (this.base === 5) {
            this.state = 'in'
        }
    }

    update() {
        if (this.state === 'running') {
            this.run()
        }
    }
}
