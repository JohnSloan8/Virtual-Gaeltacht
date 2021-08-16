import { scene } from "../scene/scene.js"
import { displayWaitingList } from '../../../setup/chat/events.js'
import { beginRandomBlinking } from "../animations-movements/blink.js"
import { beginRandomSwaying } from "../animations-movements/sway.js"
import { animate } from "../animate.js"
import { createClickEvents } from "./click-events.js"
import { createKeyBindings } from "./keyboard-events.js"
import { cameraSettings } from "../../../setup/chat/settings.js"
import { avatarLookAt } from "../animations-movements/look.js"
import { addSelfieCameraGroup } from "./selfie-camera-group.js"
import { c } from '../../../setup/chat/settings.js'

const loadEnter = () => {
	createKeyBindings();
	createClickEvents();
	scene.add(c.cameras.main.camera)
	scene.add(c.pGroup)
	c.participantList.forEach(function(p) {
		avatarLookAt(p, c.lookingAtEntry[p], 10)
	})
	beginRandomBlinking();
	beginRandomSwaying();

	if (c.firstEnter) {
		//setEntranceAnimationPlaying(true)
	} else {
		c.cameras.main.camera.position.set(0, c.cameras.main.camera.position.y, cameraSettings[c.participantList.length].radius + cameraSettings[c.participantList.length].cameraZPos);
		addSelfieCameraGroup();
		displayWaitingList();
	}
	//if ( entranceAnimationPlaying ) {
		//camera.position.set(posRot[c.participantList.length].cameraStart.position.x, posRot[c.participantList.length].cameraStart.position.y, posRot[c.participantList.length].camera.z+1);
		//addCameraMeGroup(false, true);
		//setTimeout(cameraEnter, 500);
	//} else {
		//$('#controlPanelOverlay').show()
		//onWindowResize();
		//camera.position.set(0, posRot[c.participantList.length].camera.y, posRot[c.participantList.length].camera.z);
		//// cameraMe
		////camera.lookAt(cameraSettings.neutralFocus)
	//}

	//if (host === username) {
		//$('#host').show()
		//displayWaitingList();
	//}
  $('#loadOverlay').hide()
	animate();
}

export { loadEnter }
