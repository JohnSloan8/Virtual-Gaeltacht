import { loadScene } from "./scene/load-scene.js"

const initThreeJs = part => {
  $('#loadingText').text('loading ' + part + '...')
	if (part === "scene") {
		loadScene()
	}
}

export { initThreeJs }
