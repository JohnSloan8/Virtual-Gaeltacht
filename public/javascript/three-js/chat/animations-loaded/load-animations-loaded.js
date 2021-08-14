import { scene } from "../scene/components/scene.js"
import { randomBlinking, randomSwaying } from "../settings.js"

const loadAnimationsLoaded = () => {
	scene.add( c.cameraGroup );


	if (firstEnter === "true") {
		setEntranceAnimationPlaying(true)
	}
	createKeyBindings();
	createClickActions();
	if ( entranceAnimationPlaying ) {
		camera.position.set(posRot[c.participantList.length].cameraStart.position.x, posRot[c.participantList.length].cameraStart.position.y, posRot[c.participantList.length].camera.z+1);
		addCameraMeGroup(false, true);
		setTimeout(cameraEnter, 500);
	} else {
		$('#controlPanelOverlay').show()
		onWindowResize();
		camera.position.set(0, posRot[c.participantList.length].camera.y, posRot[c.participantList.length].camera.z);
		// cameraMe
		//camera.lookAt(cameraSettings.neutralFocus)
	}

	calculateCameraRot();
	c.participantList.forEach(function(p) {
		avatarLookAt(p, participants[p].states.currentlyLookingAt, 1)
	})
	if ( randomBlinking ) {
		beginRandomBlinking();
	}
	if ( randomSwaying ) {
		beginRandomSwaying();
	}
	if (host === username) {
		$('#host').show()
		displayWaitingList();
	}
}

export { loadAnimationsLoaded }
