import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.125/build/three.module.js";
import { OrbitControls } from "https://cdn.jsdelivr.net/npm/three@0.125/examples/jsm/controls/OrbitControls.js";
import { renderer, scene } from "./scene.js"
import { posRot } from "./pos-rot.js"
import { noParticipants } from "../settings.js"

let camera, centralPivotGroup

export default function setupCamera() {
	camera = new THREE.PerspectiveCamera(
		posRot[noParticipants].camera.fov,
		window.innerWidth / window.innerHeight,
		0.01,
		100
	);
	centralPivotGroup = new THREE.Group()
	centralPivotGroup.add(camera)
	scene.add(centralPivotGroup)
	window.camera = camera

}

export { camera, centralPivotGroup }
