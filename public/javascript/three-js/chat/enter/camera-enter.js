import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.125/build/three.module.js";
import TWEEN from 'https://cdn.jsdelivr.net/npm/@tweenjs/tween.js@18.5.0/dist/tween.esm.js'
import { c } from '../../../setup/chat/init.js'
import { cameraSettings } from './set-positions-rotations.js'
import { onWindowResize, scene } from "../scene/scene.js";
import { easingDict } from "../animations/easings.js"
import { createExpressions } from "../animations/prepare-expressions.js"
import { updateChatState } from '../../../setup/chat/updates.js'
import { avatarLookAt } from "../animations/avatar-look.js"
import { addSelfieCameraGroup } from "./selfie-camera-group.js"
import { animate } from "../animate.js"
import { enterSceneGetReady } from "./load-enter.js"
import { stageReady, setPositionOfMainCamera } from "./set-positions-rotations.js"


let centralPivotGroup
const cameraEnter = (amount=0.7, duration=3000, easing="cubicIn") => {
	stageReady(); //need this twice as new positions come from server 
	animate();
	updateChatState('meEntering', true)
  $('#choosePositionOverlay').hide()
  $('#loadOverlay').hide()
	let direction = new THREE.Vector3();
	let headPos = c.p[username].movableBodyParts.head.getWorldPosition(direction)

	// MAIN CAMERA ENTER POSITION
	c.cameras.main.camera.position.set(0, headPos.y+0.5, cameraSettings[c.participantList.length].radius + cameraSettings[c.participantList.length].cameraZPos + 1 );
	c.cameras.main.camera.lookAt(0, headPos.y, 0);
	centralPivotGroup = new THREE.Group()
	centralPivotGroup.add(c.cameras.main.camera)
	scene.add(centralPivotGroup)
	
	c.p[username].model.position.set(0, 0, c.cameras.main.camera.position.z-0.5 );
	c.p[username].model.rotation.y = Math.PI
	scene.add(c.p[username].model)
	
	let cameraEnterRotateTween = new TWEEN.Tween(centralPivotGroup.rotation).to({y: -Math.PI}, duration)
	.easing(easingDict["cubicInOut"])
	let cameraEnterRotateTween2 = new TWEEN.Tween(centralPivotGroup.rotation).to({y: -2*Math.PI}, duration)
	.easing(easingDict["cubicInOut"])
	//.delay(500)
	cameraEnterRotateTween.chain(cameraEnterRotateTween2)
	cameraEnterRotateTween.start()

	let cameraEnterPositionTween = new TWEEN.Tween(c.cameras.main.camera.position).to({y: headPos.y+0.1, z: cameraSettings[c.participantList.length].radius }, duration)
	.easing(easingDict["quinticIn"])

	let meEnterTween = new TWEEN.Tween(c.p[username].model.position).to({z: cameraSettings[c.participantList.length].radius}, duration*0.9)
	.easing(easingDict["cubicIn"])
	
	cameraEnterRotateTween2.onStart(function() {
		cameraEnterPositionTween.start()
		meEnterTween.start()
	})
	//fadeIn of black and then dashboard appearing
	setTimeout( function() {
		$('#blackOverlay').fadeIn(100, function(){
			$('#blackOverlay').fadeOut(3000)
		})
	}, duration*1.967 )

	cameraEnterPositionTween.onComplete( function(){
		centralPivotGroup.remove(c.cameras.main.camera)
		scene.add(c.cameras.main.camera)
		setPositionOfMainCamera();
		enterSceneGetReady()
		updateChatState('meHavePosition', true)
		updateChatState('meEntering', false)
  	updateChatState('participantEntering', false)
	})

}

export { cameraEnter }
