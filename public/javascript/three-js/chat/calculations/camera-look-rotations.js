import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.125/build/three.module.js";
import { c } from "../../../setup/chat/init.js"
import { cameraSettings } from "../enter/set-positions-rotations.js"

const calculateCameraRotations = () => {
	let angleCam = new THREE.PerspectiveCamera(
		40,
		window.innerWidth / window.innerHeight,
		0.01,
		100
	);

	angleCam.position.set(0, c.cameras.main.camera.position.y, cameraSettings[c.participantList.length].radius + cameraSettings[c.participantList.length].cameraZPos);
	c.cameras.main.rotations = {}
	c.participantList.forEach(function(n) {
		if (n !== username) {
			let direction = new THREE.Vector3();
			let headPos = c.p[n].movableBodyParts.head.getWorldPosition(direction)
			angleCam.lookAt(headPos)
			c.cameras.main.rotations[n] = {
				x: angleCam.rotation.x * 0.075 - 0.125,
				y: angleCam.rotation.y * 0.15,
				z: 0
			}
		}
	})
}

export { calculateCameraRotations }
