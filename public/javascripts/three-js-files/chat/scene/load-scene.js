import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.125/build/three.module.js";
import { noParticipants, setNoParticipants } from "./settings.js"
import calculatePosRot from "./components/pos-rot.js"
import { organiseParticipants } from "./components/pos-rot.js"
import setupBackground from "./components/background.js";
import setupLights from "./components/lights.js";
import setupScene from "./components/scene.js";
import setupCamera from "./components/camera.js";
import setupCameraMe from "./components/cameraMe.js";
import addTable from "./components/table.js";
import addAvatar from "../models/components/addAvatar.js"

let group

export default function loadScene() {
	group = new THREE.Group();
	organiseParticipants();
	setNoParticipants(participantNames.length)
	calculatePosRot(noParticipants)
	setupScene();
	setupCamera();
	setupCameraMe();
	setupBackground();
	setupLights();
	addTable();
}

export { group }
