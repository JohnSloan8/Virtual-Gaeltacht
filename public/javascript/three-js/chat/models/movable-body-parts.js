import { c } from '../../../setup/chat/settings.js'

const addMovableBodyParts = name_ => {
	c.p[name_].movableBodyParts = {}
	c.p[name_].model.traverse(function(object) {
		//console.log('name:', object.name)
		if (object.name === "Head") {
			c.p[name_].movableBodyParts.head = object;
		} else if (object.name === "Neck") {
			c.p[name_].movableBodyParts.neck = object;
		} else if (object.name === "Spine1") {
			c.p[name_].movableBodyParts.spine1 = object;
		} else if (object.name === "Spine2") {
			c.p[name_].movableBodyParts.spine2 = object;
		} else if (object.name === "LeftEye") {
			c.p[name_].movableBodyParts.leftEye = object;
		} else if (object.name === "RightEye") {
			c.p[name_].movableBodyParts.rightEye = object;
		} else if  (object.name === "Wolf3D_Head") {
			c.p[name_].movableBodyParts.face = object;
		} else if  (object.name === "Spine") {
			c.p[name_].movableBodyParts.spine = object;
		} else if  (object.name === "Wolf3D_Teeth") {
			c.p[name_].movableBodyParts.teeth = object;
		}
	})
}

export { addMovableBodyParts }
