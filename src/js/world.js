const worldDimensions = {
    worldWidth: 10000,
    worldHeight: 10000,
    stadiumWidth: 3000,
    stadiumHeight: 3000,
    pitcher: 0,
}

function toWorldDimensions(x, y) {
    return [
        (worldDimensions.stadiumWidth * (x - 403.07)) / 806.14,
        (worldDimensions.stadiumHeight * (y - 590)) / 731.5,
    ]
}

export { worldDimensions, toWorldDimensions }
