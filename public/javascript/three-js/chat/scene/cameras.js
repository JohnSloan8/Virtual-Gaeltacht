import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.125/build/three.module.js";
import { OrbitControls } from "https://cdn.jsdelivr.net/npm/three@0.125/examples/jsm/controls/OrbitControls.js";
import { scene, renderer } from "./scene.js"
import { orbitControls } from "./settings.js"
import { c } from "../../../setup/chat/settings.js"

let controls
const setupCameras = () => {
	c.cameras.main.camera = new THREE.PerspectiveCamera(
		c.cameras.main.fov,
		window.innerWidth / window.innerHeight,
		0.01,
		100
	);

	c.cameras.selfie.camera = new THREE.PerspectiveCamera(
		45,
		window.innerWidth / window.innerHeight,
		0.01,
		100
	);
	//cameraMe.position.set(0, 0, 0)
	if ( orbitControls ) {
		controls = new OrbitControls(c.cameras.main.camera, renderer.domElement);
		controls.target.set(0, 1.59, 0);
		controls.update();
	}
}

export { setupCameras }
