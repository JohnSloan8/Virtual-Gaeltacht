import { participants } from "../models/components/avatar.js"
import { posRot } from "../scene/components/pos-rot.js"
import { camera } from "../scene/components/camera.js";
import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.125/build/three.module.js";
import TWEEN from 'https://cdn.jsdelivr.net/npm/@tweenjs/tween.js@18.5.0/dist/tween.esm.js'

function dampedSineEasingShake(k) {
	return 2*Math.exp(-2*k)*Math.cos(6*Math.PI*k - Math.PI/2)
}

function dampedSineEasingNod(k) {
	return 4*Math.exp(-2*k)*Math.cos(26.29*k + 5.1159535873095) + k/3.88554047 - Math.PI/8
}

window.avatarNodShake = avatarNodShake
export default function avatarNodShake(who, nodShake) {

	let curHeadRotX = participants[who].movableBodyParts.head.rotation.x
	let curHeadRotY = participants[who].movableBodyParts.head.rotation.y
	let initialRotation = {x:curHeadRotX-0.05}
	let easingFunc = dampedSineEasingNod
	let startTime = 3000
	if (nodShake === "shake") {
		initialRotation = {y:curHeadRotY+0.25}
		easingFunc = dampedSineEasingShake
	}

	let start = new TWEEN.Tween(participants[who].movableBodyParts.head.rotation).to(initialRotation, startTime)
		.easing(easingFunc)
	start.start();

	let direction = new THREE.Vector3();
	let focalPoint;
	if (participants[who].states.currentlyLookingAt === 0) {
		focalPoint = camera.getWorldPosition(direction)
	} else {
		focalPoint = participants[participants[who].states.currentlyLookingAt].movableBodyParts.head.getWorldPosition(direction)
	}
	start.onUpdate(function (object) {
		participants[who].movableBodyParts.leftEye.lookAt(focalPoint)
		participants[who].movableBodyParts.rightEye.lookAt(focalPoint)
	})
}
