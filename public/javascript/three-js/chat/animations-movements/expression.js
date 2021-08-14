import { easingDict } from "../animations-prepare/easings.js"
import { dealWithCSSExpressionGestureEvent } from "../animations-loaded/click-events.js"
import { expressionMorphs, jawNeeded } from "../animations-prepare/morph-targets.js"
import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.125/build/three.module.js";
import TWEEN from 'https://cdn.jsdelivr.net/npm/@tweenjs/tween.js@18.5.0/dist/tween.esm.js'

window.allExpression = allExpression
function allExpression(e) {
	c.participantList.forEach(function(p) {
		expression(p, e)
	})
}

window.expression = expression
export default function expression(who, e) {

	if (!c.p[who].states.changingExpression) {
		let faceMorphsTo = new Array(c.lenMorphs).fill(0);
		let faceMorphsHalf = new Array(c.lenMorphs).fill(0);
		let indexOfExpression = c.p[who].movableBodyParts.face.morphTargetDictionary[e]
		faceMorphsTo[indexOfExpression] = 1
		faceMorphsHalf[c.p[who].movableBodyParts.face.morphTargetDictionary["half_" + e]] = 1

		let expressionIn = new TWEEN.Tween(c.p[who].movableBodyParts.face.morphTargetInfluences).to(faceMorphsTo, 500)
			.easing(easingDict["cubicOut"])

		let expressionOut = new TWEEN.Tween(c.p[who].movableBodyParts.face.morphTargetInfluences).to(faceMorphsHalf, 1500)
			.easing(easingDict["cubicOut"])
			.delay(3000)
		
		expressionIn.chain(expressionOut)
		expressionIn.start()

		let splitExpressionName = e.split('_')
		//console.log('splitExpressionName:', splitExpressionName)
		let baseExpression = splitExpressionName[0]
		if (splitExpressionName[0] === 'half') {
			baseExpression = splitExpressionName[1]
		}
		expressionIn.onStart( function() {
			c.p[who].states.changingExpression = true
			c.p[who].states.expression = 'changing'
			if ( jawNeeded[splitExpressionName[0]] || jawNeeded[splitExpressionName[1]] ) {
				let indexOfMouthOpenInTeeth = c.p[who].movableBodyParts.teeth.morphTargetDictionary["mouthOpen"]
				// dunno why have to hard code the "0" below
				new TWEEN.Tween(c.p[who].movableBodyParts.teeth.morphTargetInfluences).to({"0": expressionMorphs[e].jawOpen*1.5}, 500)
				.easing(easingDict["cubicOut"])
				.start()
			}
		})
		expressionOut.onStart( function() {
			c.p[who].states.changingExpression = true
			c.p[who].states.expression = 'changing'

			if ( jawNeeded[baseExpression] ) {
				new TWEEN.Tween(c.p[who].movableBodyParts.teeth.morphTargetInfluences).to({"0": expressionMorphs['half_' + e].jawOpen}, 1500)
				.easing(easingDict["cubicOut"])
				.start()
			}
		})
		expressionIn.onComplete( function() {
			//c.p[who].states.changingExpression = false
			c.p[who].states.expression = e
		})
		expressionOut.onComplete( function() {
			if (who === 0 ) {
				dealWithCSSExpressionGestureEvent('emotion', e, false)
			}
			c.p[who].states.changingExpression = false
			c.p[who].states.expression = "half_" + e
		})
	} else {
		console.log('cannot express while already expressing')
	}
}

