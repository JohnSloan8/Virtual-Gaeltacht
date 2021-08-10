import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.125/build/three.module.js";
import { Reflector } from "https://cdn.jsdelivr.net/npm/three@0.125/examples/jsm/objects/Reflector.js";
import {allLookAt} from "./test.js"
import avatarLookAt from "./look.js"
import cameraLookAt from "./camera/keyboard.js"
import createKeyBindings from "./camera/keyboard.js"
import createClickActions from "./click/main.js"
import { entranceAnimationPlaying, setEntranceAnimationPlaying, showMe, noParticipants, cameraSettings, orbitControls } from "../scene/settings.js"
import { OrbitControls } from "https://cdn.jsdelivr.net/npm/three@0.125/examples/jsm/controls/OrbitControls.js";
import { renderer, scene, windowWidth, windowHeight, onWindowResize } from "../scene/components/scene.js"
import { camera } from "../scene/components/camera.js"
import { cameraMe } from "../scene/components/cameraMe.js"
import beginRandomBlinking from "./random/blink.js"
import beginRandomSwaying from "./random/sway.js"
import { participant0ZOffset, cameraMeOffset, /*verticalMirrorOffset,*/ initialiseVisemeMorphIndexes, randomBlinking, randomSwaying } from "./settings.js"
import { table } from "../scene/components/table.js"
import { participantNamesArray } from "../scene/components/pos-rot.js"
import { displayWaitingList } from "../../socket-logic.js"

let controls, verticalMirror, cameraMeGroup

export default function initAnimations() {
	if (firstEnter === "true") {
		setEntranceAnimationPlaying(true)
	}
	createKeyBindings();
	createClickActions();
	if ( entranceAnimationPlaying ) {
		camera.position.set(posRot[participantNamesArray.length].cameraStart.position.x, posRot[participantNamesArray.length].cameraStart.position.y, posRot[participantNamesArray.length].camera.z+1);
		addCameraMeGroup(false, true);
		setTimeout(cameraEnter, 500);
	} else {
		$('#controlPanelOverlay').show()
		onWindowResize();
		camera.position.set(0, posRot[noParticipants].camera.y, posRot[noParticipants].camera.z);
		// cameraMe
		addCameraMeGroup(true, false);
		//camera.lookAt(cameraSettings.neutralFocus)
	}
	calculateCameraRot();
	participantNamesArray.forEach(function(p) {
		avatarLookAt(p, participants[p].states.currentlyLookingAt, 1)
	})
	if ( randomBlinking ) {
		beginRandomBlinking();
	}
	if ( randomSwaying ) {
		beginRandomSwaying();
	}
	if (host === username) {
		displayWaitingList();
	}
}

function calculateCameraRot() {
	participantNamesArray.forEach(function(p) {
		let direction = new THREE.Vector3();
		let headPos = participants[p].movableBodyParts.head.getWorldPosition(direction)
		camera.lookAt(headPos)
		posRot[participantNamesArray.length].camera.rotations[p] = {
			x: camera.rotation.x * 0.075 - 0.075,
			y: camera.rotation.y * 0.15,
			z: 0
		}
	})
	if ( orbitControls ) {
		controls = new OrbitControls(camera, renderer.domElement);
		controls.target.set(0, 1.59, 0);
		controls.update();
		window.controls = controls
	}
	let r = posRot[noParticipants].camera.rotations[participants[participantNamesArray[0]].states.currentlyLookingAt]
	camera.rotation.set(r.x, r.y, r.z)
}

function addCameraMeGroup(mirrorVisible, entrance) {
	cameraMe.position.set(0, posRot[noParticipants].camera.y-0.1, cameraMeOffset);
	let geometry = new THREE.PlaneGeometry( 2, 2 );
	verticalMirror = new Reflector( geometry, {
		clipBias: 0.003,
		textureWidth: windowWidth * window.devicePixelRatio,
		textureHeight: windowHeight * window.devicePixelRatio,
		color: 0x889999
	} );
	verticalMirror.visible = mirrorVisible
	verticalMirror.position.set(0, posRot[noParticipants].camera.y, 0);
	verticalMirror.rotation.x = -0.05
	participants[participantNamesArray[0]].model.position.z = participant0ZOffset
	cameraMeGroup = new THREE.Group()
	cameraMeGroup.add(cameraMe)
	cameraMeGroup.add(verticalMirror)
	cameraMeGroup.add(participants[participantNamesArray[0]].model)
	if (entrance) {
		cameraMeGroup.position.z = camera.position.z + 3
	} else {
		cameraMeGroup.position.z = camera.position.z
	}
	scene.add( cameraMeGroup );
	window.cameraMeGroup = cameraMeGroup
}

export { controls, cameraMeGroup, calculateCameraRot, verticalMirror }
