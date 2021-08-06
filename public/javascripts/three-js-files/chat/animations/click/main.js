import expression from "../morph/expression.js"
import gesture from "../move/gesture.js"
import avatarNodShake from "../shake.js"
import {sendGesture, sendNodShake, sendExpression} from "../../../socket-logic.js"

export default function createClickActions() {
	$('.emotion-image').on('click', function(e){
		console.log('clicked:', e.target.id)
		if (e.target.id.slice(e.target.id.length-4) === "pose") {
			gesture(username, e.target.id, 1000)
			sendGesture(username, e.target.id)
		} else if (e.target.id.slice(e.target.id.length-4) === "head") {
			let nodShake = e.target.id.slice(0, e.target.id.length-5);
			avatarNodShake(username, nodShake)
			sendNodShake(username, nodShake)
		} else {
			expression(username, e.target.id)
			sendExpression(username, e.target.id)
		}
	})
}
