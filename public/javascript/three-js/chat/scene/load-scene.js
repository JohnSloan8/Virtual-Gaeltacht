import { c } from '../../../setup/chat/init.js'
import { setupBackground } from "./background.js";
import { setupLights } from "./lights.js";
import { setupScene } from "./scene.js";
import { setupCameras } from "./cameras.js";
import { initThreeJs } from "../init.js";

const loadScene = () => {
	setupScene();
	setupCameras();
	setupBackground();
	setupLights();
	initThreeJs('avatars')
}

export { loadScene }
