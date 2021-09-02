import { expressionMorphs } from "./morph-targets.js"
import { easingDict } from "./easings.js"
import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.125/build/three.module.js";
import TWEEN from 'https://cdn.jsdelivr.net/npm/@tweenjs/tween.js@18.5.0/dist/tween.esm.js'
import { c } from '../../../setup/chat/init.js'

const prepareAllExpressions = () => {
	addHalfAndBlinkExpressions();
	c.participantList.forEach(function(p) {
		createExpressions(p)
	})
	if (!c.participantList.includes(username)) {
		createExpressions(username)
	}
	c.lenMorphs = c.p[username].movableBodyParts.face.morphTargetInfluences.length
}

const addHalfAndBlinkExpressions = () => {
	//let partKey = participants[1].movableBodyParts.face.morphTargetDictionary["eyesClosed"]
	Object.entries(expressionMorphs).forEach( function(e) {
		//expressionMorphs["half_"+e[0]] = {}
		for (let key in expressionMorphs[e[0]]) {
			expressionMorphs[e[0]][key] = expressionMorphs[e[0]][key]/1.5 
			//expressionMorphs["half_"+e[0]][key] = expressionMorphs[e[0]][key]/2
		}
		expressionMorphs[e[0] + "_blink"] = Object.assign({}, expressionMorphs[e[0]])
		expressionMorphs[e[0] + "_blink"]["eyesClosed"] = 0.85
		//expressionMorphs["half_"+e[0] + "_blink"] = Object.assign({}, expressionMorphs["half_"+e[0]])
		//expressionMorphs["half_"+e[0] + "_blink"]["eyesClosed"] = 0.75

		// don't need cause half surprise mouthing doesn't close lips
		c.mouthedVisemes.forEach(function(vis) {
			expressionMorphs[e[0]+"_"+vis] = Object.assign({}, expressionMorphs["half_"+e[0]]) 
			expressionMorphs[e[0]+"_"+vis][vis] = 0.667
			expressionMorphs[e[0]+"_"+vis]['jawOpen'] = 0.1
			//expressionMorphs["half_"+e[0]+"_"+vis] = Object.assign({}, expressionMorphs["half_"+e[0]]) 
			//expressionMorphs["half_"+e[0]+"_"+vis][vis] = 0.667
			//expressionMorphs["half_"+e[0]+"_"+vis]['jawOpen'] = 0.1
		})
	})
}

const createExpressions = n => {
	console.log('createExpressions')
	Object.entries(expressionMorphs).forEach( function(e) {
		let lengthArray = c.p[n].movableBodyParts.face.morphTargetInfluences.length
		c.p[n].movableBodyParts.face.morphTargetDictionary[e[0]] = lengthArray
		Object.entries(e[1]).forEach( function(m, ind) {
			let morphId = c.p[n].movableBodyParts.face.morphTargetDictionary[m[0]]
			let copyPosition = c.p[n].movableBodyParts.face.geometry.morphAttributes.position[morphId].array.map(function(n) {
				return n * m[1]
			}) 
			let copyNormal = c.p[n].movableBodyParts.face.geometry.morphAttributes.normal[morphId].array.map(function(o) {
				return o * m[1]
			}) 

			if (ind===0) {
				const newMorphTargetPosition = new THREE.Float32BufferAttribute( copyPosition, 3 );
				const newMorphTargetNormal = new THREE.Float32BufferAttribute( copyNormal, 3 );
				c.p[n].movableBodyParts.face.geometry.morphAttributes.position = [...c.p[n].movableBodyParts.face.geometry.morphAttributes.position, newMorphTargetPosition]
				c.p[n].movableBodyParts.face.geometry.morphAttributes.normal = [...c.p[n].movableBodyParts.face.geometry.morphAttributes.normal, newMorphTargetNormal]
				c.p[n].movableBodyParts.face.morphTargetInfluences = [...c.p[n].movableBodyParts.face.morphTargetInfluences, 0]
			} else {
				c.p[n].movableBodyParts.face.geometry.morphAttributes.position[lengthArray].array = c.p[n].movableBodyParts.face.geometry.morphAttributes.position[lengthArray].array.map(function(num, idx) {
					return num + copyPosition[idx]
				}) 
				c.p[n].movableBodyParts.face.geometry.morphAttributes.normal[lengthArray].array = c.p[n].movableBodyParts.face.geometry.morphAttributes.normal[lengthArray].array.map(function(num, idx) {
					return num + copyNormal[idx]
				}) 
			}
		})
	})
}

export { createExpressions, prepareAllExpressions }
