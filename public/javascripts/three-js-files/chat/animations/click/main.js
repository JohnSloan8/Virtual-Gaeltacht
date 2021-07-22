import expression from "../morph/expression.js"
import gesture from "../move/gesture.js"
import { sendExpression, sendGesture } from '../../../socket-logic.js'

export default function createClickActions() {
	$('.emotion-image').on('click', function(e){
		console.log('clicked:', e.target.id)
		if (e.target.id.slice(e.target.id.length-4) === "pose") {
			gesture(0, e.target.id, 1000)
			sendGesture(0, e.target.id)
		} else {
			expression(0, e.target.id)
			sendExpression(0, e.target.id)
		}
	})
}
