import { highlightExpressionGesture } from "../../../setup/chat/events.js"
import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.125/build/three.module.js";
import TWEEN from 'https://cdn.jsdelivr.net/npm/@tweenjs/tween.js@18.5.0/dist/tween.esm.js'
import { updateAvatarState } from "../../../setup/chat/updates.js"
import { c } from '../../../setup/chat/init.js'

const dampedSineEasingShake = k => {
	return 2*Math.exp(-2*k)*Math.cos(6*Math.PI*k - Math.PI/2)
}

const dampedSineEasingNod = k => {
	return 4*Math.exp(-2*k)*Math.cos(26.29*k + 5.1159535873095) + k/3.88554047 - Math.PI/8
}

const avatarNodShake = (who, nodShake) => {

	if ( !c.p[who].states.nodShaking ) {

		let curHeadRotX = c.p[who].movableBodyParts.head.rotation.x
		let curHeadRotY = c.p[who].movableBodyParts.head.rotation.y
		let initialRotation = {x:curHeadRotX-0.05}
		let easingFunc = dampedSineEasingNod
		let startTime = 3000
		if (nodShake === "shake") {
			initialRotation = {y:curHeadRotY+0.25}
			easingFunc = dampedSineEasingShake
		}

		let start = new TWEEN.Tween(c.p[who].movableBodyParts.head.rotation).to(initialRotation, startTime)
			.easing(easingFunc)
		start.start();
		
		start.onStart( function() {
			updateAvatarState(who, 'nodShaking', true)
			if (who === 0 ) {
				socketSend('nodShake', nodShake)
				highlightExpressionGesture("nodShake", nodShake + "_head", true)
			}
		})

		let direction = new THREE.Vector3();
		let focalPoint;
		if (c.p[who].states.currentlyLookingAt === c.positions[0]) {
			focalPoint = c.cameras.main.camera.getWorldPosition(direction)
		} else {
			focalPoint = c.p[c.p[who].states.currentlyLookingAt].movableBodyParts.head.getWorldPosition(direction)
			focalPoint.x *= 0.75
			focalPoint.z *= 0.75
		}
		updateAvatarState(who, 'focalPoint', focalPoint)
		start.onUpdate(function (object) {
			c.p[who].movableBodyParts.leftEye.lookAt(c.p[who].states.focalPoint)
			c.p[who].movableBodyParts.rightEye.lookAt(c.p[who].states.focalPoint)
		})
		start.onComplete( function() {
			updateAvatarState(who, 'nodShaking', false)
			if (who === 0 ) {
				highlightExpressionGesture("nodShake", nodShake + "_head", false)
			}
		})
	} else {
		console.log('already nodding or shaking')
	}
}

export { avatarNodShake }
