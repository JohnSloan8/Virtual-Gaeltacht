import expression from "../morph/expression.js"
import gesture from "../move/gesture.js"
import avatarNodShake from "../shake.js"
import { sendExpression, sendGesture } from '../../../socket-logic.js'

export default function createClickActions() {
	$('.emotion-image').on('click', function(e){
		console.log('clicked:', e.target.id)
		if (e.target.id.slice(e.target.id.length-4) === "pose") {
			gesture(0, e.target.id, 1000)
			sendGesture(0, e.target.id)
		} else if (e.target.id.slice(e.target.id.length-4) === "head") {
			let nodShake = e.target.id.slice(0, e.target.id.length-5);
			avatarNodShake(0, nodShake)
		} else {
			expression(0, e.target.id)
			sendExpression(0, e.target.id)
		}
	})
}
