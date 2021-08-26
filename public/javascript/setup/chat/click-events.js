import { expression } from "../../three-js/chat/animations/expression.js"
import { gesture } from "../../three-js/chat/animations/gesture.js"
import { avatarNodShake } from "../../three-js/chat/animations/nod-shake.js"
import { socketSend } from "../../web-sockets/chat/send.js"

const setupAllClickEvents = () => {
	setupGestureClickEvents();
	setupAdmitRefuseEvents();
	setUpLeaveEvent();
}

const setupGestureClickEvents = () => {
	$('.emotion-image').on('click', function(e){
		//console.log('clicked:', e.target.id)
		let k
		let v
		if (e.target.id.slice(e.target.id.length-4) === "pose") {
			k = 'gesture'
			v = e.target.id
			gesture(username, v, 1000)
		} else if (e.target.id.slice(e.target.id.length-4) === "head") {
			k = 'nodShake'
			v = e.target.id.slice(0, e.target.id.length-5);
			avatarNodShake(username, v)
		} else {
			k = 'expression'
			v = e.target.id
			expression(username, v)
		}
		socketSend(k, v)
	})
}

const setupAdmitRefuseEvents = () => {
  $('.admit-refuse').on('click', function(e) {
    e.preventDefault();
    socketSend('admitRefuse', e.target.id);
  })
}

const setUpLeaveEvent = () => {
  $('#leaveButton').on('click', function(e) {
    e.preventDefault()
		socketSend('removeParticipant', true)
  })
}

export { setupAllClickEvents }
