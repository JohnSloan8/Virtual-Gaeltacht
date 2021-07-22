import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.125/build/three.module.js";
let cameraMe

export default function setupCameraMe() {
	cameraMe = new THREE.PerspectiveCamera(
		45,
		window.innerWidth / window.innerHeight,
		0.01,
		100
	);
	cameraMe.position.set(2, 2, 3)
}

export { cameraMe }
