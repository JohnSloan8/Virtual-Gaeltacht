import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.125/build/three.module.js";
import { GLTFLoader } from "https://cdn.jsdelivr.net/npm/three@0.125/examples/jsm/loaders/GLTFLoader.js";
import { loadIndividualGLTF } from "./avatar.js"
import { c } from "../../../setup/chat/settings.js"
import { initialAvatarStates } from "./states.js"
import { initScene } from "../init.js"
import { scene } from "../scene/scene.js"

let group, animations, modelGLTFLoader;

const loadModels = () => {
	c.pGroup = new THREE.Group()
	loadModelGLTF('root-avatar-poses', iterateAvatar)
}

const loadModelGLTF = (avatarName, cb=null) => {
	modelGLTFLoader = new GLTFLoader();
	modelGLTFLoader.load("/avatars/" + avatarName + ".glb", function(gltf) {
		animations = gltf.animations;
		cb();
	})
}

let avatarCount = 0
const iterateAvatar = () => {
	if (avatarCount < c.participantList.length) {
		let name = c.positions[avatarCount]
		c.p[name]['states'] = {...initialAvatarStates}
		loadIndividualGLTF(name, true, iterateAvatar)
  	$('#loadingText').text('loading ' + name + "'s avatar...")
		avatarCount += 1
	} else {
		initScene('animations')
	};
}

export { loadModels, animations }
