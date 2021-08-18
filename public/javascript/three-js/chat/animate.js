import { renderer, scene, stats, clock, windowWidth, windowHeight, controlPanelHeight } from "./scene/scene.js"
import { c } from "../../setup/chat/settings.js"
import TWEEN from 'https://cdn.jsdelivr.net/npm/@tweenjs/tween.js@18.5.0/dist/tween.esm.js'

//import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.125/build/three.module.js";
//import Stats from "https://cdn.jsdelivr.net/npm/three@0.125/examples/jsm/libs/stats.module.js";
//import { camera } from "./scene/components/camera.js"
//import { cameraMe } from "./scene/components/cameraMe.js"
//import { participants } from "./models/components/avatar.js"
//import loadScene from "./scene/load-scene.js"
//import loadModels from "./models/load-models.js"
//import beginAction from "./animations/utils.js"
//import cameraLookAt from "./animations/camera/keyboard.js"
//import avatarLookAt from "./animations/look.js"
//import avatarShake from "./animations/shake.js"
//import blink from "./animations/morph/blink.js"
//import expression from "./animations/morph/expression.js"
//import gesture from "./animations/move/gesture.js"
//import cameraEnter from "./animations/camera/enter.js"
//import { mouth } from './animations/random/mouth.js'

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
	renderer.setScissor(0, 0, windowWidth, windowHeight);
	renderer.setScissorTest( true );
	c.cameras.main.camera.updateProjectionMatrix()	
	renderer.render(scene, c.cameras.main.camera);

	if (!c.entering.me) {
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
