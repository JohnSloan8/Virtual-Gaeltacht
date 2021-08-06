import blink from "../morph/blink.js"
import { noParticipants } from "../../scene/settings.js"
import { participantNamesArray } from "../../scene/components/pos-rot.js"

window.beginRandomBlinking = beginRandomBlinking
export default function beginRandomBlinking() {
	participantNamesArray.forEach(function(par) {
		randomBlink(par)
	})
}

window.randomBlink = randomBlink
function randomBlink(who) {
	blink(who)
	let randomDelay = 2000 + Math.random() * 5000
	setTimeout(function(){randomBlink(who)}, randomDelay)
}

export { randomBlink }
