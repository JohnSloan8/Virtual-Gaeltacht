import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.125/build/three.module.js";
import { c } from "../../../setup/chat/init.js"

const	initialAvatarStates = {
	currentlyLookingAt: null,
	currentlyLookingAtBody: false,
	previouslyLookingAt: null,
	expression: 'smile',
	speaking: false,
	mouthing: false,
	speakingViseme: null,
	blinking: false,
	changingExpression: false,
	gesturing: false,
	focalPoint: new THREE.Vector3(0, 1.7, 0)
}

export { initialAvatarStates }
