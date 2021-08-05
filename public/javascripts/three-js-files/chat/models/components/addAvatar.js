import calculatePosRot from "../../scene/components/pos-rot.js"
import table from "../../scene/components/table.js"
import { posRot, participantNamesArray } from "../../scene/components/pos-rot.js"
import { noParticipants, setNoParticipants, cameraSettings } from "../../scene/settings.js"
import { participants, calculateLookAngles } from "./avatar.js"
import { camera } from "../../scene/components/camera.js"
import { cameraMe } from "../../scene/components/cameraMe.js"
import { cameraMeGroup, calculateCameraRot } from "../../animations/init.js"
import { randomSway, randomNeckTurn } from "../../animations/random/sway.js"
import { randomBlink } from "../../animations/random/blink.js"
import { participant0ZOffset, cameraMeOffset/*, verticalMirrorOffset*/} from "../../animations/settings.js"
import TWEEN from 'https://cdn.jsdelivr.net/npm/@tweenjs/tween.js@18.5.0/dist/tween.esm.js'

window.addAvatar = addAvatar
export default function addAvatar(u) {
	setNoParticipants(noParticipants+1);
	calculatePosRot(noParticipants);
	///need to add model first
	loadIndividualGLTF(u, noParticipants-1, false, function(){
		moveCameraAndMirror();
		moveAvatarsController();
		calculateCameraRot()
		//resizeTable();
	})
}

const moveAvatarsController = () => {
	for (let i=1; i<noParticipants-1; i++) {
		moveAvatar(i)
	}
}

const moveAvatar = n => {
	let newXZPos = {
		x: posRot[noParticipants][n].x,
		z: posRot[noParticipants][n].z
	}
	let newYRot = {
		y: posRot[noParticipants][n].neutralYrotation
	}
	let moveAvatarTween = new TWEEN.Tween(participants[n].model.position).to(newXZPos, 1000)
	let rotateAvatarTween = new TWEEN.Tween(participants[n].model.rotation).to(newYRot, 1000)
	moveAvatarTween.easing(TWEEN.Easing.Quintic.Out)
	rotateAvatarTween.easing(TWEEN.Easing.Quintic.Out)
	moveAvatarTween.start()
	rotateAvatarTween.start()
}

function moveCameraAndMirror() {
	let newCameraZPos = {z: posRot[noParticipants].camera.z}
	let moveCameraTween = new TWEEN.Tween(camera.position).to(newCameraZPos, 1000).easing(TWEEN.Easing.Quintic.Out)
	moveCameraTween.start()
	cameraMeGroup.position.z = newCameraZPos.z
	moveCameraTween.onComplete(function(object) {
		calculateLookAngles(false)
		avatarLookAt(noParticipants-1, participantNamesArray.indexOf(host), 1)
		newAvatarEnter()
	})
}

function resizeTable() {
	let scaleChange = 1 + ((cameraSettings[noParticipants].radius - 0.15) - (cameraSettings[noParticipants-1].radius - 0.15)) / (cameraSettings[noParticipants-1].radius - 0.15)
	let scaleTableTween = new TWEEN.Tween(table.scale).to({x: scaleChange, y: scaleChange}, 1000).easing(TWEEN.Easing.Quintic.Out)
	scaleTableTween.start()
}

function newAvatarEnter() {
	participants[noParticipants-1].model.position.set(posRot[noParticipants][noParticipants-1].x*10, 0, posRot[noParticipants][noParticipants-1].z*10);
	participants[noParticipants-1].model.visible = true
	let newAvatarFinalPos = {
		x: posRot[noParticipants][noParticipants-1].x, 
		y: 0,
		z: posRot[noParticipants][noParticipants-1].z
	}
	let enterAvatarTween = new TWEEN.Tween(participants[noParticipants-1].model.position).to(newAvatarFinalPos, 3000)
	enterAvatarTween.easing(TWEEN.Easing.Quintic.Out)
	enterAvatarTween.start()
	enterAvatarTween.onComplete( function() {
		randomSway(noParticipants-1)
		randomNeckTurn(noParticipants-1)
		randomBlink(noParticipants-1)
	} )
}


