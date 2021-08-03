import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.125/build/three.module.js";
import { scene } from "./scene.js"
let cameraMe

export default function setupCameraMe() {
	cameraMe = new THREE.PerspectiveCamera(
		45,
		window.innerWidth / window.innerHeight,
		0.01,
		100
	);
	cameraMe.position.set(0, 0, 0)
	scene.add(cameraMe)
	const helper = new THREE.CameraHelper( cameraMe );
	//scene.add( helper );
	window.cameraMe = cameraMe
}

export { cameraMe }
