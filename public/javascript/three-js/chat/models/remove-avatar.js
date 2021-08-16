import TWEEN from 'https://cdn.jsdelivr.net/npm/@tweenjs/tween.js@18.5.0/dist/tween.esm.js'
import { cameraMeGroup, calculateCameraRot } from "../../animations/init.js"
import calculatePosRot from  "../../scene/components/pos-rot.js"
import { posRot, c.participantList, names, reversePositions, findPositionOfReducedParticipants } from "../../scene/components/pos-rot.js"
import { setNoParticipants } from "../../scene/settings.js"
import { moveAvatarsController, moveAvatar } from "./addAvatar.js"
import { calculateLookAngles } from "./avatar.js"
import { updateAvatarState } from "./states.js"
import { displayWaitingList, removeParticipant } from "../../../../web-sockets/chat/socket-logic.js"

export default function removeAvatar(u) {
	chat.participantLeaving = true
	if (posRot[c.participantList.length-1] === undefined) {
		calculatePosRot(c.participantList.length-1);
	}
	avatarLeave(u)
	setNoParticipants(c.participantList.length-1);
	findPositionOfReducedParticipants(u)
}

function avatarLeave(u) {
	console.log('c.participantList:', c.participantList)
	let avatarLeaveFinalPos = {
		x: posRot[c.participantList.length][reversePositions[u]].x*10,
		y: 0, 
		z: posRot[c.participantList.length][reversePositions[u]].z*10
	}
	let avatarLeaveTween = new TWEEN.Tween(participants[u].model.position).to(avatarLeaveFinalPos, 1000)
	avatarLeaveTween.easing(TWEEN.Easing.Cubic.In)
	avatarLeaveTween.start()
	avatarLeaveTween.onComplete( function() {
		moveAvatarsController();
		moveCameraAndMirrorReduce(u);
	})
}
function moveCameraAndMirrorReduce(u) {
	console.log('in moveCameraAndMirrorReduce')
	let newCameraZPos = {z: posRot[c.participantList.length].camera.z}
	let moveCameraTween = new TWEEN.Tween(camera.position).to(newCameraZPos, 1000).easing(TWEEN.Easing.Quintic.Out)
	moveCameraTween.start()
	//cameraMeGroup.position.z = newCameraZPos.z
	moveCameraTween.onComplete(function(object) {
		group.remove(participants[u].model)
		delete participants[u]
		c.participantList.forEach(function(p) {
			if (!c.participantList.includes(participants[p].states.currentlyLookingAt)) {
				
				if (c.participantList.length > 1){
					if (p === c.positions[0]) {
						updateAvatarState(p, 'currentlyLookingAt', c.positions[1])
					} else {
						updateAvatarState(p, 'currentlyLookingAt', c.positions[0])
					}
				} else {
					updateAvatarState(p, 'currentlyLookingAt', c.positions[0])
				}
			}
		})
		calculateCameraRot()
		calculateLookAngles(false)
		c.participantList.forEach(function(p) {
			avatarLookAt(p, participants[p].states.currentlyLookingAt, 500)
		})
		if (username === host) {
			chat.participantLeaving = false;
			displayWaitingList()
		}
	})
}

