import calculatePosRot from "../../scene/components/pos-rot.js"
import table from "../../scene/components/table.js"
import { posRot, participantNamesArray, names, findPositionOfNewParticipant, reversePositions } from "../../scene/components/pos-rot.js"
import { noParticipants, setNoParticipants, cameraSettings } from "../../scene/settings.js"
import { participants, calculateLookAngles } from "./avatar.js"
import { camera } from "../../scene/components/camera.js"
import { cameraMe } from "../../scene/components/cameraMe.js"
import { cameraMeGroup, calculateCameraRot } from "../../animations/init.js"
import { randomSway, randomNeckTurn } from "../../animations/random/sway.js"
import { randomBlink } from "../../animations/random/blink.js"
import { createExpressions } from "../../animations/morph/prepare.js"
import { participant0ZOffset, cameraMeOffset/*, verticalMirrorOffset*/} from "../../animations/settings.js"
import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.125/build/three.module.js";
import TWEEN from 'https://cdn.jsdelivr.net/npm/@tweenjs/tween.js@18.5.0/dist/tween.esm.js'
import { displayWaitingList } from "../../../socket-logic.js"

window.addAvatar = addAvatar
export default function addAvatar(u) {
	setNoParticipants(participantNamesArray.length+1);
	findPositionOfNewParticipant(u)
	calculatePosRot(participantNamesArray.length);
	///need to add model first
	loadIndividualGLTF(u, false, function(u){
		moveCameraAndMirror(u);
		moveAvatarsController();
		calculateCameraRot()
	})
}

const moveAvatarsController = () => {
	participantNamesArray.forEach(function(p) {
		moveAvatar(p)
	})
}

const moveAvatar = n => {
	let newXZPos = {
		x: posRot[participantNamesArray.length][reversePositions[n]].x,
		z: posRot[participantNamesArray.length][reversePositions[n]].z
	}
	let newYRot = {
		y: posRot[participantNamesArray.length][reversePositions[n]].neutralYrotation
	}
	let moveAvatarTween = new TWEEN.Tween(participants[n].model.position).to(newXZPos, 1000)
	let rotateAvatarTween = new TWEEN.Tween(participants[n].model.rotation).to(newYRot, 1000)
	moveAvatarTween.easing(TWEEN.Easing.Quintic.Out)
	rotateAvatarTween.easing(TWEEN.Easing.Quintic.Out)
	moveAvatarTween.start()
	rotateAvatarTween.start()
}

function moveCameraAndMirror(u) {
	let newCameraZPos = {z: posRot[participantNamesArray.length].camera.z}
	let moveCameraTween = new TWEEN.Tween(camera.position).to(newCameraZPos, 1000).easing(TWEEN.Easing.Quintic.Out)
	moveCameraTween.start()
	cameraMeGroup.position.z = newCameraZPos.z
	moveCameraTween.onComplete(function(object) {
		calculateLookAngles(false)
		createExpressions(u)
		avatarLookAt(u, names[0], 1)
		newAvatarEnter(u)
	})
}

function resizeTable() {
	let scaleChange = 1 + ((cameraSettings[participantNamesArray.length].radius - 0.15) - (cameraSettings[participantNamesArray.length-1].radius - 0.15)) / (cameraSettings[participantNamesArray.length-1].radius - 0.15)
	let scaleTableTween = new TWEEN.Tween(table.scale).to({x: scaleChange, y: scaleChange}, 1000).easing(TWEEN.Easing.Quintic.Out)
	scaleTableTween.start()
}

function newAvatarEnter(u) {
	participants[u].model.position.set(posRot[participantNamesArray.length][reversePositions[u]].x*10, 0, posRot[participantNamesArray.length][reversePositions[u]].z*10);
	let newAvatarFinalPos = {
		x: posRot[participantNamesArray.length][reversePositions[u]].x, 
		y: 0,
		z: posRot[participantNamesArray.length][reversePositions[u]].z
	}
	let enterAvatarTween = new TWEEN.Tween(participants[u].model.position).to(newAvatarFinalPos, 3000)
	enterAvatarTween.easing(TWEEN.Easing.Quintic.Out)
	enterAvatarTween.start()
	setTimeout(function(){
		participants[u].model.visible = true
	}, 100)
	let focalPoint = camera.getWorldPosition(new THREE.Vector3)
	enterAvatarTween.onUpdate(function (object) {
		participants[u].movableBodyParts.leftEye.lookAt(focalPoint)
		participants[u].movableBodyParts.rightEye.lookAt(focalPoint)
	})
	enterAvatarTween.onComplete( function() {
		randomSway(u)
		randomNeckTurn(u)
		randomBlink(u)
		if (username === host) {
    	chat.newParticipantEntering = false;
			displayWaitingList()
			if (participantNamesArray.length === 2) {
				avatarLookAt(host, u, 5000)
			}
		}
	} )
}

