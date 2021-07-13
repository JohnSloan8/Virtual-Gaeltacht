import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.125/build/three.module.js";
import Stats from "https://cdn.jsdelivr.net/npm/three@0.125/examples/jsm/libs/stats.module.js";
import { renderer, scene, stats, clock } from "./scene/components/scene.js"
import { camera } from "./scene/components/camera.js"
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

let userID;
setAvatarNo();

window.setAvatarNo = setAvatarNo
function setAvatarNo() {
	userID = 0;
	initSocket();
	init();
}

function init() {
	loadScene()
	loadModels();
}

function animate() {
		const mixerUpdateDelta = clock.getDelta();
		Object.values(participants).forEach( function(p) {
			p.mixer.update(mixerUpdateDelta);
		})
		stats.update();
		TWEEN.update()
		renderer.render(scene, camera);
		requestAnimationFrame(animate);
}

export { animate, userID }
