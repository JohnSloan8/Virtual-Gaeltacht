import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.125/build/three.module.js";
import { c } from "../../../setup/chat/settings.js"

const calculateCameraRot = () => {
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

//const cameraLookAt = () => {

	//let r = c.cameras.main.rotations[c.p[c.positions[0]].states.currentlyLookingAt]
	//c.cameras.main.camera.rotation.set(r.x, r.y, r.z)
//}

export { calculateCameraRot }
