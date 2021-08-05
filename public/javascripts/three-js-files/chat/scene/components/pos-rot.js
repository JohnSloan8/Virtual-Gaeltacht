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

//let lookingAtEnter = {}
let names
let participantNamesArray
function organiseParticipants() {
	names = participantNames.split(',')
	console.log('names:', names)
	let namesClone = participantNames.split(',')
	let lookingAt = participantLookingAt.split(',')
	console.log('lookingAt:', lookingAt)
	let indexOfParticipant = names.indexOf(username)
	let y = namesClone.splice(indexOfParticipant)
	participantNamesArray = y.concat(namesClone)
	participantNamesArray.forEach( function(n, i) {
		positions[i] = n	
		reversePositions[n] = i	
	})
	window.participantNamesArray = participantNamesArray
}
	//names.forEach( function(p, i) {
		//if (names.includes(lookingAt[i])) {
			//lookingAtEnter[p] = participantNamesArray.indexOf(lookingAt[i])
		//} else {
			//lookingAtEnter[p] = -1
		//}
	//} )
 // //console.log('participantNamesArray:', participantNamesArray)
	//console.log('lookingAtEnter:', lookingAtEnter)
	//participantNamesArray.forEach( function(n, i) {
		//positions[i] = n	
	//})
//}

let positions = {

}
let reversePositions = {

}
window.positions = positions

//function findPositionOfNewParticipant(u) {
	//names.push(u)
	//let namesClone = [...names]
	//console.log('namesClone:', namesClone)
	//let indexOfParticipant = namesClone.indexOf(username)
	//let y = namesClone.splice(indexOfParticipant)
	//console.log('indexOfParticipant:', indexOfParticipant)
	//let newParticipantNamesArray = y.concat(namesClone)
	//let indexOfNewParticipant = newParticipantNamesArray.indexOf(u)
	//console.log('indexOfNewParticipant:', indexOfNewParticipant)
	//for (let i=noParticipants-1; i>indexOfNewParticipant; i--) {
		//positions[i] = positions[i-1]
	//}
	//positions[indexOfNewParticipant] = u
//}
export { posRot, organiseParticipants, participantNamesArray, positions, reversePositions }
