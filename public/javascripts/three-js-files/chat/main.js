import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.125/build/three.module.js";
import Stats from "https://cdn.jsdelivr.net/npm/three@0.125/examples/jsm/libs/stats.module.js";
import { renderer, scene, stats, clock, windowWidth, windowHeight, controlPanelHeight } from "./scene/components/scene.js"
import { camera } from "./scene/components/camera.js"
import { cameraMe } from "./scene/components/cameraMe.js"
import { participants } from "./models/components/avatar.js"
import loadScene from "./scene/load-scene.js"
import loadModels from "./models/load-models.js"
import beginAction from "./animations/utils.js"
import cameraLookAt from "./animations/camera/keyboard.js"
import avatarLookAt from "./animations/look.js"
import avatarShake from "./animations/shake.js"
import blink from "./animations/morph/blink.js"
import expression from "./animations/morph/expression.js"
import gesture from "./animations/move/gesture.js"
import cameraEnter from "./animations/camera/enter.js"
import TWEEN from 'https://cdn.jsdelivr.net/npm/@tweenjs/tween.js@18.5.0/dist/tween.esm.js'
import { mouth } from './animations/random/mouth.js'
import initSocket from '../socket-logic.js'
import resetAll from "./animations/reset.js"
import returnAll from "./animations/returnToBeforeReset.js"

setAvatarNo();

window.setAvatarNo = setAvatarNo
function setAvatarNo() {
	initSocket();
	init();
}

function init() {
	loadScene()
	loadModels();
}

var animateScene = true
function animate() {
	if (animateScene) { 
		//console.log('in animate')
		const mixerUpdateDelta = clock.getDelta();
		Object.values(participants).forEach( function(p) {
			if (p.mixer !== undefined) {
				p.mixer.update(mixerUpdateDelta);
			}
		})
		stats.update();
		TWEEN.update();

		renderer.setViewport(0, 0, windowWidth, windowHeight);
		renderer.setScissor(0, 0, windowWidth, windowHeight);
		renderer.setScissorTest( true );
		camera.updateProjectionMatrix()	
		renderer.render(scene, camera);

		renderer.setViewport(windowWidth*0.375, controlPanelHeight, windowWidth*0.25, windowHeight*0.25);
		renderer.setScissor(windowWidth*0.375, controlPanelHeight, windowWidth*0.25, windowHeight*0.25);
		renderer.setScissorTest( true );
		renderer.setClearColor( 0xffffff, 1 )
		renderer.clearColor( 0xffffff, 1 )
		cameraMe.updateProjectionMatrix()	
		//renderer.render(scene, camera);
		renderer.render(scene, cameraMe);
		requestAnimationFrame(animate);
	}
}
window.startAnimation = startAnimation
function stopAnimation() {
	animateScene = false
}

window.stopAnimation = stopAnimation
function startAnimation() {
	animateScene = true
	animate()
}

window.stopStart = stopStart
function stopStart() {
	stopAnimation()
	startAnimation()
}


export { startAnimation, stopAnimation }
