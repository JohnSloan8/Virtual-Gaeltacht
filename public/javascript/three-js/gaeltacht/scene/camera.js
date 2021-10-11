import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.125/build/three.module.js";
import { OrbitControls } from "https://cdn.jsdelivr.net/npm/three@0.125/examples/jsm/controls/OrbitControls.js";
import { renderer } from "./scene.js"
import { orbitControls } from "./settings.js"

let controls, camera
const setupCameras = () => {
	camera = new THREE.PerspectiveCamera(40, window.innerWidth/window.innerHeight, 0.01, 100)
	camera.position.set(0, 1.65, 5)
	if ( orbitControls ) {
		controls = new OrbitControls(camera, renderer.domElement);
		controls.target.set(0, 1.65, 0);
		controls.update();
	}
}

export { setupCameras, camera }
