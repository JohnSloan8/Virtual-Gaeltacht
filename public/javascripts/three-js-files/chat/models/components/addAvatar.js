import calculatePosRot from "../../scene/components/pos-rot.js"
import { posRot } from "../../scene/components/pos-rot.js"
import { noParticipants, setNoParticipants } from "../../scene/settings.js"
import { participants, calculateLookAngles } from "./avatar.js"
import { camera } from "../../scene/components/camera.js"
import { cameraMe } from "../../scene/components/cameraMe.js"
import { cameraMeGroup, calculateCameraRotations } from "../../animations/init.js"
import { participant0ZOffset, cameraMeOffset/*, verticalMirrorOffset*/} from "../../animations/settings.js"
import resetAll from "../../animations/reset.js"
import returnAll from "../../animations/returnToBeforeReset.js"
import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.125/build/three.module.js";
import TWEEN from 'https://cdn.jsdelivr.net/npm/@tweenjs/tween.js@18.5.0/dist/tween.esm.js'

window.addAvatar = addAvatar
export default function addAvatar(u) {
	setNoParticipants(noParticipants+1);
	calculatePosRot(noParticipants);
	///need to add model first
	loadIndividualGLTF(u, noParticipants-1, false, function(){
		participants[noParticipants-1].states.focalPoint = new THREE.Vector3(0, 1.59, 0)
		moveCameraAndMirror();
		moveAvatarsController();
	})
}

function moveCameraAndMirror() {
	console.log('moveCameraAndMirror')
	let newCameraZPos = {z: posRot[noParticipants].camera.z}
	let moveCameraTween = new TWEEN.Tween(camera.position).to(newCameraZPos, 2200).easing(TWEEN.Easing.Quintic.Out)
	moveCameraTween.completedTimes = 0;
	moveCameraTween.start()
	cameraMeGroup.position.z = newCameraZPos.z
	moveCameraTween.onComplete(function(object) {
		moveCameraTween.completedTimes += 1
		console.log('completed moveCameraTween')
		if (moveCameraTween.completedTimes === 1) {
			resetAll(noParticipants);
			calculateCameraRotations();
			//setTimeout( function() {
				calculateLookAngles(false)
				//setTimeout( function() {
					returnAll(noParticipants);
				//}, 100)
			//}, 100)
		}
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

