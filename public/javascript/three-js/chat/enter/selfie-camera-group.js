import { c } from "../../../setup/chat/init.js"
import { scene } from "../scene/scene.js"
import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.125/build/three.module.js";
import { Reflector } from "https://cdn.jsdelivr.net/npm/three@0.125/examples/jsm/objects/Reflector.js";
import { cameraSettings } from "./set-positions-rotations.js"

let mirrorOffsetZ = 5
let	selfieCameraOffsetZ = 5.05
let participant0OffsetZ = 5.5
const addSelfieCameraGroup = entrance => {
	c.p[username].model.position.z = participant0OffsetZ
	c.p[username].model.rotation.y = Math.PI
 
	let direction = new THREE.Vector3();
	let headPos = c.p[username].movableBodyParts.head.getWorldPosition(direction)
	c.cameras.selfie.camera.position.set(0, headPos.y-0.075, selfieCameraOffsetZ);
	//const selfieCameraHelper = new THREE.CameraHelper(c.cameras.selfie.camera)
	const geometry = new THREE.PlaneGeometry( 1, 1 );
	const mirror = new Reflector( geometry, {
		clipBias: 0.003,
		textureWidth: window.innerWidth * window.devicePixelRatio,
		textureHeight: window.innerHeight * window.devicePixelRatio,
		color: 0x889999
	} );
	mirror.position.set(0, c.cameras.selfie.camera.position.y, mirrorOffsetZ);
	mirror.rotation.x = -0.075
	c.selfieGroup = new THREE.Group()
	//c.selfieGroup.add(c.cameras.selfie.camera)
	//c.selfieGroup.add(selfieCameraHelper)
	c.selfieGroup.add(mirror)
	c.selfieGroup.add(c.p[username].model)
	scene.add(c.selfieGroup)
}

export { addSelfieCameraGroup }
