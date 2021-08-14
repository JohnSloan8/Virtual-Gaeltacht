import { c } from "../../../setup/chat/settings.js"

const initialiseVisemeMorphIndexes = () => {
	c.mouthedVisemes = []
	Object.entries(c.p[c.positions[0]].movableBodyParts.face.morphTargetDictionary).forEach(function (e) {
		if ( e[0].split("_")[0] === "viseme" ) c.mouthedVisemes.push(e[0]);
	})
}

export { initialiseVisemeMorphIndexes }
