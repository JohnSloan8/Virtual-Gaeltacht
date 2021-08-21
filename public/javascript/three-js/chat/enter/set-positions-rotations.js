import { c } from '../../../setup/chat/init.js'
import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.125/build/three.module.js";
import { sortParticipantList, calculateParticipantsPositionsRotations } from '../calculations/avatar-positions.js'
import { calculateLookAngles } from "../calculations/avatar-look-rotations.js"
import { calculateCameraRotations } from "../calculations/camera-look-rotations.js"

const stageReady = () => {
	sortParticipantList();
	setPositionOfMainCamera();
	calculateParticipantsPositionsRotations(c.participantList.length)
	setPositionsRotationsOfAvatars();
	calculateLookAngles();
	calculateCameraRotations();
}

const setPositionsRotationsOfAvatars = () => {
	c.participantList.forEach(function(n) {
		if (n !== username) {
			console.log('n:', n)
			c.p[n].model.rotation.set(0, c.p[n].posRot.rotation.y, 0);
			c.p[n].model.position.set(c.p[n].posRot.position.x, 0, c.p[n].posRot.position.z);
		}
	})
}

const setPositionOfMainCamera = () => {
	let direction = new THREE.Vector3();
	let headPos = c.p[username].movableBodyParts.head.getWorldPosition(direction)
	console.log('headPos.y', headPos.y)
	let zPos = cameraSettings[c.participantList.length].cameraZPos+cameraSettings[c.participantList.length].radius
	console.log('zPos', zPos)
	c.cameras.main.camera.position.set(0, headPos.y+0.1, zPos)
	c.cameras.main.camera.fov = cameraSettings[c.participantList.length].cameraFov
}

const cameraSettings = {
	neutralFocus: (0, 1.59, 0),
	1: {
		radius: 0.5,
		cameraZPos: 0.2,
		cameraFov: 40,
		angle: 0,
	},
	2: {
		radius: 0.5,
		cameraZPos: 0.2,
		cameraFov: 40,
		angle: 0,
	},
	3: {
		radius: 0.5,
		cameraZPos: 0.3,
		cameraFov: 40,
		angle: 2*Math.PI/3,
	},
	4: {
		radius: 0.65,
		cameraZPos: 0.4,
		cameraFov: 40,
		angle: 2*Math.PI/5,
	},
	5: {
		radius: 0.75,
		cameraZPos: 0.5,
		cameraFov: 40,
		angle: Math.PI/3,
	},
	6: {
		radius: 0.8,
		cameraZPos: 0.6,
		cameraFov: 40,
		angle: 2 * Math.PI/7,
	},
	7: {
		radius: 0.9,
		cameraZPos: 0.65,
		cameraFov: 40,
		angle: Math.PI/4,
	},
	8: {
		radius: 1,
		cameraZPos: 0.7,
		cameraFov: 40,
		angle: 2 *Math.PI/9,
	},
	9: {
		radius: 1.05,
		cameraZPos: 0.95,
		cameraFov: 40,
		angle: Math.PI/5,
	},
	10: {
		radius: 1.1,
		cameraZPos: 1,
		cameraFov: 40,
		angle: 3*Math.PI/17,
	}
}

export { cameraSettings, stageReady, setPositionOfMainCamera }
