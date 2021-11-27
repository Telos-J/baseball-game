import * as THREE from 'three'

function setSwingBat(rootObject) {
    const bat = rootObject.getObjectByName('bat')
    const duration = 0.2

    const keyframe1 = new THREE.Quaternion()
    keyframe1.setFromEuler(new THREE.Euler(0, Math.PI / 2, 0))
    const keyframe2 = new THREE.Quaternion()
    keyframe2.setFromEuler(new THREE.Euler(0, Math.PI / 2 + Math.PI / 6, 0))
    const rotationKR = new THREE.QuaternionKeyframeTrack(
        '.quaternion',
        [0, duration],
        keyframe1.toArray().concat(keyframe2.toArray())
    )

    const batkeyframe1 = new THREE.Quaternion()
    batkeyframe1.setFromEuler(new THREE.Euler(0, -Math.PI / 1.3, -Math.PI / 6))
    const batkeyframe2 = new THREE.Quaternion()
    batkeyframe2.setFromEuler(new THREE.Euler(0, 0, 0))
    const batrotationKR = new THREE.QuaternionKeyframeTrack(
        `${bat.uuid}.quaternion`,
        [0, duration],
        batkeyframe1.toArray().concat(batkeyframe2.toArray())
    )

    const rotateClip = new THREE.AnimationClip('rotate', -1, [rotationKR, batrotationKR])
    const mixer = new THREE.AnimationMixer(rootObject)
    const action = mixer.clipAction(rotateClip)
    action.repetitions = 1
    action.clampWhenFinished = true

    rootObject.swingBatMixer = mixer
    rootObject.swingBatAction = action
}

export { setSwingBat }
