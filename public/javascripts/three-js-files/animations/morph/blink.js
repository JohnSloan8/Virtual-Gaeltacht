import { participants } from "../../models/components/avatar.js"
import { posRot } from "../../scene/components/pos-rot.js"
import { camera } from "../../scene/components/camera.js";
import { noParticipants } from "../../scene/settings.js"
import easingDict from "../easings.js"
import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.125/build/three.module.js";
import TWEEN from 'https://cdn.jsdelivr.net/npm/@tweenjs/tween.js@18.5.0/dist/tween.esm.js'

window.blink = blink
export default function blink(who, delay=0) {

	if ( !participants[who].states.changingExpression && !participants[who].states.blinking ) {

		let lenMorphs = participants[who].movableBodyParts.face.morphTargetInfluences.length
		let blinkTo = new Array(lenMorphs).fill(0);
		let partKey = participants[who].movableBodyParts.face.morphTargetDictionary[participants[who].states.expression + "_blink"]
		blinkTo[partKey] = 1
		let blinking = new TWEEN.Tween(participants[who].movableBodyParts.face.morphTargetInfluences).to(blinkTo, 100)
			.easing(easingDict["cubicOut"])
			.yoyo(true)
			.repeat(1)
			.start()
			.delay(delay)
	blinking.onStart( function() {
		participants[who].states.blinking = true	
	})
	blinking.onComplete( function() {
		participants[who].states.blinking = false	
	})
	}
}
