import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.125/build/three.module.js";
import { GLTFLoader } from "https://cdn.jsdelivr.net/npm/three@0.125/examples/jsm/loaders/GLTFLoader.js";
import { group } from "../../scene/load-scene.js";
import { scene } from "../../scene/components/scene.js";
import { camera } from "../../scene/components/camera.js";
import { noParticipants, cameraSettings, showSkeleton } from "../../scene/settings.js"
import { baseActions, additiveActions } from "../settings.js"
import { animate } from "../../main.js";
import { posRot, participantNamesArray, positions, reversePositions, lookingAtEnter } from "../../scene/components/pos-rot.js"
import initAnimations from '../../animations/init.js'
import prepareExpressions from '../../animations/morph/prepare.js'
import { initialiseVisemeMorphIndexes } from "../../animations/settings.js"
//import { lookingAtEnter } from "../../scene/components/pos-rot.js"

let numAnimations, clip, name, animations, action, gltfLoader, skeleton;
var participants = {};
window.participants = participants
var me = {};

let avatarCount = 0
//let curAvatar
export default function setupAvatar() {
	loadModelGLTF('root-avatar-poses', iterateAvatar)
	scene.add( group )
}

function iterateAvatar() {
	if (avatarCount < noParticipants) {
		let myAvatar = participantNamesArray[avatarCount]
		loadIndividualGLTF(myAvatar, true, iterateAvatar)
		avatarCount += 1
	} else {
		calculateLookAngles(true);
	};
}

function loadModelGLTF(avatarName, cb=null) {

	gltfLoader = new GLTFLoader();
	//added slash at start cause was getting wrong url
	gltfLoader.load("/javascripts/three-js-files/chat/models/resources/" + avatarName + ".glb", function(
		gltf
	) {
		animations = gltf.animations;
		cb()
	})
}

window.loadIndividualGLTF = loadIndividualGLTF
function loadIndividualGLTF(avatarName, visibility, cb=null) {

	gltfLoader = new GLTFLoader();
	//added slash at start cause was getting wrong url
	gltfLoader.load("/avatars/" + avatarName + ".glb", function(
		gltf
	) {
		participants[avatarName] = {}
		participants[avatarName].states = {
			currentlyLookingAt: lookingAtEnter[avatarName],
			previouslyLookingAt: null,
			expression: 'half_neutral',
			speaking: false,
			speakingViseme: null,
			blinking: false,
			changingExpression: false,
			gesturing: false
		}
		//console.log('avatarName:', avatarName)
		//console.log('lookingAtEnter[avatarName]:', lookingAtEnter[avatarName])
		//participants[avatarName].states.currentlyLookingAt = lookingAtEnter[avatarName]
		//console.log('currentlyLookingAt:', participants[avatarName].states.currentlyLookingAt)
		participants[avatarName].model = gltf.scene;
		participants[avatarName].model.visible = visibility
		if (avatarName !== username) {
			group.add(participants[avatarName].model);
		}
		participants[avatarName].model.traverse(function(object) {
			if (object.isMesh) {
				object.castShadow = false;
				object.frustumCulled = false;
			}
		});
		addMovableBodyParts(avatarName)
		setPosRotOfAvatar(avatarName)
		if ( showSkeleton ) {
			skeleton = new THREE.SkeletonHelper(participants[avatarName].model);
			skeleton.visible = true;
			scene.add(skeleton);
		}
		participants[avatarName].mixer = new THREE.AnimationMixer(participants[avatarName].model);
		numAnimations = animations.length;
		participants[avatarName]['allActions'] = [];
		for (let j = 0; j !== numAnimations; ++j) {
			clip = animations[j].clone();
			name = clip.name;
			if ( baseActions[ name ] ) {
				const action = participants[avatarName].mixer.clipAction( clip );
				activateAction( action );
				baseActions[ name ].action = action;
				participants[avatarName]['allActions'].push(action);
			} else if ( additiveActions[ name ] ) {
				// Make the clip additive and remove the reference frame
				THREE.AnimationUtils.makeClipAdditive( clip );
				if ( clip.name.endsWith( '_pose' ) ) {
					clip = THREE.AnimationUtils.subclip( clip, clip.name, 2, 3, 30 );
				}
				const action = participants[avatarName].mixer.clipAction( clip );
				activateAction( action );
				additiveActions[ name ].action = action;
				participants[avatarName]['allActions'].push(action);
			}
		}
		if (cb) {
			//console.log('in callback')
			cb(avatarName);
		}
	});

}

