import { loadScene } from "./scene/load-scene.js"

//import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.125/build/three.module.js";
//import Stats from "https://cdn.jsdelivr.net/npm/three@0.125/examples/jsm/libs/stats.module.js";
//import { renderer, scene, stats, clock, windowWidth, windowHeight, controlPanelHeight } from "./scene/components/scene.js"
//import { camera } from "./scene/components/camera.js"
//import { cameraMe } from "./scene/components/cameraMe.js"
//import { participants } from "./models/components/avatar.js"
//import loadModels from "./models/load-models.js"
//import beginAction from "./animations/utils.js"
//import cameraLookAt from "./animations/camera/keyboard.js"
//import avatarLookAt from "./animations/look.js"
//import avatarShake from "./animations/shake.js"
//import blink from "./animations/morph/blink.js"
//import expression from "./animations/morph/expression.js"
//import gesture from "./animations/move/gesture.js"
//import cameraEnter from "./animations/camera/enter.js"
//import TWEEN from 'https://cdn.jsdelivr.net/npm/@tweenjs/tween.js@18.5.0/dist/tween.esm.js'
//import { mouth } from './animations/random/mouth.js'
//import { entranceAnimationPlaying } from "./scene/settings.js"

const initScene = part => {
	if (part === "scene") {
    $('#loadingText').text('loading scene...')
		loadScene()
	} else if (part === "avatars") {
    $('#loadingText').text('loading avatars...')
		//loadModels()
	}
}

export { initScene }
