import { cameraSettings } from "../settings.js"
import { noParticipants	} from "../../scene/settings.js"

var posRot = {}
window.posRot = posRot
export default function calculatePosRot(noP) {
	let curAng = 0;
	posRot[noP] = {
		camera: {
			x: 0,
			y: 0, //set later with ref to avatar head
			z: cameraSettings[noP].cameraZPos+cameraSettings[noP].radius,
			fov: cameraSettings[noP].cameraFov,
			rotations: {
				0: {
					x: 0,
					y: 0,
					z: 0
				}
			}
		},
		cameraStart: {
			position: {
				x: 0,
				y: 2,
				z: cameraSettings[noP].radius*2.5
			},
		},
		cameraMe: {
			position: {
				x: 0,
				y: 2,
				z: cameraSettings[noP].radius*2.5
			},
		},
		0: {
			x: 0,
			z: cameraSettings[noP].radius,
			neutralYrotation: -Math.PI
		}
	};

	if (noP%2 === 0) {
		curAng = (noP - 2)/2 * cameraSettings[noP].angle
	} else {
		curAng = Math.floor((noP/2) - 1) * cameraSettings[noP].angle + cameraSettings[noP].angle/2;
	}
	for (let i=1; i<noP; i++) {
		posRot[noP][i] = {
			x: Math.round(1000 * cameraSettings[noP].radius * Math.sin(-curAng))/1000,
			z: Math.round(1000 * -cameraSettings[noP].radius * Math.cos(curAng))/1000,
			neutralYrotation: curAng
		}
		curAng -= cameraSettings[noP].angle;
	}
	return posRot
}

let names
let lookingAtEnter = {}
let positions = {}
let reversePositions = {}
window.positions = positions
let participantNamesArray
function organiseParticipants() {
	names = participantNames.split(',')
	console.log('names:', names)
	let namesClone = participantNames.split(',')
	let lookingAt = participantLookingAt.split(',')
	//console.log('lookingAt:', lookingAt)
	let indexOfParticipant = names.indexOf(username)

	let y = namesClone.splice(indexOfParticipant)
	participantNamesArray = y.concat(namesClone)
	calculatePositions();
	names.forEach( function(p, i) {
		if (names.includes(lookingAt[i])) {
			lookingAtEnter[p] = lookingAt[i]
		} else {
			if (participantNamesArray.length === 1) {
				lookingAtEnter[p] = p
			} else if (names[0] === p) {
				lookingAtEnter[p] = names[1]
			} else {
				lookingAtEnter[p] = names[0]
			}
		}
	})
}

function calculatePositions() {
	participantNamesArray.forEach( function(n, i) {
		positions[i] = n	
		reversePositions[n] = i	
	})
	//console.log('positions:', positions)
}

function findPositionOfNewParticipant(u) {
	names.push(u)
	//console.log('names:', names)
	let namesClone = [...names]
	//console.log('namesClone:', namesClone)
	let indexOfParticipant = namesClone.indexOf(username)
	let y = namesClone.splice(indexOfParticipant)
	//console.log('indexOfParticipant:', indexOfParticipant)
	participantNamesArray = y.concat(namesClone)
	//console.log('participantNamesArray:', participantNamesArray)
	let indexOfNewParticipant = participantNamesArray.indexOf(u)
	//console.log('indexOfNewParticipant:', indexOfNewParticipant)
	calculatePositions();
}

export { posRot, organiseParticipants, participantNamesArray, positions, reversePositions, lookingAtEnter, names, findPositionOfNewParticipant }
