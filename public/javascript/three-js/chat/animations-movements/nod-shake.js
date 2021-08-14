import { dealWithCSSExpressionGestureEvent } from "../animations-loaded/click-events.js"
import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.125/build/three.module.js";
import TWEEN from 'https://cdn.jsdelivr.net/npm/@tweenjs/tween.js@18.5.0/dist/tween.esm.js'

const dampedSineEasingShake = k => {
	return 2*Math.exp(-2*k)*Math.cos(6*Math.PI*k - Math.PI/2)
}

const dampedSineEasingNod = k => {
	return 4*Math.exp(-2*k)*Math.cos(26.29*k + 5.1159535873095) + k/3.88554047 - Math.PI/8
}

window.avatarNodShake = avatarNodShake
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
			c.p[who].states.nodShaking = true;
			if (who === 0 ) {
				socketSend('nodShake', nodShake)
				dealWithCSSExpressionGestureEvent("nodShake", nodShake + "_head", true)
			}
		})

		let direction = new THREE.Vector3();
		let focalPoint;
		if (c.p[who].states.currentlyLookingAt === c.participantList[0]) {
			focalPoint = camera.getWorldPosition(direction)
		} else {
			focalPoint = c.p[c.p[who].states.currentlyLookingAt].movableBodyParts.head.getWorldPosition(direction)
		}
		start.onUpdate(function (object) {
			c.p[who].movableBodyParts.leftEye.lookAt(focalPoint)
			c.p[who].movableBodyParts.rightEye.lookAt(focalPoint)
		})
		start.onComplete( function() {
			c.p[who].states.nodShaking = false;
			if (who === 0 ) {
				dealWithCSSExpressionGestureEvent("nodShake", nodShake + "_head", false)
			}
		})
	} else {
		console.log('already nodding or shaking')
	}
}

export { avatarNodShake }
