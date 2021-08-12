const calculateLookAngles = firstLoad => {
	let cameraDirection = new THREE.Vector3();
	let myHeadPos = participants[username].movableBodyParts.head.getWorldPosition(cameraDirection)
	posRot[c.participantList.length].camera.y = myHeadPos.y + 0.1
	
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
		cubeGroup.rotation.y = posRot[c.participantList.length][c.participantList.indexOf(p)].neutralYrotation
		cubeGroup.add(participants[n].cube)
		c.p[n].rotations =  {}
		c.participantList.forEach(function(q) {
			let direction
			let	headPos
			if (m!==n) {	
				direction = new THREE.Vector3();
				headPos = c.p[m].movableBodyParts.head.getWorldPosition(direction)
				c.p[n].cube.lookAt(headPos)
				c.p[n].rotations[m] = {}
				let yr = c.p[n].cube.rotation
				let y0 = posRot[c.participantList.length][reversePositions[n]].neutralYrotation
				c.p[n].rotations[m].head = {x:yr.x*headMult, y:yr.y*headMult*2, z:yr.z*headMult}
				c.p[n].rotations[m].spine2 = {x:yr.x*spine2Mult, y:yr.y*spine2Mult*2, z:yr.z*spine2Mult}
				c.p[n].rotations[m].spine1 = {x:yr.x*spine1Mult, y:yr.y*spine1Mult*2, z:yr.z*spine1Mult}
			}
		})
	})

  if (firstLoad) {
		initialiseVisemeMorphIndexes();
		prepareExpressions()
		animate()
		initAnimations();
	}
}

export { calculateLookAngles }
