import { expression } from "../animations/expression.js"
import { gesture } from "../animations/gesture.js"
import { avatarNodShake } from "../animations/nod-shake.js"
import { socketSend } from "../../../web-sockets/chat/send.js"

const dealWithCSSExpressionGestureEvent = (emotionGesture, expression, start) => {
	console.log('emotionGesture:', emotionGesture)
	console.log('expression:', expression)
	console.log('start:', start)
	if (start) {
		$('#' + expression).parent().removeClass('bg-dark')	
		$('#' + expression).parent().addClass('bg-light')	
	} else {
		$('#' + expression).parent().removeClass('bg-light')	
		$('#' + expression).parent().addClass('bg-dark')	
	}
}

const createClickEvents = () => {
	$('.emotion-image').on('click', function(e){
		console.log('clicked:', e.target.id)
		let k
		let v
		if (e.target.id.slice(e.target.id.length-4) === "pose") {
			k = 'gesture'
			v = e.target.id
			gesture(username, v, 1000)
			dealWithCSSExpressionGestureEvent('gesture', v, true)
		} else if (e.target.id.slice(e.target.id.length-4) === "head") {
			k = 'nodShake'
			v = e.target.id.slice(0, e.target.id.length-5);
			avatarNodShake(username, v)
		} else {
			k = 'expression'
			v = e.target.id
			expression(username, v)
			dealWithCSSExpressionGestureEvent('emotion', v, true)
		}
		socketSend(k, v)
	})
}

export { createClickEvents, dealWithCSSExpressionGestureEvent }
