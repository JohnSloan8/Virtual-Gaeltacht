import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.125/build/three.module.js";
import { c } from '../../../setup/chat/settings.js'

const setPosRotOfAvatars = () => {
	c.participantList.forEach(function(n) {
		c.p[n].model.rotation.set(0, c.p[n].posRot.rotation.y, 0);
		c.p[n].model.position.set(c.p[n].posRot.position.x, 0, c.p[n].posRot.position.z);
	})
}

const calculateLookAngles = firstLoad => {
	let cameraDirection = new THREE.Vector3();
	let myHeadPos = c.p[username].movableBodyParts.head.getWorldPosition(cameraDirection)
	c.cameras.main.camera.position.y = myHeadPos.y + 0.1
	
	let headMult = 0.2;
	let spine2Mult = 0.05;
	let spine1Mult = 0.05;
	c.participantList.forEach(function(n) {
		const cubeGroup = new THREE.Group()
		const geometry = new THREE.BoxGeometry(0.1, 0.1, 0.1);
		const material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
		c.p[n].cube = new THREE.Mesh( geometry, material );
		
		let direction = new THREE.Vector3();
		let focalPoint = c.p[n].movableBodyParts.head.getWorldPosition(direction)
		cubeGroup.position.set(focalPoint.x, focalPoint.y, focalPoint.z)
		cubeGroup.rotation.y = c.p[n].posRot.rotation.y
		cubeGroup.add(c.p[n].cube)
		c.p[n].lookRotations =  {}
		c.participantList.forEach(function(m) {
			let direction
			let	headPos
			if (m!==n) {	
				direction = new THREE.Vector3();
				headPos = c.p[m].movableBodyParts.head.getWorldPosition(direction)
				c.p[n].cube.lookAt(headPos)
				c.p[n].lookRotations[m] = {}
				let yr = c.p[n].cube.rotation
				//let y0 = c.p[n].posRot.rotation.y
				c.p[n].lookRotations[m].head = {x:yr.x*headMult, y:yr.y*headMult*2, z:yr.z*headMult}
				c.p[n].lookRotations[m].spine2 = {x:yr.x*spine2Mult, y:yr.y*spine2Mult*2, z:yr.z*spine2Mult}
				c.p[n].lookRotations[m].spine1 = {x:yr.x*spine1Mult, y:yr.y*spine1Mult*2, z:yr.z*spine1Mult}
			}
		})
	})
}

export { setPosRotOfAvatars, calculateLookAngles }
