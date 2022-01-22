import camera from './camera'

function setupListeners(scene, renderer) {
    addEventListener('keydown', e => {
        const batter = scene.getObjectByName('batter')
        const ball = scene.getObjectByName('ball')
        const bat = scene.getObjectByName('bat')
        if (batter.state !== 'batReady') return
            
        if (e.code === 'Space') {
            batter.swingBat()
            batter.hit(ball)
        } else if (e.code === 'ArrowRight') {
            batter.position.x += 1
            batter.equipBat(bat)
        } else if (e.code === 'ArrowLeft') {
            batter.position.x -= 1
            batter.equipBat(bat)
        }
    })

    addEventListener('keyup', e => { 
        const batter = scene.getObjectByName('batter')
        if (batter.state !== 'swing') return
        if (e.code === 'Space') {
            batter.makeReady()
        }
    })

    addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight
        camera.updateProjectionMatrix()
        renderer.setSize(window.innerWidth, window.innerHeight)
    })
}

export { setupListeners }
