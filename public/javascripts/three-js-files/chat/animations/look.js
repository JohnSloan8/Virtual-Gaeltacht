import { participants } from "../models/components/avatar.js"
import { posRot, participantNamesArray } from "../scene/components/pos-rot.js"
import { camera } from "../scene/components/camera.js";
import { noParticipants } from "../scene/settings.js"
import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.125/build/three.module.js";
import TWEEN from 'https://cdn.jsdelivr.net/npm/@tweenjs/tween.js@18.5.0/dist/tween.esm.js'
import blink from "./morph/blink.js"
import { table } from "../scene/components/table.js"
import { cameraLookAt } from "./camera/keyboard.js"

window.avatarLookAt = avatarLookAt
export default function avatarLookAt(who, toWhom, duration) {
	if ( who === username ) {
		cameraLookAt(toWhom, duration)
	}
	if (!participantNamesArray.includes(toWhom)) {
		toWhom = positions[0]
	}
	if (who !== toWhom && toWhom !== null	&& toWhom !== undefined) {
		let head = new TWEEN.Tween(participants[who].movableBodyParts.head.rotation).to(participants[who].rotations[toWhom].head, 0.8*duration)
		let spine2 = new TWEEN.Tween(participants[who].movableBodyParts.spine2.rotation).to(participants[who].rotations[toWhom].spine2, 0.9*duration)
		let spine1 = new TWEEN.Tween(participants[who].movableBodyParts.spine1.rotation).to(participants[who].rotations[toWhom].spine1, duration)
		head.easing(TWEEN.Easing.Quintic.Out)
		spine2.easing(TWEEN.Easing.Quintic.Out)
		spine1.easing(TWEEN.Easing.Quintic.Out)
		head.start();
		spine2.start();
		spine1.start();
		participants[who].states.currentlyLookingAt = toWhom
		//console.log('currentlyLookingAt:', participants[who].states.currentlyLookingAt)
		blink(who, duration*0.0667)

		let direction = new THREE.Vector3();
		let focalPoint;
		if (toWhom !== who) {
			if (toWhom === username) {
				focalPoint = camera.getWorldPosition(direction)
			} else {
				focalPoint = participants[toWhom].movableBodyParts.head.getWorldPosition(direction)
			}
		} else {
			focalPoint = new THREE.Vector3(0, 1.59, 0)
		}
		participants[who].states.focalPoint = focalPoint

		head.onUpdate(function (object) {
			if (toWhom !== who) {
				participants[who].movableBodyParts.leftEye.lookAt(focalPoint)
				participants[who].movableBodyParts.rightEye.lookAt(focalPoint)
			}
		})
	}
}
