import avatarLookAt from './look.js'
import { noParticipants } from "../scene/settings.js"
import expression from "./morph/expression.js";
import avatarNodShake from "./shake.js";
import gesture from "./move/gesture.js";
import {expressionMorphs} from "./morph/prepare.js";

window.allLookAt = allLookAt
function allLookAt(who, jittered=true) {
	for (let i=0; i<noParticipants; i++) {
		let wait = 0;
		if ( jittered ) {
			wait = Math.random()*500;
		}
		setTimeout(function(){avatarLookAt(i, who, 1000)}, wait)
	}
}

window.allMakeRandomExpression = allMakeRandomExpression
function allMakeRandomExpression(jittered=true) {
	for (let i=1; i<noParticipants; i++) {
		let eM = Object.keys(expressionMorphs)
		console.log('eM:', eM)
		let randomExpression = eM[Math.floor(Math.random()*eM.length)];
		setTimeout(function(){expression(i, randomExpression)}, Math.random()*500)
	}
}

window.allRandomlyNodShake = allRandomlyNodShake
function allRandomlyNodShake(jittered=true) {
	for (let i=1; i<noParticipants; i++) {
		let randomNodShake = ["allRandomlyNodShake", "shake"][Math.floor(Math.random()*2)];
		setTimeout(function(){avatarNodShake(i, randomNodShake)}, Math.random()*1000)
	}
}

window.allMakeRandomGesture = allMakeRandomGesture
function allMakeRandomGesture(jittered=true) {
	for (let i=1; i<noParticipants; i++) {
		let randomGesture = participants[i].allActions[Math.floor(Math.random()*participants[i].allActions.length)]._clip.name;
		if (randomGesture !== "neutral_arm_pose") {
			setTimeout(function(){gesture(i, randomGesture, 1000)}, Math.random()*500)
		}
	}
}

export {allLookAt}
