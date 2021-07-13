import easingDict from "./easings.js"

const randomBlinking = true
const randomSwaying = true
var mouthedVisemes = []
var easings = []

function initialiseVisemeMorphIndexes() {
	Object.entries(participants[1].movableBodyParts.face.morphTargetDictionary).forEach(function (e) {
		if ( e[0].split("_")[0] === "viseme" ) mouthedVisemes.push(e[0]);
	})
	easings = Object.keys(easingDict)
}

export {
	randomBlinking,
	randomSwaying,
	initialiseVisemeMorphIndexes,
	mouthedVisemes,
	easings
}

