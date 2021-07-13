import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.125/build/three.module.js";
import { noParticipants, cameraSettings } from "../settings.js"
import { group } from "../load-scene.js"

let table 
export default function addTable() {
	table = includeTable(cameraSettings[noParticipants].radius, 32, 0)
	window.table = table
	group.add( table );
}

function includeTable( rad, sides, zRot ) {
  const geometry = new THREE.CircleGeometry(rad-0.15, 32);
	const material = new THREE.MeshBasicMaterial( { color: 0x551100 } );
	const table = new THREE.Mesh( geometry, material );
	table.rotation.set(-Math.PI/2, 0, 0)
	table.position.set(0, 1, 0)
	return table
}

export {table}
