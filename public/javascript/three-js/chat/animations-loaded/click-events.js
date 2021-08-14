import expression from "../animations-movements/expression.js"
import gesture from "../animations-movements/gesture.js"
import avatarNodShake from "../animations-movements/nod-shake.js"
import { socketSend } from "../../../../web-sockets/chat/send.js"

const createClickEvents = () => {
	$('.emotion-image').on('click', function(e){
		console.log('clicked:', e.target.id)
		let k
		let v
		if (e.target.id.slice(e.target.id.length-4) === "pose") {
			k = 'gesture'
			v = e.target.id
			gesture(username, v, 1000)
			dealWithCSSExpressionGestureEvent('gesture', e, true)
		} else if (e.target.id.slice(e.target.id.length-4) === "head") {
			k = 'nodShake'
			v = e.target.id.slice(0, e.target.id.length-5);
			avatarNodShake(username, v)
		} else {
			k = 'expression'
			v = e.target.id
			expression(username, v)
			dealWithCSSExpressionGestureEvent('emotion', e, true)
		}
		socketSend(k, v)
	})
}

const dealWithCSSExpressionGestureEvent = (emotionGesture, expression, start) => {
	if (start) {
		$('#' + expression).parent().removeClass('bg-dark')	
		$('#' + expression).parent().addClass('bg-light')	
	} else {
		$('#' + expression).parent().removeClass('bg-light')	
		$('#' + expression).parent().addClass('bg-dark')	
	}
}

export { createClickEvents, dealWithCSSExpressionGestureEvent }
