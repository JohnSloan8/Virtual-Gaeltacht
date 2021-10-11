import { setupBackground } from "./background.js";
import { setupLights } from "./lights.js";
import { setupScene } from "./scene.js";
import { setupCameras } from "./camera.js";
//import { init } from "../init.js";

const loadScene = () => {
	setupScene();
	setupCameras();
	setupBackground();
	setupLights();
	//initThreeJs('avatars')
}

export { loadScene }
