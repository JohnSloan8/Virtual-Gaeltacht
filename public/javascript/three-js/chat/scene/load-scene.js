import { c } from '../../../setup/chat/settings.js'
import { setupBackground } from "./background.js";
import { setupLights } from "./lights.js";
import { setupScene } from "./scene.js";
import { setupCameras } from "./cameras.js";
import { initScene } from "../init.js";

const loadScene = () => {
	setupScene();
	setupCameras();
	setupBackground();
	setupLights();
	initScene('avatars')
}

export { loadScene }
