import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.125/build/three.module.js";
import { c } from '../../../setup/chat/init.js'

const calculateLookRotations = (who, whom) => {
	
	let headMult = 0.2;
	let spine2Mult = 0.05;
	let spine1Mult = 0.05;
	let direction
	let direction1
	let	headPos
	let	spinePos
	if (m!==n) {	
		if ()
		direction = new THREE.Vector3();
		direction1= new THREE.Vector3();
		headPos = c.p[m].movableBodyParts.head.getWorldPosition(direction)
		spinePos = c.p[m].movableBodyParts.spine.getWorldPosition(direction1)
		if (m!== username) {
			c.p[n].cube.lookAt(headPos)
		} else {
			focalPoint = c.cameras.main.camera.getWorldPosition(direction)
			c.p[n].cube.lookAt(focalPoint)
		}
		let yr = c.p[n].cube.rotation
		c.p[n].lookRotations[m].head = {x:yr.x*headMult, y:yr.y*headMult*2, z:yr.z*headMult}
		c.p[n].lookRotations[m].spine2 = {x:yr.x*spine2Mult, y:yr.y*spine2Mult*2, z:yr.z*spine2Mult}
		c.p[n].lookRotations[m].spine1 = {x:yr.x*spine1Mult, y:yr.y*spine1Mult*2, z:yr.z*spine1Mult}

		if (m!== username) {
			c.p[n].cube.lookAt(spinePos)
		} else {
			focalPoint = c.cameras.main.camera.getWorldPosition(direction1)
			focalPoint.y *= 0.75
			c.p[n].cube.lookAt(focalPoint)
		}
		let yb = c.p[n].cube.rotation
		c.p[n].lookRotations[m + '_body'] = {}
		c.p[n].lookRotations[m + '_body'].head = {x:yb.x*headMult, y:yb.y*headMult*2, z:yb.z*headMult}
		c.p[n].lookRotations[m + '_body'].spine2 = {x:yb.x*spine2Mult, y:yb.y*spine2Mult*2, z:yb.z*spine2Mult}				
		c.p[n].lookRotations[m + '_body'].spine1 = {x:yb.x*spine1Mult, y:yb.y*spine1Mult*2, z:yb.z*spine1Mult}
	}
}

export { calculateLookRotations }
