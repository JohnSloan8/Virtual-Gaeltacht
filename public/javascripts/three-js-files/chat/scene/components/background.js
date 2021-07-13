import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.125/build/three.module.js";
import { scene } from "./scene.js";
import { background, showShadows } from "../settings.js";

let plane;

export default function setupBackground() {
	
	scene.background = new THREE.Color(background.skyColor);

	if ( background.displayGround ) {
		plane = new THREE.Mesh(
			new THREE.PlaneGeometry(10, 10, 10, 10),
			new THREE.MeshPhongMaterial({
				color: background.groundColor,
				depthWrite: false,
			})
		);
		plane.castShadow = false;
		plane.receiveShadow = showShadows;
		plane.rotation.x = -Math.PI / 2;
		scene.add(plane);
	}
	
	if ( background.displayFog ) {
		scene.fog = new THREE.Fog(0x87ceeb, 5, 6.0);
	}

}
