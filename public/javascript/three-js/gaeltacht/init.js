import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.125/build/three.module.js";
import { OrbitControls } from "https://cdn.jsdelivr.net/npm/three@0.125/examples/jsm/controls/OrbitControls.js";
import { GLTFLoader } from "https://cdn.jsdelivr.net/npm/three@0.125/examples/jsm/loaders/GLTFLoader.js";
import { loadScene } from "./scene/load-scene.js"
import { loadModels } from "./models/load-models.js"
import { animate } from "./animate.js"

init()
var gltfLoader, model, controls, container, scene, camera, renderer, hemiLight, dirLight
function init() {
	loadScene();
	loadModels();
	animate();
}



