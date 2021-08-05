import blink from "../morph/blink.js"
import { noParticipants } from "../../scene/settings.js"

window.beginRandomBlinking = beginRandomBlinking
export default function beginRandomBlinking() {
	for (let par=0; par<noParticipants; par++) {
		randomBlink(par)
	}
}

window.randomBlink = randomBlink
function randomBlink(who) {
	blink(who)
	let randomDelay = 2000 + Math.random() * 5000
	setTimeout(function(){randomBlink(who)}, randomDelay)
}

export { randomBlink }
