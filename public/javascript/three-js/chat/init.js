import { loadScene } from "./scene/load-scene.js"
import { loadModels } from "./models/load-models.js"
import { loadAnimationsPrepare } from "./animations-prepare/load-animations-prepare.js"
import { loadAnimationsMovements } from "./animations-movements/load-animations-movements.js"
//import { animate } from "./animate.js"

const initScene = part => {
  $('#loadingText').text('loading ' + part + '...')
	if (part === "scene") {
		loadScene()
	} else if (part === "avatars") {
		loadModels()
	} else if (part === "animations") {
		loadAnimationsPrepare()
	} else if (part === "movements") {
		loadAnimationsMovements()
	} else if (part === "animate") {
    $('#loadOverlay').hide()
	}
}

export { initScene }
