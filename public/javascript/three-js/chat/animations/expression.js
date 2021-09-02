import { easingDict } from "../animations/easings.js"
import { highlightExpressionGesture } from "../../../setup/chat/events.js"
import { expressionMorphs, jawNeeded } from "../animations/morph-targets.js"
import { mouth } from "../animations/mouth.js"
import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.125/build/three.module.js";
import TWEEN from 'https://cdn.jsdelivr.net/npm/@tweenjs/tween.js@18.5.0/dist/tween.esm.js'
import { updateAvatarState } from "../../../setup/chat/updates.js"
import { c } from '../../../setup/chat/init.js'

const allExpression = e => {
	c.participantList.forEach(function(p) {
		expression(p, e)
	})
}

const expression = (who, e, duration) => {
	if (!c.p[who].states.changingExpression) {
		let faceMorphsTo = new Array(c.lenMorphs).fill(0);
		//let faceMorphsHalf = new Array(c.lenMorphs).fill(0);
		let indexOfExpression = c.p[who].movableBodyParts.face.morphTargetDictionary[e]
		faceMorphsTo[indexOfExpression] = 1
		//faceMorphsHalf[c.p[who].movableBodyParts.face.morphTargetDictionary["half_" + e]] = 1

		if (duration === 1) {
			c.p[who].movableBodyParts.face.morphTargetInfluences = faceMorphsTo
		} else {
			let expressionIn = new TWEEN.Tween(c.p[who].movableBodyParts.face.morphTargetInfluences).to(faceMorphsTo, duration)
				.easing(easingDict["cubicOut"])

			//let expressionOut = new TWEEN.Tween(c.p[who].movableBodyParts.face.morphTargetInfluences).to(faceMorphsHalf, 1000)
				//.easing(easingDict["cubicOut"])
				//.delay(2000)
			
			//expressionIn.chain(expressionOut)
			expressionIn.start()

			let splitExpressionName = e.split('_')
			let baseExpression = splitExpressionName[0]
			//if (splitExpressionName[0] === 'half') {
				//baseExpression = splitExpressionName[1]
			//}
			expressionIn.onStart( function() {
				console.log('tween expression starting')
				updateAvatarState(who, 'changingExpression', true)
				updateAvatarState(who, 'expression', 'changing')
				if (who === username ) {
					highlightExpressionGesture('emotion', e, true)
				}
				if ( jawNeeded[splitExpressionName[0]] || jawNeeded[splitExpressionName[1]] ) {
					let indexOfMouthOpenInTeeth = c.p[who].movableBodyParts.teeth.morphTargetDictionary["mouthOpen"]
					// dunno why have to hard code the "0" below
					new TWEEN.Tween(c.p[who].movableBodyParts.teeth.morphTargetInfluences).to({"0": expressionMorphs[e].jawOpen*1.5}, duration)
					.easing(easingDict["cubicOut"])
					.start()
				}
			})
			expressionIn.onComplete( function() {
				if (who === username ) {
					highlightExpressionGesture('emotion', e, false)
				}
				updateAvatarState(who, 'changingExpression', false)
				updateAvatarState(who, 'expression', e)
				if (c.p[who].states.speaking && !c.p[who].states.mouthing) {
					mouth(who)
				}
			})
			//expressionOut.onStart( function() {
				//if ( jawNeeded[baseExpression] ) {
					//new TWEEN.Tween(c.p[who].movableBodyParts.teeth.morphTargetInfluences).to({"0": expressionMorphs['half_' + e].jawOpen}, 1500)
					//.easing(easingDict["cubicOut"])
					//.start()
				//}
			//})
			//expressionOut.onComplete( function() {
				//if (who === username ) {
					//highlightExpressionGesture('emotion', e, false)
				//}
				//c.p[who].states.changingExpression = false
				//c.p[who].states.expression = "half_" + e
				//updateAvatarState(who, 'changingExpression', false)
				//updateAvatarState(who, 'expression', "half_" + e)
			//})
		}
	} else {
		console.log('cannot express while already expressing')
	}
}
window.expression = expression

export { expression }
