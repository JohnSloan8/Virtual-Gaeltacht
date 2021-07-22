import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.125/build/three.module.js";
import { GLTFLoader } from "https://cdn.jsdelivr.net/npm/three@0.125/examples/jsm/loaders/GLTFLoader.js";
import { group } from "../../scene/load-scene.js";
import { scene } from "../../scene/components/scene.js";
import { camera } from "../../scene/components/camera.js";
import { noParticipants, cameraSettings, showSkeleton } from "../../scene/settings.js"
import { baseActions, additiveActions } from "../settings.js"
import { animate } from "../../main.js";
import { posRot } from "../../scene/components/pos-rot.js"
import initAnimations from '../../animations/init.js'
import prepareExpressions from '../../animations/morph/prepare.js'
import { initialiseVisemeMorphIndexes } from "../../animations/settings.js"

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
		let myAvatar = participantNames[avatarCount]
		loadIndividualGLTF(myAvatar, avatarCount, iterateAvatar)
		avatarCount += 1
	} else {
		calculateLookAngles();
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
function loadIndividualGLTF(avatarName, i, cb=null) {

	gltfLoader = new GLTFLoader();
	//added slash at start cause was getting wrong url
	gltfLoader.load("/avatars/" + avatarName + ".glb", function(
		gltf
	) {
		participants[i] = {}
		participants[i].states = {
			currentlyLookingAt: 0,
			previouslyLookingAt: 1,
			expression: 'half_neutral',
			speaking: false,
			speakingViseme: null,
			blinking: false,
			changingExpression: false
		}
		participants[i].model = gltf.scene;
		participants[i].model.rotation.set(0, posRot[noParticipants][i].neutralYrotation, 0);
		participants[i].model.position.set(posRot[noParticipants][i].x, 0, posRot[noParticipants][i].z);
		group.add(participants[i].model);
		participants[i].model.traverse(function(object) {
			if (object.isMesh) {
				object.castShadow = false;
				object.frustumCulled = false;
			}
		});
		addMovableBodyParts(i)

		if ( showSkeleton ) {
			skeleton = new THREE.SkeletonHelper(participants[i].model);
			skeleton.visible = true;
			scene.add(skeleton);
		}
		//if (avatarCount === 0) {
			//animations = gltf.animations;
		//}
		participants[i].mixer = new THREE.AnimationMixer(participants[i].model);
		numAnimations = animations.length;
		participants[i]['allActions'] = [];
		for (let j = 0; j !== numAnimations; ++j) {
			clip = animations[j].clone();
			name = clip.name;
			if ( baseActions[ name ] ) {
				const action = participants[i].mixer.clipAction( clip );
				activateAction( action );
				baseActions[ name ].action = action;
				participants[i]['allActions'].push(action);
			} else if ( additiveActions[ name ] ) {
				// Make the clip additive and remove the reference frame
				THREE.AnimationUtils.makeClipAdditive( clip );
				if ( clip.name.endsWith( '_pose' ) ) {
					clip = THREE.AnimationUtils.subclip( clip, clip.name, 2, 3, 30 );
				}
				const action = participants[i].mixer.clipAction( clip );
				activateAction( action );
				additiveActions[ name ].action = action;
				participants[i]['allActions'].push(action);
			}
		}
		if (cb) {
			//console.log('in callback')
			cb();
		}
	});

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

function addMovableBodyParts(i) {
	participants[i].movableBodyParts = {}
	participants[i].model.traverse(function(object) {
		//console.log('name:', object.name)
		if (object.name === "Head") {
			participants[i].movableBodyParts.head = object;
		} else if (object.name === "Neck") {
			participants[i].movableBodyParts.neck = object;
		} else if (object.name === "Spine1") {
			participants[i].movableBodyParts.spine1 = object;
		} else if (object.name === "Spine2") {
			participants[i].movableBodyParts.spine2 = object;
		} else if (object.name === "LeftEye") {
			participants[i].movableBodyParts.leftEye = object;
		} else if (object.name === "RightEye") {
			participants[i].movableBodyParts.rightEye = object;
		} else if  (object.name === "Wolf3D_Head") {
			participants[i].movableBodyParts.face = object;
		} else if  (object.name === "Spine") {
			participants[i].movableBodyParts.spine = object;
		} else if  (object.name === "Wolf3D_Teeth") {
			participants[i].movableBodyParts.teeth = object;
		}
	})
}

function calculateLookAngles() {
	let headMult = 0.1;
	let spine2Mult = 0.0667;
	let spine1Mult = 0.0667;
	let xMult = 1
	let yMult = 1; //more rotation in y axis - avatars not leaning over each other!
	let zMult = 1;
	for (let j=0; j<noParticipants; j++) {
		participants[j].rotations =  {}
		for (let k=-1; k<noParticipants; k++) {
			if (j===k) {
				participants[j].rotations[k] = {
					head: {x: 0, y: 0, z: 0},
					spine2: {x: 0, y: 0, z: 0},
					spine1: {x: 0, y: 0, z: 0}
				}
				if (j===0) {
					let direction = new THREE.Vector3();
					let headPos = participants[k].movableBodyParts.head.getWorldPosition(direction)
					posRot[noParticipants].camera.y = headPos.y + 0.1
				}
			} else {
				participants[j].rotations[k] = {}
				if (k===-1) {
					xMult = 2.5
					yMult = 1;
					zMult = 2.5;
					participants[j].movableBodyParts.head.lookAt(0, 1, 0)
				} else if (k===0) {
					xMult = 1
					yMult = 3;
					zMult = 1;
					participants[j].movableBodyParts.head.lookAt(posRot[noParticipants].camera.x, posRot[noParticipants].camera.y, posRot[noParticipants].camera.z)
				} else {
					xMult = 1
					yMult = 3;
					zMult = 1;
					let direction = new THREE.Vector3();
					let headPos = participants[k].movableBodyParts.head.getWorldPosition(direction)
					participants[j].movableBodyParts.head.lookAt(headPos)
				}
				participants[j].rotations[k].head = {x:participants[j].movableBodyParts.head.rotation.x*headMult*xMult, y:participants[j].movableBodyParts.head.rotation.y*headMult*yMult, z:participants[j].movableBodyParts.head.rotation.z*headMult*zMult}
				participants[j].rotations[k].spine2 = {x:participants[j].movableBodyParts.head.rotation.x*spine2Mult*xMult, y:participants[j].movableBodyParts.head.rotation.y*spine2Mult*yMult, z:participants[j].movableBodyParts.head.rotation.z*spine2Mult*zMult}
				participants[j].rotations[k].spine1 = {x:participants[j].movableBodyParts.head.rotation.x*spine1Mult*xMult, y:participants[j].movableBodyParts.head.rotation.y*spine1Mult*yMult, z:participants[j].movableBodyParts.head.rotation.z*spine1Mult*zMult}
				participants[j].states.currentlyLookingAt = k
			}
		}
	}


	initialiseVisemeMorphIndexes();
	prepareExpressions()
	animate()
	initAnimations();
}

export { participants }