function setPosRotOfAvatar(avatarName) {
	participants[avatarName].model.rotation.set(0, posRot[participantNamesArray.length][reversePositions[avatarName]].neutralYrotation, 0);
	participants[avatarName].model.position.set(posRot[participantNamesArray.length][reversePositions[avatarName]].x, 0, posRot[participantNamesArray.length][reversePositions[avatarName]].z);
}

function activateAction( action ) {

	const clip = action.getClip();
	const settings = baseActions[ clip.name ] || additiveActions[ clip.name ];
	setWeight( action, settings.weight );
	action.play();

}

function setWeight( action, weight ) {

	action.enabled = true;
	action.setEffectiveTimeScale( 1 );
	action.setEffectiveWeight( weight );

}

function addMovableBodyParts(avatarName) {
	participants[avatarName].movableBodyParts = {}
	participants[avatarName].model.traverse(function(object) {
		//console.log('name:', object.name)
		if (object.name === "Head") {
			participants[avatarName].movableBodyParts.head = object;
		} else if (object.name === "Neck") {
			participants[avatarName].movableBodyParts.neck = object;
		} else if (object.name === "Spine1") {
			participants[avatarName].movableBodyParts.spine1 = object;
		} else if (object.name === "Spine2") {
			participants[avatarName].movableBodyParts.spine2 = object;
		} else if (object.name === "LeftEye") {
			participants[avatarName].movableBodyParts.leftEye = object;
		} else if (object.name === "RightEye") {
			participants[avatarName].movableBodyParts.rightEye = object;
		} else if  (object.name === "Wolf3D_Head") {
			participants[avatarName].movableBodyParts.face = object;
		} else if  (object.name === "Spine") {
			participants[avatarName].movableBodyParts.spine = object;
		} else if  (object.name === "Wolf3D_Teeth") {
			participants[avatarName].movableBodyParts.teeth = object;
		}
	})
}

function calculateLookAngles(firstLoad) {
	let cameraDirection = new THREE.Vector3();
	let myHeadPos = participants[username].movableBodyParts.head.getWorldPosition(cameraDirection)
	posRot[participantNamesArray.length].camera.y = myHeadPos.y + 0.1
	
	let headMult = 0.2;
	let spine2Mult = 0.05;
	let spine1Mult = 0.05;
	participantNamesArray.forEach(function(p) {
		const cubeGroup = new THREE.Group()
		const geometry = new THREE.BoxGeometry(0.1, 0.1, 0.1);
		const material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
		participants[p].cube = new THREE.Mesh( geometry, material );
		
		let direction = new THREE.Vector3();
		let focalPoint = participants[p].movableBodyParts.head.getWorldPosition(direction)
		cubeGroup.position.set(focalPoint.x, focalPoint.y, focalPoint.z)
		cubeGroup.rotation.y = posRot[participantNamesArray.length][participantNamesArray.indexOf(p)].neutralYrotation
		cubeGroup.add(participants[p].cube)
		participants[p].rotations =  {}
		participantNamesArray.forEach(function(q) {
			let direction
			let	headPos
			if (q!==p) {	
				direction = new THREE.Vector3();
				headPos = participants[q].movableBodyParts.head.getWorldPosition(direction)
				participants[p].cube.lookAt(headPos)
				participants[p].rotations[q] = {}
				let yr = participants[p].cube.rotation
				let y0 = posRot[participantNamesArray.length][reversePositions[p]].neutralYrotation
				participants[p].rotations[q].head = {x:yr.x*headMult, y:yr.y*headMult*2, z:yr.z*headMult}
				participants[p].rotations[q].spine2 = {x:yr.x*spine2Mult, y:yr.y*spine2Mult*2, z:yr.z*spine2Mult}
				participants[p].rotations[q].spine1 = {x:yr.x*spine1Mult, y:yr.y*spine1Mult*2, z:yr.z*spine1Mult}
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

export { participants, calculateLookAngles }
