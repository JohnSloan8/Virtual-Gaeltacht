import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.125/build/three.module.js";
import TWEEN from 'https://cdn.jsdelivr.net/npm/@tweenjs/tween.js@18.5.0/dist/tween.esm.js'
import { blink } from "./blink.js"
import { cameraLookAt } from "./camera/keyboard-events.js"

window.avatarLookAt = avatarLookAt
const avatarLookAt = (who, toWhom, duration) => {
	if ( who === username ) {
		cameraLookAt(toWhom, duration)
	}
	if (!c.participantList.includes(toWhom)) {
		toWhom = positions[0]
	}
	if (who !== toWhom && toWhom !== null	&& toWhom !== undefined) {
		let head = new TWEEN.Tween(c.p[who].movableBodyParts.head.rotation).to(c.p[who].rotations[toWhom].head, 0.8*duration)
		let spine2 = new TWEEN.Tween(c.p[who].movableBodyParts.spine2.rotation).to(c.p[who].rotations[toWhom].spine2, 0.9*duration)
		let spine1 = new TWEEN.Tween(c.p[who].movableBodyParts.spine1.rotation).to(c.p[who].rotations[toWhom].spine1, duration)
		head.easing(TWEEN.Easing.Quintic.Out)
		spine2.easing(TWEEN.Easing.Quintic.Out)
		spine1.easing(TWEEN.Easing.Quintic.Out)
		head.start();
		spine2.start();
		spine1.start();
		c.p[who].states.currentlyLookingAt = toWhom
		blink(who, duration*0.0667)

		let direction = new THREE.Vector3();
		let focalPoint;
		if (toWhom !== who) {
			if (toWhom === username) {
				focalPoint = camera.getWorldPosition(direction)
			} else {
				focalPoint = c.p[toWhom].movableBodyParts.head.getWorldPosition(direction)
			}
		} else {
			focalPoint = new THREE.Vector3(0, 1.59, 0)
		}
		c.p[who].states.focalPoint = focalPoint

		head.onUpdate(function (object) {
			if (toWhom !== who) {
				c.p[who].movableBodyParts.leftEye.lookAt(focalPoint)
				c.p[who].movableBodyParts.rightEye.lookAt(focalPoint)
			}
		})
	}
}

export { avatarLookAt }
