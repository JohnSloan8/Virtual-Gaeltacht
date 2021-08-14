import { calculateLookAngles } from "./avatar-pos-rot.js"
import { calculateCameraRot } from "./camera-pos-rot.js"
import { addCameraGroup } from "./camera-group.js"
import { initialiseVisemeMorphIndexes } from "./visemes.js"
import { prepareExpressions } from "./prepare-expressions.js"
import { initScene } from "../init.js"

const loadAnimationsPrepare = () => {
	calculateLookAngles(true);
	initialiseVisemeMorphIndexes();
	prepareExpressions();
	calculateCameraRot();
	addCameraGroup(true, false)
	initScene('movements');
}

export { loadAnimationsPrepare }
