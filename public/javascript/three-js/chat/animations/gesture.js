import { dealWithCSSExpressionGestureEvent } from "../enter/click-events.js"
import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.125/build/three.module.js";
import TWEEN from 'https://cdn.jsdelivr.net/npm/@tweenjs/tween.js@18.5.0/dist/tween.esm.js'
import { socketSend } from '../../../web-sockets/chat/send.js'
import { updateAvatarState } from "../models/states.js"
import { c } from '../../../setup/chat/settings.js'

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
		
		if ( who === 0 ) {
			sendGesture(0, gestureName)
			gestureTweenOut.delay(2000)
			setTimeout( function(){gestureTweenIn.start()}, 500);
		} else {
			gestureTweenOut.delay(1200)
			gestureTweenIn.start()
		}
		gestureTweenIn.onStart( function() {
			if (who === 0 ) {
				dealWithCSSExpressionGestureEvent('gesture', gestureName, true)
			}
			updateAvatarState(who, 'gesturing', true)
		})
		gestureTweenOut.onComplete( function() {
			if (who === username ) {
				dealWithCSSExpressionGestureEvent('gesture', gestureName, false)
			}
			updateAvatarState(who, 'gesturing', false)
		})
	}
}

export { gesture }
