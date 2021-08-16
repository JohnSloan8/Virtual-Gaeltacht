import { c } from "../../../setup/chat/settings.js"
import { scene } from "../scene/scene.js"
import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.125/build/three.module.js";
import { Reflector } from "https://cdn.jsdelivr.net/npm/three@0.125/examples/jsm/objects/Reflector.js";
import { windowWidth, windowHeight } from "../scene/scene.js"
import { cameraSettings } from "../../../setup/chat/settings.js"

let geometry, mirror
let mirrorOffsetZ = 5
let	selfieCameraOffsetZ = 5.05
let participant0OffsetZ = 5.5
const addSelfieCameraGroup = (mirrorVisible, entrance) => {
	c.p[c.positions[0]].model.position.z = participant0OffsetZ
	c.cameras.selfie.camera.position.set(0, c.cameras.main.camera.position.y-0.1, selfieCameraOffsetZ);
	const selfieCameraHelper = new THREE.CameraHelper(c.cameras.selfie.camera)
	geometry = new THREE.PlaneGeometry( 1, 1 );
	mirror = new Reflector( geometry, {
		clipBias: 0.003,
		textureWidth: windowWidth * window.devicePixelRatio,
		textureHeight: windowHeight * window.devicePixelRatio,
		color: 0x889999
	} );
	mirror.visible = mirrorVisible
	mirror.position.set(0, c.cameras.selfie.camera.position.y, mirrorOffsetZ);
	mirror.rotation.x = -0.05
	c.selfieGroup = new THREE.Group()
	c.selfieGroup.add(c.cameras.selfie.camera)
	c.selfieGroup.add(selfieCameraHelper)
	c.selfieGroup.add(mirror)
	c.selfieGroup.add(c.p[c.positions[0]].model)
	scene.add(c.selfieGroup)
}

export { addSelfieCameraGroup }
