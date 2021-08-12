import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.125/build/three.module.js";
import { GLTFLoader } from "https://cdn.jsdelivr.net/npm/three@0.125/examples/jsm/loaders/GLTFLoader.js";
import { loadIndividualGLTF } from "./avatar.js"
import { c } from "../../../setup/chat/settings.js"

let group;

const loadModels = () => {
	group = new THREE.Group()
	loadModelGLTF('root-avatar-poses', iterateAvatar)
}

const loadModelGLTF = (avatarName, cb=null) => {
	gltfLoader = new GLTFLoader();
	gltfLoader.load("/avatars/" + avatarName + ".glb", function(gltf) {
		animations = gltf.animations;
		cb();
	})
}

let avatarCount = 0
const iterateAvatar = () => {
	if (avatarCount < c.participantList.length) {
		let name = c.positions[avatarCount]
		setInitialStates(name);
		loadIndividualGLTF(name, true, iterateAvatar)
		avatarCount += 1
	} else {
		calculateLookAngles(true);
	};
}

const setInitialStates = name_ => {
	c.p[name] = {
		states: {
			currentlyLookingAt: c.lookingAtEnter[name],
			previouslyLookingAt: null,
			expression: 'half_neutral',
			speaking: false,
			speakingViseme: null,
			blinking: false,
			changingExpression: false,
			gesturing: false
		}
	}
}
