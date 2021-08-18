import { scene } from "../scene/scene.js"
import { displayWaitingList, updateEntering } from '../../../setup/chat/events.js'
import { beginRandomBlinking } from "../animations-movements/blink.js"
import { beginRandomSwaying } from "../animations-movements/sway.js"
import { animate } from "../animate.js"
import { createClickEvents } from "./click-events.js"
import { createKeyBindings } from "./keyboard-events.js"
import { cameraEnter } from "./enter.js"
import { cameraSettings } from "../../../setup/chat/settings.js"
import { avatarLookAt } from "../animations-movements/look.js"
import { addSelfieCameraGroup } from "./selfie-camera-group.js"
import { c } from '../../../setup/chat/settings.js'
import { onWindowResize } from "../scene/scene.js";

const loadEnter = () => {
	createKeyBindings();
	createClickEvents();
	scene.add(c.pGroup)
	beginRandomBlinking();
	beginRandomSwaying();
	if (c.firstEntry) {
		c.participantList.forEach(function(n) {
			avatarLookAt(n, c.lookingAtEntry[n], 1)
		})
		if (c.participantList.length > 1) {
			avatarLookAt(username, c.positions[1], 1)
		}
		cameraEnter()
	} else {	
		$('#controlPanelOverlay').show()
		c.cameras.main.camera.position.set(0, c.cameras.main.camera.position.y, cameraSettings[c.participantList.length].radius + cameraSettings[c.participantList.length].cameraZPos);
		c.participantList.forEach(function(p) {
			avatarLookAt(p, c.lookingAtEntry[p], 10)
		})
		addSelfieCameraGroup();
		onWindowResize()
		displayWaitingList();
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
  $('#loadOverlay').hide()
	animate();
}

export { loadEnter }
