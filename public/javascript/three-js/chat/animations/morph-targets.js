const expressionMorphs = {
	"neutral": {
		"browOuterUpLeft": 0, //need this for preparing expressions
	},
	"sad": {
		"browOuterUpLeft": -0.25,
		"browOuterUpRight": -0.25,
		"eyesLookDown": 0.25,
		"cheekSquintLeft": -0.25,
		"cheekSquintRight": -0.25,
		"mouthRollLower": 0.5,
		"mouthRollUpper": 0.25,
		"mouthFrownLeft": 0.667,
		"mouthFrownRight": 0.667,
		"mouthSmileLeft": -0.15,
		"mouthSmileRight": -0.15,
		"mouthPressRight": -0.15,
		"mouthPressLeft": -0.15,
		"mouthLowerDownLeft": 0.15,
		"mouthLowerDownRight": 0.15,
		"mouthDimpleLeft": -0.15,
		"mouthDimpleRight": -0.15,
		"jawForward": 0.5,
	},
	"smile": {
		"cheekSquintLeft": 0.5,
		"cheekSquintRight": 0.5,
		"mouthDimpleLeft": 0.33,
		"mouthDimpleRight": 0.33,
		"mouthSmileLeft": 0.33,
		"mouthSmileRight": 0.33,
		"mouthRollLower": 0.25,
		"mouthRollUpper": -0.25,
	},
	"bigSmile": {
		"cheekSquintLeft": 0.75,
		"cheekSquintRight": 0.75,
		"mouthDimpleLeft": 0.5,
		"mouthDimpleRight": 0.5,
		"mouthSmileLeft": 0.5,
		"mouthSmileRight": 0.5,
		"mouthRollUpper": -0.5,
		"mouthRollLower": 0.5,
		"browInnerUp": 0.2,
		"browOuterUpLeft": 0.2,
		"browOuterUpRight": 0.2,
		"mouthOpen": 0.33,
		"eyeWideLeft": 0.25,
		"eyeWideRight": 0.25,
		"jawOpen": 0.25,
	},
	'surprise': {
		"cheekSquintLeft": -0.5,
		"cheekSquintRight": -0.5,
		"browInnerUp": 1,
		"browOuterUpLeft": 1,
		"browOuterUpRight": 1,
		"eyeWideLeft": 0.5,
		"eyeWideRight": 0.5,
		"mouthShrugLower": 0.5,
		"jawOpen": 1,
		"jawForward": 0.5,
	}
}
window.expressionMorphs = expressionMorphs

var jawNeeded = {
	"smile": false,
	"bigSmile": true,
	"surprise": true,
	"sad": false,
}

export { expressionMorphs, jawNeeded }
