import { participants } from "../../models/components/avatar.js"
import { c.participantList } from "../../scene/components/pos-rot.js"
import { expressionMorphs } from "./morph-targets.js"
import { mouthedVisemes } from "../settings.js"
import { posRot } from "../../scene/components/pos-rot.js"
import { camera } from "../../scene/components/camera.js";
import { noP } from "../../scene/settings.js"
import easingDict from "../easings.js"
import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.125/build/three.module.js";
import TWEEN from 'https://cdn.jsdelivr.net/npm/@tweenjs/tween.js@18.5.0/dist/tween.esm.js'

let lenMorphs
export default function prepareExpressions() {

	addHalfAndBlinkExpressions();
	c.participantList.forEach(function(p) {
		createExpressions(p)
	})
	lenMorphs = participants[c.participantList[0]].movableBodyParts.face.morphTargetInfluences.length

}

function createExpressions(p) {
	console.log('p:', p)
	Object.entries(expressionMorphs).forEach( function(e) {
		let lengthArray = participants[p].movableBodyParts.face.morphTargetInfluences.length
		participants[p].movableBodyParts.face.morphTargetDictionary[e[0]] = lengthArray
		Object.entries(e[1]).forEach( function(m, ind) {
			let morphId = participants[p].movableBodyParts.face.morphTargetDictionary[m[0]]
			let copyPosition = participants[p].movableBodyParts.face.geometry.morphAttributes.position[morphId].array.map(function(n) {
				return n * m[1]
			}) 
			let copyNormal = participants[p].movableBodyParts.face.geometry.morphAttributes.normal[morphId].array.map(function(o) {
				return o * m[1]
			}) 

			if (ind===0) {
				const newMorphTargetPosition = new THREE.Float32BufferAttribute( copyPosition, 3 );
				const newMorphTargetNormal = new THREE.Float32BufferAttribute( copyNormal, 3 );
				participants[p].movableBodyParts.face.geometry.morphAttributes.position = [...participants[p].movableBodyParts.face.geometry.morphAttributes.position, newMorphTargetPosition]
				participants[p].movableBodyParts.face.geometry.morphAttributes.normal = [...participants[p].movableBodyParts.face.geometry.morphAttributes.normal, newMorphTargetNormal]
				participants[p].movableBodyParts.face.morphTargetInfluences = [...participants[p].movableBodyParts.face.morphTargetInfluences, 0]
			} else {
				participants[p].movableBodyParts.face.geometry.morphAttributes.position[lengthArray].array = participants[p].movableBodyParts.face.geometry.morphAttributes.position[lengthArray].array.map(function(num, idx) {
					return num + copyPosition[idx]
				}) 
				participants[p].movableBodyParts.face.geometry.morphAttributes.normal[lengthArray].array = participants[p].movableBodyParts.face.geometry.morphAttributes.normal[lengthArray].array.map(function(num, idx) {
					return num + copyNormal[idx]
				}) 
			}
		})
	})
}

function addHalfAndBlinkExpressions() {
	//let partKey = participants[1].movableBodyParts.face.morphTargetDictionary["eyesClosed"]
	Object.entries(expressionMorphs).forEach( function(e) {
		expressionMorphs["half_"+e[0]] = {}
		for (let key in expressionMorphs[e[0]]) {
			expressionMorphs["half_"+e[0]][key] = expressionMorphs[e[0]][key]/2
		}
		expressionMorphs["full_"+e[0] + "_blink"] = Object.assign({}, expressionMorphs[e[0]])
		expressionMorphs["full_"+e[0] + "_blink"]["eyesClosed"] = 0.85
		expressionMorphs["half_"+e[0] + "_blink"] = Object.assign({}, expressionMorphs["half_"+e[0]])
		expressionMorphs["half_"+e[0] + "_blink"]["eyesClosed"] = 0.75

		// don't need cause half surprise mouthing doesn't close lips
		mouthedVisemes.forEach(function(vis) {
			expressionMorphs["half_"+e[0]+"_"+vis] = Object.assign({}, expressionMorphs["half_"+e[0]]) 
			expressionMorphs["half_"+e[0]+"_"+vis][vis] = 0.667
			expressionMorphs["half_"+e[0]+"_"+vis]['jawOpen'] = 0.1
		})
	})
}

export {expressionMorphs, lenMorphs, createExpressions}
