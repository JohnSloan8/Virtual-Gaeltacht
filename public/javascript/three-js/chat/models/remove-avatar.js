import TWEEN from 'https://cdn.jsdelivr.net/npm/@tweenjs/tween.js@18.5.0/dist/tween.esm.js'
import { moveAvatarsController } from "./add-avatar.js"
import { updateAvatarState } from "../../../setup/chat/updates.js"
import { displayWaitingList } from "../../../setup/chat/events.js"
import { c } from "../../../setup/chat/init.js"
import { calculateParticipantsPositionsRotations, sortParticipantList } from '../calculations/avatar-positions.js'
import { calculateLookAngles } from "../calculations/avatar-look-rotations.js"
import { calculateCameraRotations } from "../calculations/camera-look-rotations.js"
import { cameraSettings } from '../enter/set-positions-rotations.js'

const removeAvatar = u => {
	updateChatState('participantLeaving', true)
	avatarLeave(u)
}

const avatarLeave = u => {
	let avatarLeaveFinalPos = {
		x: c.p[u].model.position.x*5,
		y: 0, 
		z: c.p[u].model.position.z*5
	}
	let avatarLeaveTween = new TWEEN.Tween(c.p[u].model.position).to(avatarLeaveFinalPos, 3000)
	avatarLeaveTween.easing(TWEEN.Easing.Cubic.In)
	avatarLeaveTween.start()
	avatarLeaveTween.onComplete( function() {
		sortParticipantList();
		calculateParticipantsPositionsRotations(c.participantList.length)
		moveAvatarsController(u);
		moveCameraReduce(u);
	})
}

const moveCameraReduce = u => {
	let newCameraZPos = {z: cameraSettings[c.participantList.length].radius + cameraSettings[c.participantList.length].cameraZPos}
	let moveCameraTween = new TWEEN.Tween(c.cameras.main.camera.position).to(newCameraZPos, 3000).easing(TWEEN.Easing.Quintic.Out)
	moveCameraTween.start()
	moveCameraTween.onComplete(function(object) {
		c.pGroup.remove(c.p[u].model)
		delete c.p[u]
		c.participantList.forEach(function(p) {
			if (!c.participantList.includes(c.p[p].states.currentlyLookingAt)) {
				
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
		calculateLookAngles();
		calculateCameraRotations();
		c.participantList.forEach(function(p) {
			avatarLookAt(p, c.p[p].states.currentlyLookingAt, 500)
		})
		updateChatState('participantLeaving', false)
		displayWaitingList()
	})
}

export { removeAvatar }
