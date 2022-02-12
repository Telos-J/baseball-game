import camera from './camera'
import { controlBatter } from './batter'

function setupListeners(scene, renderer) {
    addEventListener('keydown', e => {
        const ball = scene.getObjectByName('ball')
        const bat = scene.getObjectByName('bat')
        if (controlBatter.state !== 'batReady') return
            
        if (e.code === 'Space') {
            controlBatter.swingBat()
            controlBatter.hit(ball)
        } else if (e.code === 'ArrowRight') {
            controlBatter.position.x += 1
            controlBatter.equipBat(bat)
        } else if (e.code === 'ArrowLeft') {
            controlBatter.position.x -= 1
            controlBatter.equipBat(bat)
        }
    })

    addEventListener('keyup', e => { 
        if (controlBatter.state !== 'swing') return
        if (e.code === 'Space') {
            controlBatter.makeReady()
        }
    })

    addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight
        camera.updateProjectionMatrix()
        renderer.setSize(window.innerWidth, window.innerHeight)
    })
}

export { setupListeners }
