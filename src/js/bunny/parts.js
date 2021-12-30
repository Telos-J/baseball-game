import * as THREE from 'three'

const color = 0xc08404

function Body() {
    const bodyMesh = new THREE.Mesh(
        new THREE.BoxBufferGeometry(16, 26, 4),
        new THREE.MeshLambertMaterial({ color })
    )
    bodyMesh.position.set(0, 13, 0)

    const leftEar = new THREE.Mesh(
        new THREE.BoxBufferGeometry(7, 6, 4),
        new THREE.MeshLambertMaterial({ color })
    )
    leftEar.position.set(4.5, 29, 0)

    const rightEar = new THREE.Mesh(
        new THREE.BoxBufferGeometry(7, 6, 4),
        new THREE.MeshLambertMaterial({ color })
    )
    rightEar.position.set(-4.5, 29, 0)

    const bodyDetail = BodyDetail()

    const body = new THREE.Group()
    body.add(bodyMesh)
    body.add(leftEar)
    body.add(rightEar)
    body.add(bodyDetail)
    body.position.set(0, 5, 0)
    body.name = 'body'

    return body
}

function BodyDetail() {
    const leftEye = new THREE.Mesh(
        new THREE.BoxBufferGeometry(1, 2, 0.2),
        new THREE.MeshLambertMaterial({ color: 0x000000 })
    )
    leftEye.position.set(4, 21, 4 / 2)

    const rightEye = new THREE.Mesh(
        new THREE.BoxBufferGeometry(1, 2, 0.2),
        new THREE.MeshLambertMaterial({ color: 0x000000 })
    )
    rightEye.position.set(-4, 21, 4 / 2)

    const mouth = new THREE.Mesh(
        new THREE.BoxBufferGeometry(4, 1, 0.2),
        new THREE.MeshLambertMaterial({ color: 0x000000 })
    )
    mouth.position.set(0, 19, 4 / 2)

    const belly = new THREE.Mesh(
        new THREE.BoxBufferGeometry(5, 8, 0.2),
        new THREE.MeshLambertMaterial({ color: 0xffffff })
    )
    belly.position.set(0, 9, 4 / 2)

    const innerLeftEar = new THREE.Mesh(
        new THREE.BoxBufferGeometry(3, 4, 0.2),
        new THREE.MeshLambertMaterial({ color: 0xffffff })
    )
    innerLeftEar.position.set(4.5, 28, 4 / 2)

    const innerRightEar = new THREE.Mesh(
        new THREE.BoxBufferGeometry(3, 4, 4),
        new THREE.MeshLambertMaterial({ color: 0xffffff })
    )
    innerRightEar.position.set(-4.5, 28, 0.1)

    const bodyDetail = new THREE.Group()
    bodyDetail.name = 'bodyDetail'
    bodyDetail.add(leftEye)
    bodyDetail.add(rightEye)
    bodyDetail.add(mouth)
    bodyDetail.add(belly)
    bodyDetail.add(innerLeftEar)
    bodyDetail.add(innerRightEar)

    return bodyDetail
}

function LeftArm() {
    const leftArmMesh = new THREE.Mesh(
        new THREE.BoxBufferGeometry(7, 4, 4),
        new THREE.MeshLambertMaterial({ color })
    )
    leftArmMesh.position.set(4.5, 0, 0)

    const leftHand = new THREE.Mesh(
        new THREE.BoxBufferGeometry(4, 4, 4),
        new THREE.MeshLambertMaterial({ color })
    )
    leftHand.position.set(6.5, 0, 0)
    leftHand.name = 'leftHand'

    const leftArm = new THREE.Group()
    leftArm.add(leftArmMesh)
    leftArm.add(leftHand)
    leftArm.position.set(6, 23, 0)
    leftArm.name = 'leftArm'

    return leftArm
}

function RightArm() {
    const rightArmMesh = new THREE.Mesh(
        new THREE.BoxBufferGeometry(7, 4, 4),
        new THREE.MeshLambertMaterial({ color })
    )
    rightArmMesh.position.set(-4.5, 0, 0)

    const rightHand = new THREE.Mesh(
        new THREE.BoxBufferGeometry(4, 4, 4),
        new THREE.MeshLambertMaterial({ color })
    )
    rightHand.position.set(-6.5, 0, 0)
    rightHand.name = 'rightHand'

    const rightArm = new THREE.Group()
    rightArm.add(rightArmMesh)
    rightArm.add(rightHand)
    rightArm.position.set(-6, 23, 0)
    rightArm.name = 'rightArm'

    return rightArm
}

function LeftLeg() {
    const leftLeg = new THREE.Mesh(
        new THREE.BoxBufferGeometry(4, 5, 4),
        new THREE.MeshLambertMaterial({ color })
    )
    leftLeg.position.set(6, 2.5, 0)
    leftLeg.name = 'leftLeg'

    return leftLeg
}

function RightLeg() {
    const rightLeg = new THREE.Mesh(
        new THREE.BoxBufferGeometry(4, 5, 4),
        new THREE.MeshLambertMaterial({ color })
    )
    rightLeg.position.set(-6, 2.5, 0)
    rightLeg.name = 'rightLeg'

    return rightLeg
}

export { color, Body, LeftArm, RightArm, LeftLeg, RightLeg }
