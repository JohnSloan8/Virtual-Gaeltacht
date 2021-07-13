import { posRot } from "../../scene/components/pos-rot.js"
import { camera, centralPivotGroup } from "../../scene/components/camera.js";
import { cameraSettings } from "../../scene/settings.js"
import easingDict from "../easings.js"
import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.125/build/three.module.js";
import TWEEN from 'https://cdn.jsdelivr.net/npm/@tweenjs/tween.js@18.5.0/dist/tween.esm.js'
import { noParticipants } from "../../scene/settings.js"

window.cameraEnter = cameraEnter
export default function cameraEnter(amount=0.7, duration=6000, easing="cubicIn") {
	let direction = new THREE.Vector3();
	let headPos = participants[0].movableBodyParts.head.getWorldPosition(direction)
	let cameraEnterRotateTween = new TWEEN.Tween(centralPivotGroup.rotation).to({y: -2*Math.PI}, duration)
	.easing(easingDict["cubicInOut"])
	.start()

	let cameraEnterPositionTween = new TWEEN.Tween(camera.position).to({z: posRot[noParticipants][0].z+0.1, y: posRot[noParticipants].camera.y+0.05 }, duration)
	.easing(easingDict["quinticIn"])
	.start()

	// put fadeIn of black and then dashboard appearing here
	//setTimeout( function(){

	//}, )

}
