import { c } from '../../../setup/chat/settings.js'
import { organiseParticipantPositions, calculateParticipantsPosRot } from "../../../setup/chat/pos-rot.js"
import TWEEN from 'https://cdn.jsdelivr.net/npm/@tweenjs/tween.js@18.5.0/dist/tween.esm.js'
import { calculateLookAngles } from "../enter/avatar-pos-rot.js"
import { calculateCameraRot } from "../enter/camera-pos-rot.js"
import { randomSway, randomNeckTurn } from "../animations/sway.js"
import { avatarLookAt } from "../animations/look.js"
import { randomBlink } from "../animations/blink.js"
import { createExpressions } from "../animations/prepare-expressions.js"
import { loadIndividualGLTF } from "../models/avatar.js"
import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.125/build/three.module.js";
import { cameraSettings } from "../../../setup/chat/settings.js"
//import { displayWaitingList } from "../../../web-sockets/chat/events.js"

const addAvatar = u => {

	organiseParticipantPositions();
	calculateParticipantsPosRot(c.participantList.length);
	///need to add model first
	loadIndividualGLTF(u, false, function(u){
		createExpressions(u)
		moveCamera(u);
		moveAvatarsController(u);
	})
}
window.addAvatar = addAvatar

const moveCamera = u => {
	let newCameraZPos = {z: cameraSettings[c.participantList.length].radius + cameraSettings[c.participantList.length].cameraZPos}
	let moveCameraTween = new TWEEN.Tween(c.cameras.main.camera.position).to(newCameraZPos, 1000).easing(TWEEN.Easing.Quintic.Out)
	moveCameraTween.start()
	moveCameraTween.onComplete(function(object) {
		newAvatarEnter(u)
	})
}

const moveAvatarsController = u => {
	c.participantList.forEach(function(p) {
		if (p !== u) {
			moveAvatar(p)
		}
	})
}

const moveAvatar = n => {
	if (c.reversePositions[n] !== 0) {
		let newXZPos = {
			x: c.p[n].posRot.position.x,
			z: c.p[n].posRot.position.z
		}
		let newYRot = {
			y: c.p[n].posRot.rotation.y
		}
		let moveAvatarTween = new TWEEN.Tween(c.p[n].model.position).to(newXZPos, 1000)
		let rotateAvatarTween = new TWEEN.Tween(c.p[n].model.rotation).to(newYRot, 1000)
		moveAvatarTween.easing(TWEEN.Easing.Quintic.Out)
		rotateAvatarTween.easing(TWEEN.Easing.Quintic.Out)
		moveAvatarTween.start()
		rotateAvatarTween.start()
		moveAvatarTween.onComplete( function(object) {
			avatarLookAt(n, c.p[n].states.currentlyLookingAt, 500)
		})
	}
}

const newAvatarEnter = u => {
	c.p[u].model.position.set(c.p[u].posRot.position.x*10, 0, c.p[u].posRot.position.z*10);
	c.p[u].model.rotation.y = c.p[u].posRot.rotation.y;
	let newAvatarFinalPos = {
		x: c.p[u].posRot.position.x, 
		y: 0,
		z: c.p[u].posRot.position.z
	}
	let enterAvatarTween = new TWEEN.Tween(c.p[u].model.position).to(newAvatarFinalPos, 3000)
	enterAvatarTween.easing(TWEEN.Easing.Quintic.Out)
	enterAvatarTween.start()
	setTimeout(function(){
		c.p[u].model.visible = true
	}, 100)
	let focalPoint = c.cameras.main.camera.getWorldPosition(new THREE.Vector3)
	enterAvatarTween.onUpdate(function (object) {
		c.p[u].movableBodyParts.leftEye.lookAt(focalPoint)
		c.p[u].movableBodyParts.rightEye.lookAt(focalPoint)
	})
	enterAvatarTween.onComplete( function() {
		calculateCameraRot()
		calculateLookAngles(false)
		randomSway(u)
		randomNeckTurn(u)
		randomBlink(u)
		avatarLookAt(u, c.lookingAtEntry[u], 500)
		//if (username === host) {
      //chat.newParticipantEntering = false;
			//displayWaitingList()
			//if (c.participantList.length === 2) {
				//avatarLookAt(host, u, 5000)
			//}
		//}
	} )
}

const addAvatarWhileChoosingPosition(u) {
	c.p[u] = {}
	loadIndividualGLTF(u, false, function(u){
		createExpressions(u)
	})
}

export {moveAvatar, moveAvatarsController, addAvatar}
