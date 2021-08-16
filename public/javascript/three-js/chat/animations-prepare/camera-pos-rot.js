import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.125/build/three.module.js";
import { c } from "../../../setup/chat/settings.js"
import { cameraSettings } from "../../../setup/chat/settings.js"

const calculateCameraRot = () => {
	c.cameras.main.camera.position.set(0, c.cameras.main.camera.position.y, cameraSettings[c.participantList.length].radius + cameraSettings[c.participantList.length].cameraZPos);
	c.cameras.main.rotations = {}
	c.participantList.forEach(function(n) {
		let direction = new THREE.Vector3();
		let headPos = c.p[n].movableBodyParts.head.getWorldPosition(direction)
		c.cameras.main.camera.lookAt(headPos)
		c.cameras.main.rotations[n] = {
			x: c.cameras.main.camera.rotation.x * 0.075 - 0.075,
			y: c.cameras.main.camera.rotation.y * 0.15,
			z: 0
		}
	})
}

export { calculateCameraRot }
