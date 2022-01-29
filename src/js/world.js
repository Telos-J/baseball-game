import * as THREE from 'three'

const worldDimensions = {
    worldWidth: 10000,
    worldHeight: 10000,
    stadiumWidth: 3000,
    stadiumHeight: 3000,
    base1Position: [531, 0, 438],
    base2Position: [403, 0, 301],
    base3Position: [275, 0, 438],
}

function toWorldDimensions(x, y, z) {
    return new THREE.Vector3(
        (worldDimensions.stadiumWidth * (x - 403.07)) / 806.14,
        0,
        (worldDimensions.stadiumHeight * (z - 590)) / 731.5
    )
}

export { worldDimensions, toWorldDimensions }
