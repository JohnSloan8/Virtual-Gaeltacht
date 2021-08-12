import blink from "../morph/blink.js"
import { noP } from "../../scene/settings.js"
import { c.participantList } from "../../scene/components/pos-rot.js"

window.beginRandomBlinking = beginRandomBlinking
export default function beginRandomBlinking() {
	c.participantList.forEach(function(par) {
		randomBlink(par)
	})
}

window.randomBlink = randomBlink
function randomBlink(who) {
	blink(who)
	let randomDelay = 2000 + Math.random() * 5000
	setTimeout(function(){
		if (participants[who] !== undefined) {
			randomBlink(who)
		}
	}, randomDelay)
}

export { randomBlink }
