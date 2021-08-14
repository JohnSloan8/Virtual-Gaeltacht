import { c } from "../../../setup/chat/settings.js"
import { scene } from "../scene/scene.js"
import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.125/build/three.module.js";
import { Reflector } from "https://cdn.jsdelivr.net/npm/three@0.125/examples/jsm/objects/Reflector.js";
import { windowWidth, windowHeight } from "../scene/scene.js"

let geometry, mirror
let	selfieOffsetY = 0.05
let participant0ZOffset = 0.5
const addCameraGroup = (mirrorVisible, entrance) => {
	c.cameras.selfie.camera.position.set(0, c.cameras.main.camera.position.y-0.1, selfieOffsetY);
	geometry = new THREE.PlaneGeometry( 2, 2 );
	mirror = new Reflector( geometry, {
		clipBias: 0.003,
		textureWidth: windowWidth * window.devicePixelRatio,
		textureHeight: windowHeight * window.devicePixelRatio,
		color: 0x889999
	} );
	mirror.visible = mirrorVisible
	mirror.position.set(0, c.cameras.main.camera.y, 0);
	mirror.rotation.x = -0.05
	c.p[c.positions[0]].model.position.z = participant0ZOffset
	c.cameraGroup = new THREE.Group()
	c.cameraGroup.add(c.cameras.selfie.camera)
	c.cameraGroup.add(mirror)
	c.cameraGroup.add(c.p[c.positions[0]].model)
	if (entrance) {
		c.cameraGroup.position.z = c.cameras.main.camera.position.z + 3
	} else {
		c.cameraGroup.position.z = c.cameras.main.camera.position.z
	}
}

export { addCameraGroup }
