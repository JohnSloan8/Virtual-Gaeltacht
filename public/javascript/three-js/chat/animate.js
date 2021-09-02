import { renderer, scene, stats, clock, windowWidth, windowHeight, controlPanelHeight } from "./scene/scene.js"
import { c } from "../../setup/chat/init.js"
import TWEEN from 'https://cdn.jsdelivr.net/npm/@tweenjs/tween.js@18.5.0/dist/tween.esm.js'

const animate = () => {
	const mixerUpdateDelta = clock.getDelta();
	Object.values(c.p).forEach( function(p) {
		if (p.mixer !== undefined) {
			p.mixer.update(mixerUpdateDelta);
		}
	})
	//stats.update();
	TWEEN.update();

	renderer.setViewport(0, 0, windowWidth, windowHeight);
	renderer.setScissor(0, 0, windowWidth, windowHeight);
	renderer.setScissorTest( true );
	c.cameras.main.camera.updateProjectionMatrix()	
	renderer.render(scene, c.cameras.main.camera);

	if (!c.meEntering) {
		renderer.setViewport(windowWidth*0.375, controlPanelHeight, windowWidth*0.25, windowHeight*0.25);
		renderer.setScissor(windowWidth*0.375, controlPanelHeight, windowWidth*0.25, windowHeight*0.25);
		renderer.setScissorTest( true );
		renderer.setClearColor( 0xffffff, 1 )
		renderer.clearColor( 0xffffff, 1 )
		c.cameras.selfie.camera.updateProjectionMatrix()	
		renderer.render(scene, c.cameras.selfie.camera);
	}

	requestAnimationFrame(animate);
}

export { animate }
