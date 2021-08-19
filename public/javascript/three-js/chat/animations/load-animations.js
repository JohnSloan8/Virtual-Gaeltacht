import { initialiseVisemeMorphIndexes } from "./visemes.js"
import { prepareExpressions } from "./prepare-expressions.js"
import { initScene } from "../init.js"

const loadAnimationsPrepare = () => {
	initialiseVisemeMorphIndexes();
	prepareExpressions();
	initScene('enter');
}

export { loadAnimationsPrepare }
