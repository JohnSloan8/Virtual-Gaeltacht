import { initialiseVisemeMorphIndexes } from "./visemes.js"
import { prepareAllExpressions } from "./prepare-expressions.js"
import { initThreeJs } from "../init.js"

const loadAnimations = () => {
	initialiseVisemeMorphIndexes();
	prepareAllExpressions();
	initThreeJs('enter');
}

export { loadAnimations }
