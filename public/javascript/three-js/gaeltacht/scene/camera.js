import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.125/build/three.module.js";
import { OrbitControls } from "https://cdn.jsdelivr.net/npm/three@0.125/examples/jsm/controls/OrbitControls.js";
import { renderer } from "./scene.js"
import { orbitControls } from "./settings.js"

let controls, camera
const setupCamera = () => {
	c.camera = new THREE.PerspectiveCamera(40, window.innerWidth/window.innerHeight, 0.01, 100)
	if ( orbitControls ) {
		controls = new OrbitControls(c.camera, renderer.domElement);
		controls.target.set(0, 1.59, 0);
		controls.update();
	}
}

export { setupCamera, camera }
