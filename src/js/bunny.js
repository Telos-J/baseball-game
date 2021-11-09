import * as THREE from 'three'

const thickness = 6
const hexColor = 0xc08404
const stringColor = '#c08404'

export default class Bunny extends THREE.Group {
    constructor() {
        super()
        this._color = hexColor
        this.parts = []
        const body = new THREE.Mesh(
            new THREE.BoxBufferGeometry(16, 26, thickness),
            new THREE.MeshLambertMaterial({ color: hexColor })
        )
        body.position.set(0, 18, 0)
        this.add(body)
        this.parts.push(body)

        const leftEye = new THREE.Mesh(
            new THREE.BoxBufferGeometry(1, 2, 0.2),
            new THREE.MeshLambertMaterial({ color: 0x000000 })
        )
        leftEye.position.set(4, 26, thickness / 2)
        this.add(leftEye)

        const rightEye = new THREE.Mesh(
            new THREE.BoxBufferGeometry(1, 2, 0.2),
            new THREE.MeshLambertMaterial({ color: 0x000000 })
        )
        rightEye.position.set(-4, 26, thickness / 2)
        this.add(rightEye)

        const mouth = new THREE.Mesh(
            new THREE.BoxBufferGeometry(4, 1, 0.2),
            new THREE.MeshLambertMaterial({ color: 0x000000 })
        )
        mouth.position.set(0, 24, thickness / 2)
        this.add(mouth)

        const belly = new THREE.Mesh(
            new THREE.BoxBufferGeometry(5, 8, 0.2),
            new THREE.MeshLambertMaterial({ color: 0xffffff })
        )
        belly.position.set(0, 14, thickness / 2)
        this.add(belly)

        const leftLeg = new THREE.Mesh(
            new THREE.BoxBufferGeometry(4, 5, thickness),
            new THREE.MeshLambertMaterial({ color: hexColor })
        )
        leftLeg.position.set(6, 2.5, 0)
        this.add(leftLeg)
        this.parts.push(leftLeg)

        const rightLeg = new THREE.Mesh(
            new THREE.BoxBufferGeometry(4, 5, thickness),
            new THREE.MeshLambertMaterial({ color: hexColor })
        )
        rightLeg.position.set(-6, 2.5, 0)
        this.add(rightLeg)
        this.parts.push(rightLeg)

        const leftArm = new THREE.Mesh(
            new THREE.BoxBufferGeometry(5, 4, thickness),
            new THREE.MeshLambertMaterial({ color: hexColor })
        )
        leftArm.position.set(10.5, 23, 0)
        this.add(leftArm)
        this.parts.push(leftArm)

        const rightArm = new THREE.Mesh(
            new THREE.BoxBufferGeometry(5, 4, thickness),
            new THREE.MeshLambertMaterial({ color: hexColor })
        )
        rightArm.position.set(-10.5, 23, 0)
        this.add(rightArm)
        this.parts.push(rightArm)

        const innerLeftEar = new THREE.Mesh(
            new THREE.BoxBufferGeometry(3, 4, 0.2),
            new THREE.MeshLambertMaterial({ color: 0xffffff })
        )
        innerLeftEar.position.set(4.5, 33, thickness / 2)
        this.add(innerLeftEar)

        const leftEar = new THREE.Mesh(
            new THREE.BoxBufferGeometry(7, 6, thickness),
            new THREE.MeshLambertMaterial({ color: hexColor })
        )
        leftEar.position.set(4.5, 34, 0)
        this.add(leftEar)
        this.parts.push(leftEar)

        const innerRightEar = new THREE.Mesh(
            new THREE.BoxBufferGeometry(3, 4, thickness),
            new THREE.MeshLambertMaterial({ color: 0xffffff })
        )
        innerRightEar.position.set(-4.5, 33, 0.1)
        this.add(innerRightEar)

        const rightEar = new THREE.Mesh(
            new THREE.BoxBufferGeometry(7, 6, thickness),
            new THREE.MeshLambertMaterial({ color: hexColor })
        )
        rightEar.position.set(-4.5, 34, 0)
        this.add(rightEar)
        this.parts.push(rightEar)
    }

    set color(color) {
        this._color = color
        for (const mesh of this.parts) {
            mesh.material.color.setHex(color)
        }
    }

    get color() {
        return this._color
    }
}

function getBunnyBodyTexture() {
    const canvas = document.createElement('canvas')
    const context = canvas.getContext('2d')
    canvas.width = 160
    canvas.height = 260

    context.fillStyle = stringColor
    context.fillRect(0, 0, canvas.width, canvas.height)

    context.fillStyle = '#000000'
    context.fillRect(40, 40, 10, 20)
    context.fillRect(110, 40, 10, 20)
    context.fillRect(60, 70, 40, 10)

    context.fillStyle = '#ffffff'
    context.fillRect(70, 80, 20, 20)
    context.fillRect(30, 0, 10, 10)
    context.fillRect(120, 0, 10, 10)
    context.fillRect(60, 130, 40, 80)
    context.fillRect(50, 140, 60, 60)

    return new THREE.CanvasTexture(canvas)
}

function getBunnyEarTexture() {
    const canvas = document.createElement('canvas')
    const context = canvas.getContext('2d')
    canvas.width = 70
    canvas.height = 60

    context.fillStyle = stringColor
    context.fillRect(0, 0, 70, 60)
    context.fillStyle = '#ffffff'
    context.fillRect(20, 20, 30, 40)

    return new THREE.CanvasTexture(canvas)
}
