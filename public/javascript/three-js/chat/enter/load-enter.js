import { scene } from "../scene/scene.js"
import { displayWaitingList, updateEntering } from '../../../setup/chat/events.js'
import { beginRandomBlinking } from "../animations/blink.js"
import { beginRandomSwaying } from "../animations/sway.js"
import { animate } from "../animate.js"
import { createClickEvents } from "./click-events.js"
import { createKeyBindings } from "./keyboard-events.js"
import { cameraSettings } from "../../../setup/chat/settings.js"
import { avatarLookAt } from "../animations/look.js"
import { addSelfieCameraGroup } from "./selfie-camera-group.js"
import { c } from '../../../setup/chat/settings.js'
import { displayChoosePositionCircle } from '../../../setup/chat/choose-position-circle.js'
import { onWindowResize } from "../scene/scene.js";
import { setPosRotOfAvatars, calculateLookAngles } from "./avatar-pos-rot.js"
import { calculateCameraRot } from "./camera-pos-rot.js"

const loadEnter = () => {
	if (c.firstEntry) {
    displayChoosePositionCircle([...c.participantList])
	} else {	
		$('#controlPanelOverlay').show()
		c.cameras.main.camera.position.set(0, c.cameras.main.camera.position.y, cameraSettings[c.participantList.length].radius + cameraSettings[c.participantList.length].cameraZPos);
		enterSceneNormal();
	}
		//updateEntering(true, username)

	//console.log('in load Enter')
	//if (c.firstEntry) {
		//setTimeout(cameraEnter, 500);
	//} else {
		//c.cameras.main.camera.position.set(0, c.cameras.main.camera.position.y, cameraSettings[c.participantList.length].radius + cameraSettings[c.participantList.length].cameraZPos);
		//scene.add(c.cameras.main.camera)
		//$('#controlPanelOverlay').show()
		//onWindowResize();
	//}
}

const enterSceneNormal = () => {
	scene.add(c.pGroup)
	setPosRotOfAvatars();
	calculateLookAngles(true);
	calculateCameraRot();
	createKeyBindings();
	createClickEvents();
	addSelfieCameraGroup();
	onWindowResize()
	beginRandomBlinking();
	beginRandomSwaying();
	c.participantList.forEach(function(n) {
		avatarLookAt(n, c.lookingAtEntry[n], 1)
	})
	displayWaitingList();
	animate();
  $('#loadOverlay').hide()
}

export { loadEnter, enterSceneNormal }
