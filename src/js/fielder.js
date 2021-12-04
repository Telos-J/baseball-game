import Bunny from './bunny'
import { worldDimensions } from './world'

export default class Fielder extends Bunny {
    constructor(name, x, z) {
        super()
        this.position.set(x, 0, z)
        this.name = name
    }
}
