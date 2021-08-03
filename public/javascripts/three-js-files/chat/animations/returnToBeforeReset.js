import { lenMorphs } from "./morph/prepare.js"
import { participants } from "../models/components/avatar.js"
import beginRandomSwaying from "./random/sway.js"
import beginRandomBlinking from "./random/blink.js"
import { startAnimation } from "../main.js"

window.returnAll = returnAll
export default function returnAll(n) {
	for(let i=0; i<n; i++) {
		returnLookingRotations(i)
		returnEyeRotations(i)
		returnRandomSway(i)
	}
	//setTimeout( function() {
		startAnimation();
		beginRandomSwaying()
		beginRandomBlinking()
	//}, 1000 )
}
window.returnAll = returnAll

function returnLookingRotations(who) {
	let h = participants[who].locationCopies.head.rotation
	participants[who].movableBodyParts.head.rotation.set(h.x, h.y, h.z)
	let s2 = participants[who].locationCopies.spine2.rotation
	participants[who].movableBodyParts.spine2.rotation.set(s2.x, s2.y, s2.z)
	let s1 = participants[who].locationCopies.spine1.rotation
	participants[who].movableBodyParts.spine1.rotation.set(s1.x, s1.y, s1.z)
}


function returnRandomSway(who) {
	participants[who].movableBodyParts.spine.rotation.z = participants[who].locationCopies.spine.rotation.z
	participants[who].movableBodyParts.neck.rotation.z = participants[who].locationCopies.neck.rotation.z
}

function returnEyeRotations(who) {
	participants[who].movableBodyParts.leftEye.lookAt(participants[who].states.focalPoint)
	participants[who].movableBodyParts.rightEye.lookAt(participants[who].states.focalPoint)
}

