// MAIN CHAT OBJECT
const c = {
	p: {}, // participants
	entering: {
		me: false,
		other: false,
		who: null
	}
}
window.c = c

const cameraSettings = {
	neutralFocus: (0, 1.59, 0),
	1: {
		radius: 0.5,
		cameraZPos: 0.2,
		cameraFov: 40,
		angle: 0,
	},
	2: {
		radius: 0.5,
		cameraZPos: 0.2,
		cameraFov: 40,
		angle: 0,
	},
	3: {
		radius: 0.5,
		cameraZPos: 0.3,
		cameraFov: 40,
		angle: 2*Math.PI/3,
	},
	4: {
		radius: 0.65,
		cameraZPos: 0.4,
		cameraFov: 40,
		angle: 2*Math.PI/5,
	},
	5: {
		radius: 0.75,
		cameraZPos: 0.5,
		cameraFov: 40,
		angle: Math.PI/3,
	},
	6: {
		radius: 0.8,
		cameraZPos: 0.6,
		cameraFov: 40,
		angle: 2 * Math.PI/7,
	},
	7: {
		radius: 0.9,
		cameraZPos: 0.65,
		cameraFov: 40,
		angle: Math.PI/4,
	},
	8: {
		radius: 1,
		cameraZPos: 0.7,
		cameraFov: 40,
		angle: 2 *Math.PI/9,
	},
	9: {
		radius: 1.05,
		cameraZPos: 0.95,
		cameraFov: 40,
		angle: Math.PI/5,
	},
	10: {
		radius: 1.1,
		cameraZPos: 1,
		cameraFov: 40,
		angle: 3*Math.PI/17,
	}
}

export {c, cameraSettings}