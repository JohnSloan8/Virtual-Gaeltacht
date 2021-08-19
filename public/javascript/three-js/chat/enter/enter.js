import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.125/build/three.module.js";
import TWEEN from 'https://cdn.jsdelivr.net/npm/@tweenjs/tween.js@18.5.0/dist/tween.esm.js'
import { c, cameraSettings } from '../../../setup/chat/settings.js'
import { onWindowResize, scene } from "../scene/scene.js";
import { easingDict } from "../animations/easings.js"
import { createExpressions } from "../animations/prepare-expressions.js"
import { updateEntering } from '../../../setup/chat/events.js'
import { avatarLookAt } from "../animations/look.js"
import { addSelfieCameraGroup } from "./selfie-camera-group.js"
import { setupAllEvents } from '../../../setup/chat/events.js'
import { organiseParticipantPositions, calculateParticipantsPosRot } from '../../../setup/chat/pos-rot.js'
import { loadIndividualGLTF } from "../models/avatar.js"
import { animate } from "../animate.js"
import { enterSceneNormal } from "./load-enter.js"

const newAvatarEnter = (u) => {
	loadIndividualGLTF(u, true, function(u){
		createExpressions(u)
		cameraEnter(u)
		enterSceneNormal()
	})
}

let centralPivotGroup
const cameraEnter = (amount=0.7, duration=3000, easing="cubicIn") => {
  setupAllEvents();
  organiseParticipantPositions(c.participantList.length);
  calculateParticipantsPosRot(c.participantList.length);
	let direction = new THREE.Vector3();
	let headPos = c.p[username].movableBodyParts.head.getWorldPosition(direction)

	c.cameras.main.camera.position.set(0, headPos.y+0.4, c.p[username].posRot.position.z + 2 );
	c.cameras.main.camera.lookAt(0, 1.6, 0);
	centralPivotGroup = new THREE.Group()
	centralPivotGroup.add(c.cameras.main.camera)
	scene.add(centralPivotGroup)

	c.p[username].model.position.set(0, 0, c.p[username].posRot.position.z + 3 );
	scene.add(c.p[username].model)
	
	let cameraEnterRotateTween = new TWEEN.Tween(centralPivotGroup.rotation).to({y: -Math.PI}, duration)
	.easing(easingDict["cubicInOut"])
	let cameraEnterRotateTween2 = new TWEEN.Tween(centralPivotGroup.rotation).to({y: -2*Math.PI}, duration)
	.easing(easingDict["cubicInOut"])
	.delay(500)
	cameraEnterRotateTween.chain(cameraEnterRotateTween2)
	cameraEnterRotateTween.start()

	let cameraEnterPositionTween = new TWEEN.Tween(c.cameras.main.camera.position).to({z: c.p[username].posRot.position.z-0.25, y: headPos.y+0.05}, duration)
	.easing(easingDict["quinticIn"])

	let meEnterTween = new TWEEN.Tween(c.p[username].model.position).to({z: c.p[username].posRot.position.z-0.25}, duration*1.75)
	.easing(easingDict["cubicIn"])
	.start()
	
	cameraEnterRotateTween2.onStart(function() {
		cameraEnterPositionTween.start()
	})
	//fadeIn of black and then dashboard appearing
	setTimeout( function(){
		$('#blackOverlay').fadeIn(100, displayControlPanel)
		updateEntering(false);
	}, duration*1.975+500)

}

const displayControlPanel = () => {
	$('#controlPanelOverlay').show()
	scene.remove(centralPivotGroup)
	scene.add(c.cameras.main.camera)
	c.cameras.main.camera.position.set(0, c.cameras.main.camera.position.y, cameraSettings[c.participantList.length].radius + cameraSettings[c.participantList.length].cameraZPos);
	addSelfieCameraGroup();
	onWindowResize()
	$('#blackOverlay').fadeOut(3000)
}

export { newAvatarEnter }
