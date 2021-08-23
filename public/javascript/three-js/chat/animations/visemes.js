import { c } from "../../../setup/chat/init.js"

const initialiseVisemeMorphIndexes = () => {
	c.mouthedVisemes = []
	Object.entries(c.p[username].movableBodyParts.face.morphTargetDictionary).forEach(function (e) {
		if ( e[0].split("_")[0] === "viseme" ) c.mouthedVisemes.push(e[0]);
	})
}

export { initialiseVisemeMorphIndexes }
