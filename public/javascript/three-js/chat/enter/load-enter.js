import { scene } from "../scene/scene.js"
import { displayWaitingList, displayLeaveButton } from '../../../setup/chat/events.js'
import { beginRandomBlinking } from "../animations/blink.js"
import { beginRandomSwaying } from "../animations/sway.js"
import { animate } from "../animate.js"
import { setupAllClickEvents } from "../../../setup/chat/click-events.js"
import { setupKeyBindings } from "../../../setup/chat/keyboard-events.js"
import { cameraSettings } from "./set-positions-rotations.js"
import { avatarLookAt } from "../animations/avatar-look.js"
import { addSelfieCameraGroup } from "./selfie-camera-group.js"
import { c } from '../../../setup/chat/init.js'
import { displayChoosePositionCircle } from '../../../setup/chat/choose-position-circle.js'
import { onWindowResize } from "../scene/scene.js";
import { stageReady } from "./set-positions-rotations.js"
import { cameraEnter } from "./camera-enter.js"
import { loadIndividualGLTF } from "../models/avatar.js"
import { updateChatState } from '../../../setup/chat/updates.js'
import { initPeer } from '../../../peer-js/init.js'

const loadEnter = () => {
	scene.add(c.cameras.main.camera)
	scene.add(c.pGroup)
	//onWindowResize()
	if (!c.participantList.includes(username) && c.participantList.length !== 0) {
    displayChoosePositionCircle([...c.participantList])
		c.participantList.push(username)
		stageReady();
	} else {	
		if (c.participantList.length === 1) {
			cameraEnter()
		} else {
			stageReady();
			enterSceneGetReady();
			animate();
		}
	}
}

const enterSceneGetReady = () => {
	initPeer();
	setupKeyBindings();
	setupAllClickEvents()
	beginRandomBlinking();
	beginRandomSwaying();
	c.participantList.forEach(function(n) {
		avatarLookAt(n, c.lookingAtEntry[n][0], 1, c.lookingAtEntry[n][1])
		expression(n, c.p[n].states.expression, 1)
	})
	displayWaitingList();
	displayControlPanel();
	displayLeaveButton(true);
	$("#inviteButtonContainer").show();
	c.meEntered = true
}



const displayControlPanel = () => {
	$('#controlPanelOverlay').show()
	addSelfieCameraGroup();
	onWindowResize()
  $('#loadOverlay').hide()
}



	//console.log('in load Enter')
	//if (c.firstEntry) {
		//setTimeout(cameraEnter, 500);
	//} else {
		//c.cameras.main.camera.position.set(0, c.cameras.main.camera.position.y, cameraSettings[c.participantList.length].radius + cameraSettings[c.participantList.length].cameraZPos);
		//scene.add(c.cameras.main.camera)
		//$('#controlPanelOverlay').show()
		//onWindowResize();
	//}

export { loadEnter, enterSceneGetReady }
