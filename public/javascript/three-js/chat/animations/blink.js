import { easingDict } from "../animations/easings.js"
import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.125/build/three.module.js";
import TWEEN from 'https://cdn.jsdelivr.net/npm/@tweenjs/tween.js@18.5.0/dist/tween.esm.js'
import { c } from "../../../setup/chat/settings.js"
import { updateAvatarState } from "../models/states.js"

const beginRandomBlinking = () => {
	c.participantList.forEach(function(par) {
		randomBlink(par)
	})
}

const randomBlink = who => {
	blink(who)
	let randomDelay = 2000 + Math.random() * 5000
	setTimeout(function(){
		if (c.p[who] !== undefined) {
			randomBlink(who)
		}
	}, randomDelay)
}

const blink = (who, delay=0) => {
	if ( !c.p[who].states.changingExpression && !c.p[who].states.blinking ) {
		let lenMorphs = c.p[who].movableBodyParts.face.morphTargetInfluences.length
		let blinkTo = new Array(lenMorphs).fill(0);
		let partKey = c.p[who].movableBodyParts.face.morphTargetDictionary[c.p[who].states.expression + "_blink"]
		blinkTo[partKey] = 1
		let blinking = new TWEEN.Tween(c.p[who].movableBodyParts.face.morphTargetInfluences).to(blinkTo, 100)
			.easing(easingDict["cubicOut"])
			.yoyo(true)
			.repeat(1)
			.start()
			.delay(delay)
		blinking.onStart( function() {
			updateAvatarState(who, 'blinking', true)
		})
		blinking.onComplete( function() {
			updateAvatarState(who, 'blinking', false)
		})
	}
}
export { beginRandomBlinking, randomBlink, blink }
