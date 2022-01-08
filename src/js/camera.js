import * as THREE from 'three'

const camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 10000)
camera.position.set(0, 500, 200)
camera.lookAt(0, 50, 0)

camera.setAngleBatting = () => {
    camera.position.set(0, 500, 200)
    camera.lookAt(0, 50, 0)
}
camera.setAngleHit = () => {
    camera.position.set(-165.37496163276728, 421.8161515206532, 345.2090057130672)
    camera.rotation.set(-0.45866678101238545, -0.1132304069429281, -0.05573479065101504)
}
camera.setAngleHomeRun = () => {
    camera.position.set(-1999.7912696388998, 633.871463980283, 1730.8456952194106)
    camera.rotation.set(-1.8195586700177175, -1.03073238537359, -1.8587422506820728)
}

export default camera
