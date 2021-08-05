import easingDict from "./easings.js"
import { participantNamesArray } from "../scene/components/pos-rot.js"

const randomBlinking = true
const randomSwaying = true
var mouthedVisemes = []
var easings = []
var participant0ZOffset = 0.5
var	cameraMeOffset = 0.05
//var verticalMirrorOffset = 1.9

function initialiseVisemeMorphIndexes() {
	Object.entries(participants[participantNamesArray[0]].movableBodyParts.face.morphTargetDictionary).forEach(function (e) {
		if ( e[0].split("_")[0] === "viseme" ) mouthedVisemes.push(e[0]);
	})
	easings = Object.keys(easingDict)
}

export {
	randomBlinking,
	randomSwaying,
	initialiseVisemeMorphIndexes,
	mouthedVisemes,
	easings,
	participant0ZOffset,
	cameraMeOffset,
	//verticalMirrorOffset
}

