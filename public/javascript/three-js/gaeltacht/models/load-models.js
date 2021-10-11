import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.125/build/three.module.js";
import { GLTFLoader } from "https://cdn.jsdelivr.net/npm/three@0.125/examples/jsm/loaders/GLTFLoader.js";
import { scene } from "../scene/scene.js"
//import { loadIndividualGLTF } from "./avatar.js"
//import { initThreeJs } from "../init.js"

let model
const loadModels = () => {
	loadTown()
}

const buildings = {
	'house': {
		position: {
			x: 0,
			y: 0,
			z: 0
		},				
		rotation: {
			x: 0,
			y: 0,
			z: 0
		},				
		scale: {
			x: 0,
			y: 0,
			z: 0
		},				
	}
}

const loadTown = () => {
	Object.keys(buildings).forEach( b => {
		loadModelGLTF(b)
	})
}

const loadModelGLTF = (name, cb=null) => {
	let modelGLTFLoader = new GLTFLoader();
	modelGLTFLoader.load("/buildings/" + name + ".glb", function(gltf) {
		model = gltf.scene;
		model.receiveShadow = true;
		scene.add( model );
	})
}

export { loadModels }
