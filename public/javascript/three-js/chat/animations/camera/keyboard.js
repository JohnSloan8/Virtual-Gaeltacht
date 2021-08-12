import TWEEN from 'https://cdn.jsdelivr.net/npm/@tweenjs/tween.js@18.5.0/dist/tween.esm.js'
import { noP } from "../../scene/settings.js"
import { participants } from "../../models/components/avatar.js"
import { c.participantList, posRot, positions, reversePositions } from "../../scene/components/pos-rot.js"
import { table } from "../../scene/components/table.js"
import avatarLookAt from "../look.js"
import { sendChangeLook } from '../../../../web-sockets/chat/socket-logic.js'

window.cameraLookAt = cameraLookAt
function cameraLookAt(toWhom, duration) {
  try {
    c.participantList.forEach(function(p) {
      participants[p].model.traverse(function(object) {
        if (object.isMesh) {
          if (object.name !== "Wolf3D_Glasses") {
            if (p !== toWhom) {
              object.material.color = {
                r: 0.667,
                g: 0.667,
                b: 0.667,
                isColor: true
              }
            } else {
              object.material.color = {
                r: 1.33,
                g: 1.33,
                b: 1.33,
                isColor: true
              }
            }
          }
        }
      });
    })
  } catch {
    console.log('model not available')
  }
  let cameraTweenRotation = new TWEEN.Tween(camera.rotation).to(posRot[c.participantList.length].camera.rotations[toWhom], duration)
    .easing(TWEEN.Easing.Quintic.Out)
  cameraTweenRotation.start()
}

export default function createKeyBindings() {
  document.addEventListener("keydown", function(event) {
    if ( ['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes( event.key ) ) {
      event.preventDefault();
      lookControl(username, event.key)
    }
  });
}

window.lookControl = lookControl
function lookControl(who, k) {
  //if (participants[who].states.currentlyLookingAt === -1) { // table
    //if ( k === 'ArrowUp' ) {
      //participants[who].states.currentlyLookingAt = participants[who].states.previouslyLookingAt;
    //} else if ( k === 'ArrowLeft' ) {
      //participants[who].states.currentlyLookingAt = participants[who].states.previouslyLookingAt - 1;
    //} else if ( k === 'ArrowRight' ) {
      //participants[who].states.currentlyLookingAt = participants[who].states.previouslyLookingAt + 1;
    //}
    //if ( k !== 'ArrowDown' ) {
      //participants[who].states.previouslyLookingAt = -1
    //}
  //} else {
  participants[who].states.previouslyLookingAt = participants[who].states.currentlyLookingAt;
  let positionOfLookAt = reversePositions[participants[who].states.currentlyLookingAt]
  if ( k === 'ArrowLeft' ) {
    positionOfLookAt -= 1;
  } else if ( k === 'ArrowRight' ) {
    positionOfLookAt += 1;
  //} else if ( k === 'ArrowDown' ) {
    //participants[who].states.currentlyLookingAt = -1;
  }
  if ( positionOfLookAt === 0 ) {
    positionOfLookAt = c.participantList.length-1;
  } else if ( positionOfLookAt >= c.participantList.length ) {
    positionOfLookAt = 1;
  }
  participants[who].states.currentlyLookingAt = positions[positionOfLookAt]
  //if (participants[who].states.previouslyLookingAt !== -1 && k === 'ArrowUp' ) { 
  //} else {
  avatarLookAt( username, participants[who].states.currentlyLookingAt, 500 )
  sendChangeLook( who, participants[who].states.currentlyLookingAt )
  //}
}

export { cameraLookAt }

