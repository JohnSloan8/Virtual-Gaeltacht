import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.125/build/three.module.js";
import { GLTFLoader } from "https://cdn.jsdelivr.net/npm/three@0.125/examples/jsm/loaders/GLTFLoader.js";
import { loadIndividualGLTF } from "./avatar.js"
import { c } from "../../../setup/chat/init.js"
import { initialAvatarStates } from "./states.js"
import { initThreeJs } from "../init.js"

const loadModels = () => {
	c.pGroup = new THREE.Group()
	loadModelGLTF('root-avatar-poses', iterateAvatar)
}

const loadModelGLTF = (avatarName, cb=null) => {
	let modelGLTFLoader = new GLTFLoader();
	modelGLTFLoader.load("/avatars/" + avatarName + ".glb", function(gltf) {
		c.animations = gltf.animations;
		cb();
	})
}

let avatarCount = 0
const iterateAvatar = () => {
	if (avatarCount < c.participantList.length) {
		let name = c.participantList[avatarCount]
		loadAvatar(name, iterateAvatar)
		avatarCount += 1
	} else {
		if (c.firstEntry && c.participantList.length !== 1) {
			c.p[username] = {}
			loadAvatar(username, function(){initThreeJs('animations')})
		} else {
			initThreeJs('animations')
		}
	};
}

const loadAvatar = (n, cb) => {
	c.p[n]['states'] = {...initialAvatarStates}
	loadIndividualGLTF(n, true, cb)
	if ( n !== username ) {
		$('#loadingText').text('loading ' + n + "'s avatar...")
	} else {
		$('#loadingText').text('loading your avatar...')
	}
}

export { loadModels }
