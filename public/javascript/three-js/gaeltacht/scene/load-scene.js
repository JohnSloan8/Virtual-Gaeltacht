import { c } from '../../../setup/chat/init.js'
import { setupBackground } from "./background.js";
import { setupLights } from "./lights.js";
import { setupScene } from "./scene.js";
import { setupCamera } from "./camera.js";
import { initThreeJs } from "../init.js";

const loadScene = () => {
	setupScene();
	setupCamera();
	setupBackground();
	setupLights();
	initThreeJs('avatars')
}

export { loadScene }
