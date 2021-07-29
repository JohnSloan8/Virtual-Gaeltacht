import calculatePosRot from "../../scene/components/pos-rot.js"
import { posRot } from "../../scene/components/pos-rot.js"
import { noParticipants, setNoParticipants } from "../../scene/settings.js"
import { participants, calculateLookAngles } from "./avatar.js"
import { camera } from "../../scene/components/camera.js"
import { cameraMe } from "../../scene/components/cameraMe.js"
import { cameraMeGroup } from "../../animations/init.js"
import { participant0ZOffset, cameraMeOffset/*, verticalMirrorOffset*/} from "../../animations/settings.js"
import TWEEN from 'https://cdn.jsdelivr.net/npm/@tweenjs/tween.js@18.5.0/dist/tween.esm.js'

window.addAvatar = addAvatar
export default function addAvatar(u) {
	setNoParticipants(noParticipants+1);
	calculatePosRot(noParticipants);
	///need to add model first
	loadIndividualGLTF(u, noParticipants-1, function(){
		moveCameraAndMirror();
		moveAvatarsController();
	})
	//calculateLookAngles();
}

const moveAvatarsController = () => {
	for (let i=1; i<noParticipants-1; i++) {
		moveAvatar(i)
	}
}

function moveCameraAndMirror() {
	let newCameraZPos = {z: posRot[noParticipants].camera.z}
	let moveCameraTween = new TWEEN.Tween(camera.position).to(newCameraZPos, 2200).easing(TWEEN.Easing.Quintic.Out)
	moveCameraTween.start()
	cameraMeGroup.position.z = newCameraZPos.z
	moveCameraTween.onComplete(function(object) {
		calculateLookAngles(false)
	})
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

