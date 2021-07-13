import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.125/build/three.module.js";
import { scene } from "./scene.js"
import { showShadows } from "../settings.js"

let hemiLight, dirLight, dirLightHelper

export default function setupLights() {

	hemiLight = new THREE.HemisphereLight(0xffffff, 0xffffff, 0.8);
	hemiLight.position.set(0, 20, 0);
	scene.add(hemiLight);

	dirLight = new THREE.DirectionalLight(0xffffff, 0.8);
	dirLight.position.set(3, 10, 10);
	dirLight.castShadow = showShadows;
	if ( showShadows ) {
		dirLight.shadow.camera.top = 2;
		dirLight.shadow.camera.bottom = -2;
		dirLight.shadow.camera.left = -2;
		dirLight.shadow.camera.right = 2;
		dirLight.shadow.camera.near = 0.1;
		dirLight.shadow.camera.far = 40;
	}
	scene.add(dirLight);

	dirLightHelper = new THREE.DirectionalLightHelper(dirLight, 2);
	scene.add(dirLightHelper);

}
