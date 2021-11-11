import Bunny from './bunny'
import {worldDimensions} from './world'

export default class Pitcher extends Bunny {
    constructor() {
        super()
        this.position.z = -worldDimensions.stadiumHeight * 0.19
    }
}
