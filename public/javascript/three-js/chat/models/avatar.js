import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.125/build/three.module.js";
import { GLTFLoader } from "https://cdn.jsdelivr.net/npm/three@0.125/examples/jsm/loaders/GLTFLoader.js";
import { addMovableBodyParts } from "./movableBodyParts.js"
import { addAnimations } from "./animations.js"


//import { scene } from "../../scene/components/scene.js";
//import { camera } from "../../scene/components/camera.js";
//import { noP, cameraSettings, showSkeleton } from "../../scene/settings.js"
//import { animate } from "../../main.js";
//import { posRot, c.participantList, positions, reversePositions, lookingAtEnter } from "../../scene/components/pos-rot.js"
//import initAnimations from '../../animations/init.js'
//import prepareExpressions from '../../animations/morph/prepare.js'
//import { initialiseVisemeMorphIndexes } from "../../animations/settings.js"
//import { lookingAtEnter } from "../../scene/components/pos-rot.js"

let gltfLoader, skeleton;
const loadIndividualGLTF = (name_, visibility, cb=null) => {
	gltfLoader = new GLTFLoader();
	gltfLoader.load("/avatars/" + name_ + ".glb", function(gltf) {
		c.p[name_].model = gltf.scene;
		c.p[name_].model.visible = visibility
		if (name_ !== username) {
			group.add(c.p[name_].model);
		}
		c.p[name_].model.traverse(function(object) {
			if (object.isMesh) {
				object.castShadow = false;
				object.frustumCulled = false;
			}
		});
		if ( showSkeleton ) {
			skeleton = new THREE.SkeletonHelper(c.p[name_].model);
			skeleton.visible = true;
			scene.add(skeleton);
		}
		addMovableBodyParts(name_)
		addAnimations();
		setPosRotOfAvatar(name_)
		if (cb) {
			cb(name_);
		}
	});

}

export { loadIndividualGLTF }
