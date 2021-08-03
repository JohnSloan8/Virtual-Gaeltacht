import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.125/build/three.module.js";
import { Reflector } from "https://cdn.jsdelivr.net/npm/three@0.125/examples/jsm/objects/Reflector.js";
import {allLookAt} from "./test.js"
import avatarLookAt from "./look.js"
import cameraLookAt from "./camera/keyboard.js"
import createKeyBindings from "./camera/keyboard.js"
import createClickActions from "./click/main.js"
import { showEntranceAnimation, showMe, noParticipants, cameraSettings, orbitControls } from "../scene/settings.js"
import { OrbitControls } from "https://cdn.jsdelivr.net/npm/three@0.125/examples/jsm/controls/OrbitControls.js";
import { renderer, scene, windowWidth, windowHeight } from "../scene/components/scene.js"
import { camera } from "../scene/components/camera.js"
import { cameraMe } from "../scene/components/cameraMe.js"
import beginRandomBlinking from "./random/blink.js"
import beginRandomSwaying from "./random/sway.js"
import { participant0ZOffset, cameraMeOffset, /*verticalMirrorOffset,*/ initialiseVisemeMorphIndexes, randomBlinking, randomSwaying } from "./settings.js"
import { table } from "../scene/components/table.js"

let controls, verticalMirror, cameraMeGroup

export default function initAnimations() {
	createKeyBindings();
	createClickActions();
	if ( showEntranceAnimation ) {
		camera.position.set(posRot[noParticipants].cameraStart.position.x, posRot[noParticipants].cameraStart.position.y, posRot[noParticipants].cameraStart.position.z);
		setTimeout(cameraEnter, 1000);
	} else {
		if ( !showMe ) {
			participants[0].model.visible = false
		}
		camera.position.set(0, posRot[noParticipants].camera.y, posRot[noParticipants].camera.z);
		camera.lookAt(cameraSettings.neutralFocus)
		addCameraMe();

	}
	calculateCameraRotations();
	if ( randomBlinking ) {
		beginRandomBlinking();
	}
	if ( randomSwaying ) {
		beginRandomSwaying();
	}
	allLookAt(-1, false)
}

function addCameraMe() {
	// cameraMe
	cameraMe.position.set(0, posRot[noParticipants].camera.y-0.1, cameraMeOffset);
	let geometry = new THREE.PlaneGeometry( 2, 2 );
	verticalMirror = new Reflector( geometry, {
		clipBias: 0.003,
		textureWidth: windowWidth * window.devicePixelRatio,
		textureHeight: windowHeight * window.devicePixelRatio,
		color: 0x889999
	} );
	verticalMirror.position.set(0, posRot[noParticipants].camera.y, 0);
	verticalMirror.rotation.x = -0.05
	participants[0].model.position.z = participant0ZOffset
	cameraMeGroup = new THREE.Group()
	cameraMeGroup.add(cameraMe)
	cameraMeGroup.add(verticalMirror)
	cameraMeGroup.add(participants[0].model)
	cameraMeGroup.position.z = camera.position.z
	scene.add( cameraMeGroup );
	window.cameraMeGroup = cameraMeGroup
	window.verticalMirror = verticalMirror
}

function calculateCameraRotations() {
	for (let k=1; k<noParticipants; k++) {
		let direction = new THREE.Vector3();
		let headPos = participants[k].movableBodyParts.head.getWorldPosition(direction)
		camera.lookAt(headPos)
		posRot[noParticipants].camera.rotations[k] = {
			x: camera.rotation.x * 0.075 - 0.075,
			y: camera.rotation.y * 0.15,
		}
	}
	// look at table
	let tableDirection = new THREE.Vector3();
	let tablePos = table.getWorldPosition(tableDirection)
	camera.lookAt(tablePos)
	posRot[noParticipants].camera.rotations[-1] = {
		x: camera.rotation.x * 0.5,
		y: camera.rotation.y * 0.15,
	}
	if ( orbitControls ) {
		controls = new OrbitControls(camera, renderer.domElement);
		controls.target.set(0, 1.59, 0);
		controls.update();
		controls = new OrbitControls(camera, renderer.domElement);
		controls.target.set(0, 1.59, 0);
		controls.update();
	}
}

export { controls, cameraMeGroup, calculateCameraRotations }
