import TWEEN from 'https://cdn.jsdelivr.net/npm/@tweenjs/tween.js@18.5.0/dist/tween.esm.js'
import { easingDict, easings } from "./easings.js"
import { c } from '../../../setup/chat/init.js'
import { updateAvatarState } from "../../../setup/chat/updates.js"

window.mouth = mouth
let randomViseme
let faceMorphsTo
let randomMouthingDuration
let randomEasing
let mouthingIn
function mouth(who, final=false) {
	if ( c.p[who] !== undefined ) {
		updateAvatarState(who, 'mouthing', true)
		randomViseme =  getRandomViseme(who);
		faceMorphsTo = new Array(c.lenMorphs).fill(0);
		randomMouthingDuration = 100 + Math.random()*250

		//don't need this cause only gonne use neutral expression
		//console.log('randomViseme:', c.p[who].states.expression + "_" + randomViseme)
		
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
		updateAvatarState(who, 'speakingViseme', randomViseme)

		mouthingIn.onComplete( function() {
			if ( c.p[who].states.speaking ) {
				mouth(who)
			} else {
				if (!final) {
					mouth(who, true)
				} else {
					updateAvatarState(who, 'mouthing', false)
				}
			}
		})
	}
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
