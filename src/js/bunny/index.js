import * as THREE from 'three'
import { color, Body, LeftArm, RightArm, LeftLeg, RightLeg } from './parts'

export default class Bunny extends THREE.Group {
    constructor() {
        super()
        this._color = color
        this.speed = 3
        this.scale.set(1.5, 1.5, 1.5)

        for (const buildPart of [Body, LeftArm, RightArm, LeftLeg, RightLeg]) {
            const part = buildPart()
            this.add(part)
        }

        const box = new THREE.Box3().setFromObject(this)
        const boxSize = box.getSize(new THREE.Vector3())
        this.boxSize = boxSize
    }

    get state() {
        return this._state
    }

    set state(state) {
        if (this._state === state) return
        if (this.name.includes('batter')) console.log(`${this.name} state: ${state}`)
        this._state = state
    }

    set color(color) {
        this._color = color
        colorPart(this, color)
    }

    get color() {
        return this._color
    }
}
