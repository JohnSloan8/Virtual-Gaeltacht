import TWEEN from 'https://cdn.jsdelivr.net/npm/@tweenjs/tween.js@18.5.0/dist/tween.esm.js'
import { easingDict, easings } from "../animations-prepare/easings.js"

window.startMouthing = startMouthing
function startMouthing(who) {
	//need to stop blinking
	c.p[who].states.speaking = true
	//c.p[who].states.expression = "neutral"
	mouth(who)
}

window.stopMouthing = stopMouthing
function stopMouthing(who) {
	c.p[who].states.speaking = false
}

window.mouth = mouth
let randomViseme
let faceMorphsTo
let randomMouthingDuration
let randomEasing
let mouthingIn
function mouth(who, final=false) {
	randomViseme =  getRandomViseme(who);
	faceMorphsTo = new Array(c.lenMorphs).fill(0);
	randomMouthingDuration = 100 + Math.random()*250

	//don't need this cause only gonne use neutral expression
	console.log('randomViseme:', c.p[who].states.expression + "_" + randomViseme)
	
	if ( final ) {
		faceMorphsTo[c.p[who].movableBodyParts.face.morphTargetDictionary[c.p[who].states.expression]] = 1;
		randomMouthingDuration = 300
	} else {
		randomMouthingDuration = 100 + Math.random()*300
		faceMorphsTo[c.p[who].movableBodyParts.face.morphTargetDictionary[c.p[who].states.expression + "_" + randomViseme]] = 1
		//faceMorphsTo[c.p[who].movableBodyParts.face.morphTargetDictionary[randomViseme]] = 0.5;
	}

	randomEasing = getRandomEasing()

	mouthingIn = new TWEEN.Tween(c.p[who].movableBodyParts.face.morphTargetInfluences).to(faceMorphsTo, randomMouthingDuration)
		.easing(easingDict[randomEasing])
		.start()
	c.p[who].states.speakingViseme = randomViseme

	mouthingIn.onComplete( function() {
		if ( c.p[who].states.speaking ) {
			mouth(who)
		} else {
			if (!final) {
				mouth(who, true)
			}
		}
	})
}

function getRandomViseme(who) {
	let vis = c.mouthedVisemes[Math.floor(Math.random()*c.mouthedVisemes.length)]
	if (vis === c.p[who].states.speakingViseme) {
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
