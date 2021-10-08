import { background } from "./scene/settings.js";
import { renderer, scene, stats, clock, windowWidth, windowHeight } from "./scene/scene.js"
import { camera } from "../scene/camera.js"
import TWEEN from 'https://cdn.jsdelivr.net/npm/@tweenjs/tween.js@18.5.0/dist/tween.esm.js'

const animate = () => {
	const mixerUpdateDelta = clock.getDelta();
	Object.values(c.p).forEach( function(p) {
		if (p.mixer !== undefined) {
			p.mixer.update(mixerUpdateDelta);
		}
	})
	stats.update();
	TWEEN.update();
	renderer.setViewport(0, 0, windowWidth, windowHeight);
	camera.updateProjectionMatrix()	
	renderer.render(scene, camera);
	requestAnimationFrame(animate);
}

export { animate }
