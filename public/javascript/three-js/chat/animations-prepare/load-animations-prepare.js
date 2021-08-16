import { setPosRotOfAvatars, calculateLookAngles } from "./avatar-pos-rot.js"
import { calculateCameraRot } from "./camera-pos-rot.js"
import { initialiseVisemeMorphIndexes } from "./visemes.js"
import { prepareExpressions } from "./prepare-expressions.js"
import { initScene } from "../init.js"

const loadAnimationsPrepare = () => {
	setPosRotOfAvatars();
	calculateLookAngles(true);
	initialiseVisemeMorphIndexes();
	prepareExpressions();
	calculateCameraRot();
	initScene('enter');
}

export { loadAnimationsPrepare }
