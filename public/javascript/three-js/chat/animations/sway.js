import TWEEN from 'https://cdn.jsdelivr.net/npm/@tweenjs/tween.js@18.5.0/dist/tween.esm.js'
import { easingDict } from "../animations/easings.js"
import { c } from '../../../setup/chat/init.js'

const beginRandomSwaying = () => {
	c.participantList.forEach(function(par) {
		randomSway(par);
		randomNeckTurn(par);
	})
}

const randomSway = (who, direction=1) => {
	let randomDuration = 2000 + Math.random()*5000;
	let randomRotation = Math.random()*0.025 * direction;
	if (c.p[who].states.speaking) {
		randomDuration /= 2;
		randomRotation *= 2;
	}
	let sway = new TWEEN.Tween(c.p[who].movableBodyParts.spine.rotation).to({z: randomRotation}, randomDuration)
		.easing(easingDict["cubicInOut"])
		.start()
	setTimeout(function(){
		if (c.p[who] !== undefined) {
			randomSway(who, direction*=-1)
		}
	}, randomDuration)
}

const randomNeckTurn = (who, direction=1) => {
	let randomDuration = 2000 + Math.random()*5000;
	let randomRotation = Math.random()*0.075 * direction;
	if (c.p[who].states.speaking) {
		randomDuration /= 2;
		randomRotation *= 2;
	}
	let turn = new TWEEN.Tween(c.p[who].movableBodyParts.neck.rotation).to({y: randomRotation}, randomDuration)
		.easing(easingDict["cubicInOut"])
		.start()
	turn.onUpdate(function (object) {
		if (c.p[who] !== undefined ) {
			if ( c.p[who].states.focalPoint !== undefined ) {
				c.p[who].movableBodyParts.leftEye.lookAt(c.p[who].states.focalPoint)
				c.p[who].movableBodyParts.rightEye.lookAt(c.p[who].states.focalPoint)
			}
		}
	})
	setTimeout(function(){
		if (c.p[who] !== undefined) {
			randomNeckTurn(who, direction*=-1)
		}
	}, randomDuration)
}

export { beginRandomSwaying, randomSway, randomNeckTurn }
