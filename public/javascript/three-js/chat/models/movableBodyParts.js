const addMovableBodyParts = name_ => {
	c.p[name_].movableBodyParts = {}
	c.p[name_].model.traverse(function(object) {
		//console.log('name:', object.name)
		if (object.name === "Head") {
			c.p[avatarName].movableBodyParts.head = object;
		} else if (object.name === "Neck") {
			c.p[avatarName].movableBodyParts.neck = object;
		} else if (object.name === "Spine1") {
			c.p[avatarName].movableBodyParts.spine1 = object;
		} else if (object.name === "Spine2") {
			c.p[avatarName].movableBodyParts.spine2 = object;
		} else if (object.name === "LeftEye") {
			c.p[avatarName].movableBodyParts.leftEye = object;
		} else if (object.name === "RightEye") {
			c.p[avatarName].movableBodyParts.rightEye = object;
		} else if  (object.name === "Wolf3D_Head") {
			c.p[avatarName].movableBodyParts.face = object;
		} else if  (object.name === "Spine") {
			c.p[avatarName].movableBodyParts.spine = object;
		} else if  (object.name === "Wolf3D_Teeth") {
			c.p[avatarName].movableBodyParts.teeth = object;
		}
	})
}

export { addMovableBodyParts }
