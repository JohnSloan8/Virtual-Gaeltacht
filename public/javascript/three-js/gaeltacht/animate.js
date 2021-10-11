import { renderer, scene, stats, clock, windowWidth, windowHeight } from "./scene/scene.js"
import TWEEN from 'https://cdn.jsdelivr.net/npm/@tweenjs/tween.js@18.5.0/dist/tween.esm.js'
import { camera } from "./scene/camera.js"

const animate = () => {
	const mixerUpdateDelta = clock.getDelta();
	stats.update();
	TWEEN.update();

	renderer.setViewport(0, 0, windowWidth, windowHeight);
	camera.updateProjectionMatrix()	
	renderer.render(scene, camera);

	requestAnimationFrame(animate);
}

export { animate }
