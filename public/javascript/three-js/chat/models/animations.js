import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.125/build/three.module.js";
import { baseActions, additiveActions } from "./settings.js"
import { animations } from "./load-models.js"

let numAnimations, clip, name, action;
const addAnimations = n => {
	c.p[n].mixer = new THREE.AnimationMixer(c.p[n].model);
	numAnimations = animations.length;
	c.p[n]['allActions'] = [];
	for (let j = 0; j !== numAnimations; ++j) {
		clip = animations[j].clone();
		name = clip.name;
		if ( baseActions[ name ] ) {
			const action = c.p[n].mixer.clipAction( clip );
			activateAction( action );
			baseActions[ name ].action = action;
			c.p[n]['allActions'].push(action);
		} else if ( additiveActions[ name ] ) {
			// Make the clip additive and remove the reference frame
			THREE.AnimationUtils.makeClipAdditive( clip );
			if ( clip.name.endsWith( '_pose' ) ) {
				clip = THREE.AnimationUtils.subclip( clip, clip.name, 2, 3, 30 );
			}
			const action = c.p[n].mixer.clipAction( clip );
			activateAction( action );
			additiveActions[ name ].action = action;
			c.p[n]['allActions'].push(action);
		}
	}
}

const activateAction = action => {
	const clip = action.getClip();
	const settings = baseActions[ clip.name ] || additiveActions[ clip.name ];
	setWeight( action, settings.weight );
	action.play();
}

const setWeight = (action, weight) => {
	action.enabled = true;
	action.setEffectiveTimeScale( 1 );
	action.setEffectiveWeight( weight );
}

export { addAnimations }
