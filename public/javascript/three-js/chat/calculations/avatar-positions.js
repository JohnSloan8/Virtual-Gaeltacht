import { c } from '../../../setup/chat/init.js'
import { cameraSettings } from "../enter/set-positions-rotations.js"

const sortParticipantList = () => {
	let indexOfParticipant = c.participantList.indexOf(username)
	let participantListClone = [...c.participantList]

	let y = participantListClone.splice(indexOfParticipant)
	let participantListOrdered = y.concat(participantListClone)
	participantListOrdered.forEach( function(n, i) {
		c.positions[i] = n	
		c.reversePositions[n] = i	
	})
}

const calculateParticipantsPositionsRotations = noP => {
	let curAng = 0;
	if (noP%2 === 0) {
		curAng = (noP - 2)/2 * cameraSettings[noP].angle
	} else {
		curAng = Math.floor((noP/2) - 1) * cameraSettings[noP].angle + cameraSettings[noP].angle/2;
	}
	for (let i=1; i<noP; i++) {
		c.p[c.positions[i]].posRot = {
			position: {
				x: Math.round(1000 * cameraSettings[noP].radius * Math.sin(-curAng))/1000,
				z: Math.round(1000 * -cameraSettings[noP].radius * Math.cos(curAng))/1000
			},
			rotation: {
				y: curAng
			}
		}
		curAng -= cameraSettings[noP].angle;
	}
}

export { sortParticipantList, calculateParticipantsPositionsRotations }
