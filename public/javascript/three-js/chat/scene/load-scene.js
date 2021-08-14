import { c } from '../../../setup/chat/settings.js'
//import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.125/build/three.module.js";
//import { noP, setNoParticipants } from "./settings.js"
//import calculatePosRot from "./components/pos-rot.js"
//import { organiseParticipants } from "./components/pos-rot.js"
import { setupBackground } from "./background.js";
import { setupLights } from "./lights.js";
import { setupScene } from "./scene.js";
import { setupCameras } from "./cameras.js";
import { initScene } from "../init.js";
//import setupCameraMe from "./components/cameraMe.js";
//import addTable from "./components/table.js";
//import addAvatar from "../models/components/addAvatar.js"
//import { c.participantList } from "./components/pos-rot.js"

const loadScene = () => {
	setupScene();
	setupCameras();
	setupBackground();
	setupLights();
	initScene('avatars')
}

export { loadScene }
