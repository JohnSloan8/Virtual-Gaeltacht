import { c } from "../../../setup/chat/settings.js"

const	initialAvatarStates = {
	currentlyLookingAt: null,
	previouslyLookingAt: null,
	expression: 'half_neutral',
	speaking: false,
	speakingViseme: null,
	blinking: false,
	changingExpression: false,
	gesturing: false
}

const updateAvatarState = (who, k, v) => {
	//console.log('updateState:  ', who, k, v)
	c.p[who].states[k] = v
}

export {
	initialAvatarStates,
	updateAvatarState
}
