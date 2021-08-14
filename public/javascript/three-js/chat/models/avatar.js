import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.125/build/three.module.js";
import { GLTFLoader } from "https://cdn.jsdelivr.net/npm/three@0.125/examples/jsm/loaders/GLTFLoader.js";
import { addMovableBodyParts } from "./movable-body-parts.js"
import { addAnimations } from "./animations.js"
import { showSkeleton } from "./settings.js"
import { c } from "../../../setup/chat/settings.js"

let gltfLoader, skeleton;
const loadIndividualGLTF = (name_, visibility, cb=null) => {
	gltfLoader = new GLTFLoader();
	gltfLoader.load("/avatars/" + name_ + ".glb", function(gltf) {
		c.p[name_].model = gltf.scene;
		c.p[name_].model.visible = visibility
		if (name_ !== username) {
			c.pGroup.add(c.p[name_].model);
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
		addAnimations(name_);
		if (cb) {
			cb(name_);
		}
	});
}

export { loadIndividualGLTF }
