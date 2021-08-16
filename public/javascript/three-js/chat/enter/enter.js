import { c.participantList, posRot } from "../../scene/components/pos-rot.js"
import { camera, centralPivotGroup } from "../../scene/components/camera.js";
import { onWindowResize } from "../../scene/components/scene.js";
import { cameraSettings } from "../../scene/settings.js"
import easingDict from "../easings.js"
import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.125/build/three.module.js";
import TWEEN from 'https://cdn.jsdelivr.net/npm/@tweenjs/tween.js@18.5.0/dist/tween.esm.js'
import { setEntranceAnimationPlaying } from "../../scene/settings.js"
import { verticalMirror } from "../init.js"
import { sendNewParticipantEnter } from "../../../../web-sockets/chat/socket-logic.js"

window.cameraEnter = cameraEnter
export default function cameraEnter(amount=0.7, duration=3000, easing="cubicIn") {
	sendNewParticipantEnter(username)
	let direction = new THREE.Vector3();
	let headPos = participants[username].movableBodyParts.head.getWorldPosition(direction)
	let cameraEnterRotateTween = new TWEEN.Tween(centralPivotGroup.rotation).to({y: -Math.PI}, duration)
	.easing(easingDict["cubicInOut"])
	let cameraEnterRotateTween2 = new TWEEN.Tween(centralPivotGroup.rotation).to({y: -2*Math.PI}, duration)
	.easing(easingDict["cubicInOut"])
	.delay(500)
	cameraEnterRotateTween.chain(cameraEnterRotateTween2)
	cameraEnterRotateTween.start()

	let cameraEnterPositionTween = new TWEEN.Tween(camera.position).to({z: posRot[c.participantList.length][0].z, y: posRot[c.participantList.length].camera.y+0.05 }, duration)
	.easing(easingDict["quinticIn"])

	let cameraMeGroupEnterTween = new TWEEN.Tween(cameraMeGroup.position).to({z: posRot[c.participantList.length][0].z - 0.5 }, duration*2)
	.easing(easingDict["cubicInOut"])
	.start()
	
	cameraEnterRotateTween2.onStart(function() {
		cameraEnterPositionTween.start()
	})
	//fadeIn of black and then dashboard appearing
	setTimeout( function(){
		$('#blackOverlay').fadeIn(100, displayControlPanel)
	}, duration*1.975+500)

}

function displayControlPanel() {
	setEntranceAnimationPlaying(false)
	$('#controlPanelOverlay').show()
	camera.position.set(0, posRot[c.participantList.length].camera.y, posRot[c.participantList.length].camera.z);
	cameraMeGroup.position.z = camera.position.z
	verticalMirror.visible = true
	onWindowResize()
	c.participantList.forEach(function(p) {
		avatarLookAt(p, participants[p].states.currentlyLookingAt, 1)
	})
	$('#blackOverlay').fadeOut(3000)
}
