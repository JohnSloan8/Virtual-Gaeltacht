import { c } from '../../../setup/chat/init.js'
import { sortParticipantList, calculateParticipantsPositionsRotations } from "../calculations/avatar-positions.js"
import TWEEN from 'https://cdn.jsdelivr.net/npm/@tweenjs/tween.js@18.5.0/dist/tween.esm.js'
import { calculateLookAngles } from "../calculations/avatar-look-rotations.js"
import { calculateCameraRotations } from "../calculations/camera-look-rotations.js"
import { randomSway, randomNeckTurn } from "../animations/sway.js"
import { avatarLookAt } from "../animations/avatar-look.js"
import { randomBlink } from "../animations/blink.js"
import { createExpressions } from "../animations/prepare-expressions.js"
import { loadIndividualGLTF } from "../models/avatar.js"
import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.125/build/three.module.js";
import { cameraSettings } from "../enter/set-positions-rotations.js"
import { initialAvatarStates } from "./states.js"
import { updateChatState } from '../../../setup/chat/updates.js'
//import { displayWaitingList } from "../../../web-sockets/chat/events.js"

const addAvatar = u => {
  updateChatState('newParticipantEntering', true)
	let avatarVisibility = false
	if (!c.meHavePosition) {
		avatarVisibility = true
		setTimeout(function(){
			updateChatState('newParticipantEntering', false)
		}, 6000)
	}
	c.p[u] = {
		states: {...initialAvatarStates}
	}
	sortParticipantList();
	calculateParticipantsPositionsRotations(c.participantList.length);

	///need to add model first
	loadIndividualGLTF(u, avatarVisibility, function(u){
		createExpressions(u)
		if (c.meHavePosition) {
			moveAvatarsController(u);
			moveCamera(u);
		}
	})
}
window.addAvatar = addAvatar

const moveCamera = u => {
	let newCameraZPos = {z: cameraSettings[c.participantList.length].radius + cameraSettings[c.participantList.length].cameraZPos}
	let moveCameraTween = new TWEEN.Tween(c.cameras.main.camera.position).to(newCameraZPos, 3000).easing(TWEEN.Easing.Quintic.Out)
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
	if (n !== username) {
		let newXZPos = {
			x: c.p[n].posRot.position.x,
			z: c.p[n].posRot.position.z
		}
		let newYRot = {
			y: c.p[n].posRot.rotation.y
		}
		let moveAvatarTween = new TWEEN.Tween(c.p[n].model.position).to(newXZPos, 3000)
		let rotateAvatarTween = new TWEEN.Tween(c.p[n].model.rotation).to(newYRot, 3000)
		moveAvatarTween.easing(TWEEN.Easing.Quintic.Out)
		rotateAvatarTween.easing(TWEEN.Easing.Quintic.Out)
		moveAvatarTween.start()
		rotateAvatarTween.start()
		//moveAvatarTween.onComplete( function(object) {
			//avatarLookAt(n, c.p[n].states.currentlyLookingAt, 500)
		//})	
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
	let direction = new THREE.Vector3();
	let focalPoint = c.p[c.lookingAtEntry[u]].movableBodyParts.head.getWorldPosition(direction)
	enterAvatarTween.onComplete( function() {
		calculateCameraRotations()
		calculateLookAngles(false)
		randomSway(u)
		randomNeckTurn(u)
		randomBlink(u)
		
		c.participantList.forEach(function(n) {
			if (n !== u) {
				avatarLookAt(n, c.p[n].states.currentlyLookingAt, 1000)
			} else {
				avatarLookAt(n, c.lookingAtEntry[u], 1000)
			}
		})	
  	updateChatState('newParticipantEntering', false)
	} )
}

export { addAvatar, moveAvatarsController }
