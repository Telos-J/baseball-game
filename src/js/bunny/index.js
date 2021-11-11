import * as THREE from 'three'
import { color, Body, LeftArm, RightArm, LeftLeg, RightLeg } from './parts'

export default class Bunny extends THREE.Group {
    constructor() {
        super()
        this._color = color

        for (const buildPart of [Body, LeftArm, RightArm, LeftLeg, RightLeg]) {
            const part = buildPart()
            this.add(part)
        }
    }

    set color(color) {
        this._color = color
        colorPart(this, color)
    }

    get color() {
        return this._color
    }
}
