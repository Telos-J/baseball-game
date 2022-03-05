import camera from './camera'

function setupListeners(scene, renderer) {
    addEventListener('keydown', e => {
        const ball = scene.getObjectByName('ball')
        const bat = scene.getObjectByName('bat')
        const controlBatter = scene.getObjectByName('controlBatter')
        if (controlBatter.state !== 'batReady') return

        if (e.code === 'Space') {
            controlBatter.swingBat()
            controlBatter.hit(ball, true)
        } else if (e.code === 'KeyX') {
            controlBatter.swingBat()
            controlBatter.hit(ball, false)
        } else if (e.code === 'ArrowRight') {
            controlBatter.position.x += 1
        } else if (e.code === 'ArrowLeft') {
            controlBatter.position.x -= 1
        }
    })

    addEventListener('keyup', e => {
        const controlBatter = scene.getObjectByName('controlBatter')
        if (controlBatter.state !== 'swing') return
        if (e.code === 'Space' || e.code === 'KeyX') {
            controlBatter.makeReady()
        }
    })

    addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight
        camera.updateProjectionMatrix()
        renderer.setSize(window.innerWidth, window.innerHeight)
    })
}

export {setupListeners}
