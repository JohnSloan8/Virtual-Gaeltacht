import TWEEN from 'https://cdn.jsdelivr.net/npm/@tweenjs/tween.js@18.5.0/dist/tween.esm.js'
import { cameraMeGroup, calculateCameraRot } from "../../animations/init.js"
import calculatePosRot from  "../../scene/components/pos-rot.js"
import { posRot, participantNamesArray, names, reversePositions, findPositionOfReducedParticipants } from "../../scene/components/pos-rot.js"
import { setNoParticipants } from "../../scene/settings.js"
import { moveAvatarsController, moveAvatar } from "./addAvatar.js"
import { calculateLookAngles } from "./avatar.js"
import { displayWaitingList, removeParticipant } from "../../../socket-logic.js"

window.removeAvatar = removeAvatar
export default function removeAvatar(u) {
	chat.participantLeaving = true
	if (posRot[participantNamesArray.length-1] === undefined) {
		calculatePosRot(participantNamesArray.length-1);
	}
	avatarLeave(u)
	setNoParticipants(participantNamesArray.length-1);
	findPositionOfReducedParticipants(u)
}

function avatarLeave(u) {
	console.log('participantNamesArray:', participantNamesArray)
	let avatarLeaveFinalPos = {
		x: posRot[participantNamesArray.length][reversePositions[u]].x*10,
		y: 0, 
		z: posRot[participantNamesArray.length][reversePositions[u]].z*10
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
	let newCameraZPos = {z: posRot[participantNamesArray.length].camera.z}
	let moveCameraTween = new TWEEN.Tween(camera.position).to(newCameraZPos, 1000).easing(TWEEN.Easing.Quintic.Out)
	moveCameraTween.start()
	//cameraMeGroup.position.z = newCameraZPos.z
	moveCameraTween.onComplete(function(object) {
		group.remove(participants[u].model)
		delete participants[u]
		participantNamesArray.forEach(function(p) {
			if (!participantNamesArray.includes(participants[p].states.currentlyLookingAt)) {
				
				if (participantNamesArray.length > 1){
					if (p === participantNamesArray[0]) {
						participants[p].states.currentlyLookingAt = participantNamesArray[1]
					} else {
						participants[p].states.currentlyLookingAt = participantNamesArray[0]
					}
				} else {
					participants[p].states.currentlyLookingAt = participantNamesArray[0]
				}
			}
		})
		calculateCameraRot()
		calculateLookAngles(false)
		participantNamesArray.forEach(function(p) {
			avatarLookAt(p, participants[p].states.currentlyLookingAt, 500)
		})
		if (username === host) {
			chat.participantLeaving = false;
			displayWaitingList()
		}
	})
}

