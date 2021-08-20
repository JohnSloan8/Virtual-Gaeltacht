import { scene } from "../scene/scene.js"
import { displayWaitingList } from '../../../setup/chat/events.js'
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
import { loadIndividualGLTF } from "../models/avatar.js"
import { updateChatState } from '../../../setup/chat/updates.js'

const loadEnter = () => {
	scene.add(c.cameras.main.camera)
	scene.add(c.pGroup)
	//onWindowResize()
	if (c.firstEntry) {
    displayChoosePositionCircle([...c.participantList])
		c.participantList.push(username)
		stageReady();
	} else {	
		stageReady();
		enterSceneGetReady();
		animate();
	}
}

const enterSceneGetReady = () => {
	setupKeyBindings();
	setupAllClickEvents()
	beginRandomBlinking();
	beginRandomSwaying();
	c.participantList.forEach(function(n) {
		avatarLookAt(n, c.lookingAtEntry[n], 1)
	})
	displayWaitingList();
	displayControlPanel();
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
