import { participants } from "../../models/components/avatar.js"
import { posRot } from "../../scene/components/pos-rot.js"
import dealWithCSSExpressionGestureEvent from "../click/changeButtonCSS.js"
import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.125/build/three.module.js";
import TWEEN from 'https://cdn.jsdelivr.net/npm/@tweenjs/tween.js@18.5.0/dist/tween.esm.js'

window.gesture = gesture
export default function gesture(who, gestureName, duration) {

	if (!participants[who].states.gesturing) {
		let action = participants[who].allActions.filter(obj => {
			return obj._clip.name === gestureName 
		})[0]
		let gestureTweenIn = new TWEEN.Tween(action).to({weight: 1}, duration)
		let gestureTweenOut = new TWEEN.Tween(action).to({weight: 0}, duration*2)
		gestureTweenIn.easing(TWEEN.Easing.Quintic.Out)
		gestureTweenOut.easing(TWEEN.Easing.Quintic.Out)
		gestureTweenOut.delay(2000)
		gestureTweenIn.chain(gestureTweenOut)
		gestureTweenIn.start();
		gestureTweenIn.onStart( function() {
			dealWithCSSExpressionGestureEvent('gesture', gestureName, true)
			participants[who].states.gesturing = true
		})
		gestureTweenOut.onComplete( function() {
			dealWithCSSExpressionGestureEvent('gesture', gestureName, false)
			participants[who].states.gesturing = false
		})
	}
}
