import { highlightExpressionGesture } from "../../../setup/chat/events.js"
import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.125/build/three.module.js";
import TWEEN from 'https://cdn.jsdelivr.net/npm/@tweenjs/tween.js@18.5.0/dist/tween.esm.js'
import { updateAvatarState } from "../../../setup/chat/updates.js"
import { c } from '../../../setup/chat/init.js'

const gesture = (who, gestureName, duration) => {

	if ( who !== username ) {
		duration *= 0.7
	}
	if (!c.p[who].states.gesturing) {
		let action = c.p[who].allActions.filter(obj => {
			return obj._clip.name === gestureName 
		})[0]
		let gestureTweenIn = new TWEEN.Tween(action).to({weight: 1}, duration)
		let gestureTweenOut = new TWEEN.Tween(action).to({weight: 0}, duration*2)
		gestureTweenIn.easing(TWEEN.Easing.Quintic.Out)
		gestureTweenOut.easing(TWEEN.Easing.Quintic.Out)
		gestureTweenIn.chain(gestureTweenOut)
		
		if ( who === username ) {
			gestureTweenOut.delay(1500)
			setTimeout( function(){gestureTweenIn.start()}, 500);
		} else {
			gestureTweenOut.delay(1000)
			gestureTweenIn.start()
		}
		gestureTweenIn.onStart( function() {
			if (who === username ) {
				highlightExpressionGesture('gesture', gestureName, true)
			}
			updateAvatarState(who, 'gesturing', true)
		})
		gestureTweenOut.onComplete( function() {
			if (who === username ) {
				highlightExpressionGesture('gesture', gestureName, false)
			}
			updateAvatarState(who, 'gesturing', false)
		})
	}
}

export { gesture }
