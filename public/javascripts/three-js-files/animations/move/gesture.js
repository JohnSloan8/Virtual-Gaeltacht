import { participants } from "../../models/components/avatar.js"
import { posRot } from "../../scene/components/pos-rot.js"
import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.125/build/three.module.js";
import TWEEN from 'https://cdn.jsdelivr.net/npm/@tweenjs/tween.js@18.5.0/dist/tween.esm.js'

window.gesture = gesture
export default function gesture(who, gestureName, duration) {

	let action = participants[who].allActions.filter(obj => {
		return obj._clip.name === gestureName 
	})[0]
	console.log('in avatarGesture, action:', action)
	let gestureTweenIn = new TWEEN.Tween(action).to({weight: 1}, duration)
	let gestureTweenOut = new TWEEN.Tween(action).to({weight: 0}, duration*2)
	gestureTweenIn.easing(TWEEN.Easing.Quintic.Out)
	gestureTweenOut.easing(TWEEN.Easing.Quintic.Out)
	gestureTweenOut.delay(2000)
	gestureTweenIn.chain(gestureTweenOut)
	gestureTweenIn.start();
	participants[who].states.currentlyGesturing = true
}
