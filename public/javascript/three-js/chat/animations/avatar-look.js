import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.125/build/three.module.js";
import TWEEN from 'https://cdn.jsdelivr.net/npm/@tweenjs/tween.js@18.5.0/dist/tween.esm.js'
import { blink } from "./blink.js"
import { cameraLookAt } from "./camera-look.js"
import { updateAvatarState } from "../../../setup/chat/updates.js"
import { c } from '../../../setup/chat/init.js'

const avatarLookAt = (who, toWhom, duration, body=false) => {
	if (who !== toWhom && toWhom !== null	&& toWhom !== undefined) {
		if ( who === username ) {
			cameraLookAt(toWhom, duration)
		}
		if (duration === 1) {
			let h = c.p[who].lookRotations[toWhom].head
			let s2 = c.p[who].lookRotations[toWhom].spine2
			let s1 = c.p[who].lookRotations[toWhom].spine1
			c.p[who].movableBodyParts.head.rotation.set(h.x, h.y, h.z)
			c.p[who].movableBodyParts.spine2.rotation.set(s2.x, s2.y, s2.z)
			c.p[who].movableBodyParts.spine1.rotation.set(s1.x, s1.y, s1.z)
		} else {
			let head = new TWEEN.Tween(c.p[who].movableBodyParts.head.rotation).to(c.p[who].lookRotations[toWhom].head, 0.8*duration)
			let spine2 = new TWEEN.Tween(c.p[who].movableBodyParts.spine2.rotation).to(c.p[who].lookRotations[toWhom].spine2, 0.9*duration)
			let spine1 = new TWEEN.Tween(c.p[who].movableBodyParts.spine1.rotation).to(c.p[who].lookRotations[toWhom].spine1, duration)
			head.easing(TWEEN.Easing.Quintic.Out)
			spine2.easing(TWEEN.Easing.Quintic.Out)
			spine1.easing(TWEEN.Easing.Quintic.Out)
			head.start();
			spine2.start();
			spine1.start();
			blink(who, duration*0.0667)
			head.onUpdate(function (object) {
				if (toWhom !== who) {
					c.p[who].movableBodyParts.leftEye.lookAt(focalPoint)
					c.p[who].movableBodyParts.rightEye.lookAt(focalPoint)
				}
			})
		}

		let direction = new THREE.Vector3();
		let focalPoint;
		if (toWhom === username) {
			focalPoint = c.cameras.main.camera.getWorldPosition(direction)
		} else {
			focalPoint = c.p[toWhom].movableBodyParts.head.getWorldPosition(direction)
			// look more at nose area
			focalPoint.x *= 0.75
			focalPoint.z *= 0.75
		}
		updateAvatarState(who, 'focalPoint', focalPoint)
		updateAvatarState(who, 'currentlyLookingAt', toWhom)
	}
}
window.avatarLookAt = avatarLookAt

export { avatarLookAt }
