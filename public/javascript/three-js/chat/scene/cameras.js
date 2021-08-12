import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.125/build/three.module.js";
//import { OrbitControls } from "https://cdn.jsdelivr.net/npm/three@0.125/examples/jsm/controls/OrbitControls.js";
import { scene } from "./scene.js"
import { c } from "../../../setup/chat/settings.js"

const setupCameras = () => {
	c.cameras.main.camera = new THREE.PerspectiveCamera(
		c.cameras.main.fov,
		window.innerWidth / window.innerHeight,
		0.01,
		100
	);
	c.centralPivotGroup = new THREE.Group()
	c.centralPivotGroup.add(c.cameras.main.camera)
	scene.add(c.centralPivotGroup)

	c.cameras.selfie.camera = new THREE.PerspectiveCamera(
		45,
		window.innerWidth / window.innerHeight,
		0.01,
		100
	);
	//cameraMe.position.set(0, 0, 0)
	scene.add(c.cameras.selfie.camera)
}

export { setupCameras }
