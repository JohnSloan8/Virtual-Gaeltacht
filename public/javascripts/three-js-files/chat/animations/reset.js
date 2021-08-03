import { lenMorphs } from "./morph/prepare.js"
import { participants } from "../models/components/avatar.js"
import { stopAnimation } from "../main.js"
import TWEEN from 'https://cdn.jsdelivr.net/npm/@tweenjs/tween.js@18.5.0/dist/tween.esm.js'

export default function resetAll(n) {
	TWEEN.removeAll()
	stopAnimation();
	for(let i=0; i<n; i++) {
		participants[i].locationCopies = {
			head: {},
			neck: {rotation: {}},
			spine: {rotation: {}},
			spine1: {},
			spine2: {}
		}
		copyLocations(i)
		resetRandomRotations(i)
		resetLookingRotations(i)
		resetBlink(i)
		resetExpression(i)
	}
}
window.resetAll = resetAll

function copyLocations(who) {
	participants[who].locationCopies.head.rotation = participants[who].movableBodyParts.head.rotation.clone()
	participants[who].locationCopies.spine2.rotation = participants[who].movableBodyParts.spine2.rotation.clone()
	participants[who].locationCopies.spine1.rotation = participants[who].movableBodyParts.spine1.rotation.clone()
	participants[who].locationCopies.spine.rotation.z = participants[who].movableBodyParts.spine.rotation.z
	participants[who].locationCopies.neck.rotation.z = participants[who].movableBodyParts.neck.rotation.y
	console.log('participants[who].locationCopies.neck.rotation.z', participants[who].locationCopies.neck.rotation.z)
}

function resetLookingRotations(who) {
	participants[who].movableBodyParts.head.rotation.set(0,0,0)
	participants[who].movableBodyParts.spine2.rotation.set(0,0,0)
	participants[who].movableBodyParts.spine1.rotation.set(0,0,0)
}

function resetRandomRotations(who) {
	resetRandomSway(who)
	resetRandomNeckTurn(who)
}

function resetRandomSway(who) {
	try {
		participants[who].sway.stop()
	} catch {

	}
	//participants[who].sway = null
	participants[who].movableBodyParts.spine.rotation.z = 0
}

function resetRandomNeckTurn(who) {
	try {
		participants[who].neckTurn.stop()
	} catch {

	}
	//participants[who].neckTurn = null
	participants[who].movableBodyParts.neck.rotation.y = 0
	resetEyeRotations(who)
}

function resetEyeRotations(who) {
	participants[who].movableBodyParts.leftEye.rotation.set(0,0,0)
	participants[who].movableBodyParts.rightEye.rotation.set(0,0,0)
}

function resetBlink(who) {
	try {
		participants[who].blinking.stop()
	} catch {

	}
	//participants[who].blinking = null
	participants[who].states.keepBlinking = false
}

window.resetExpression = resetExpression
function resetExpression(who) {
	try {
		participants[who].expressionIn.stop()
		participants[who].expressionInTeeth.stop()
		participants[who].expressionOut.stop()
		participants[who].expressionOutTeeth.stop()
		//participants[who].expressionIn = null
		//participants[who].expressionInTeeth = null
		//participants[who].expressionOut = null
		//participants[who].expressionOutTeeth = null
	} catch(err) {
		console.log('error:', err.message)
	}
	let faceMorphsTo = new Array(lenMorphs).fill(0);
	let indexOfExpression = participants[who].movableBodyParts.face.morphTargetDictionary[participants[who].states.expression]
	faceMorphsTo[indexOfExpression] = 1
	participants[who].movableBodyParts.face.morphTargetInfluences = faceMorphsTo
}
