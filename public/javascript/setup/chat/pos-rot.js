import { cameraSettings } from "./settings.js"
import { c } from './settings.js'

const calculatePosRot = noP => {
	organiseParticipantPositions()
	calculateCameraPosRot(noP)
	calculateParticipantsPosRot(noP)
}

function organiseParticipantPositions() {
	let indexOfParticipant = c.participantList.indexOf(username)
	let participantListClone = [...c.participantList]

	let y = participantListClone.splice(indexOfParticipant)
	let participantListOrdered = y.concat(participantListClone)
	c.positions = {}
	c.reversePositions = {}
	participantListOrdered.forEach( function(n, i) {
		c.positions[i] = n	
		c.reversePositions[n] = i	
	})
}

const calculateCameraPosRot = noP => {
	c.cameras= {
		main: {
			position: {
				x: 0,
				y: 0, //set later with ref to avatar head
				z: cameraSettings[noP].cameraZPos+cameraSettings[noP].radius,
			},
			firstEntryPosition: {
				x: 0,
				y: 2,
				z: cameraSettings[noP].radius*2.5
			},
			fov: cameraSettings[noP].cameraFov,
		},
		selfie: {
			position: {},
			fov: cameraSettings[noP].cameraFov,
		},
	};
}

const calculateParticipantsPosRot = noP => {
	let curAng = 0;
	c.p[username] = { 
		posRot: {
			position: {
				x: 0,
				z: c.cameras.main.position.z
			},
			rotation: {
				y: Math.PI
			}
		}
	}
	if (noP%2 === 0) {
		curAng = (noP - 2)/2 * cameraSettings[noP].angle
	} else {
		curAng = Math.floor((noP/2) - 1) * cameraSettings[noP].angle + cameraSettings[noP].angle/2;
	}
	for (let i=1; i<noP; i++) {
		c.p[c.positions[i]] = { 
			posRot: {
				position: {
					x: Math.round(1000 * cameraSettings[noP].radius * Math.sin(-curAng))/1000,
					z: Math.round(1000 * -cameraSettings[noP].radius * Math.cos(curAng))/1000
				},
				rotation: {
					y: curAng
				}
			}
		}
		curAng -= cameraSettings[noP].angle;
	}
}

export { calculatePosRot }
