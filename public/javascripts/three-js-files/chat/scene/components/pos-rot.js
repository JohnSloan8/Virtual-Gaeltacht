import { cameraSettings } from "../settings.js"

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
			rotations: {},
		},
		cameraStart: {
			position: {
				x: 0,
				y: 2,
				z: cameraSettings[noP].radius*2
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

export { posRot }
