import TWEEN from 'https://cdn.jsdelivr.net/npm/@tweenjs/tween.js@18.5.0/dist/tween.esm.js'
import easingDict from "../easings.js"
import { participants } from "../../models/components/avatar.js"
import { mouthedVisemes } from "../settings.js"
import { easings } from "../settings.js"
import { lenMorphs } from "../morph/prepare.js"

window.startMouthing = startMouthing
function startMouthing(who) {
	console.log('mouthedVisemes:', mouthedVisemes)
	//need to stop blinking
	participants[who].states.speaking = true
	//participants[who].states.expression = "neutral"
	mouth(who)
}

window.stopMouthing = stopMouthing
function stopMouthing(who) {
	participants[who].states.speaking = false
}

window.mouth = mouth
let randomViseme
let faceMorphsTo
let randomMouthingDuration
let randomEasing
let mouthingIn
function mouth(who, final=false) {

	randomViseme =  getRandomViseme(who);
	faceMorphsTo = new Array(lenMorphs).fill(0);
	randomMouthingDuration = 100 + Math.random()*250

	//don't need this cause only gonne use neutral expression
	console.log('randomViseme:', participants[who].states.expression + "_" + randomViseme)
	
	if ( final ) {
		faceMorphsTo[participants[who].movableBodyParts.face.morphTargetDictionary[participants[who].states.expression]] = 1;
		randomMouthingDuration = 300
	} else {
		randomMouthingDuration = 100 + Math.random()*300
		faceMorphsTo[participants[who].movableBodyParts.face.morphTargetDictionary[participants[who].states.expression + "_" + randomViseme]] = 1
		//faceMorphsTo[participants[who].movableBodyParts.face.morphTargetDictionary[randomViseme]] = 0.5;
	}

	randomEasing = getRandomEasing()

	mouthingIn = new TWEEN.Tween(participants[who].movableBodyParts.face.morphTargetInfluences).to(faceMorphsTo, randomMouthingDuration)
		.easing(easingDict[randomEasing])
		.start()
	participants[who].states.speakingViseme = randomViseme

	mouthingIn.onComplete( function() {
		if ( participants[who].states.speaking ) {
			mouth(who)
		} else {
			if (!final) {
				mouth(who, true)
			}
		}
	})
}

function getRandomViseme(who) {
	let vis = mouthedVisemes[Math.floor(Math.random()*mouthedVisemes.length)]
	if (vis === participants[who].states.speakingViseme) {
		if (vis === "viseme_sil") {
			return "viseme_aa";
		} else {
			return "viseme_sil";
		}
	} else {
		return vis
	}
}

function getRandomEasing() {
	return easings[Math.floor(Math.random()*easings.length)]
}

export { mouth }
