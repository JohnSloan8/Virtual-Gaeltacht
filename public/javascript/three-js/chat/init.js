import { loadScene } from "./scene/load-scene.js"
import { loadModels } from "./models/load-models.js"
import { loadAnimations } from "./animations/load-animations.js"
import { loadEnter } from "./enter/load-enter.js"

const initThreeJs = part => {
  $('#loadingText').text('loading ' + part + '...')
	if (part === "scene") {
		loadScene()
	} else if (part === "avatars") {
		loadModels()
	} else if (part === "animations") {
		loadAnimations()
	} else if (part === "enter") {
		loadEnter()
	}
}

export { initThreeJs }
