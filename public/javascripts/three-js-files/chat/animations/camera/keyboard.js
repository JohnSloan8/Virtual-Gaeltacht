import TWEEN from 'https://cdn.jsdelivr.net/npm/@tweenjs/tween.js@18.5.0/dist/tween.esm.js'
import { noParticipants } from "../../scene/settings.js"
import { participants } from "../../models/components/avatar.js"
import { posRot } from "../../scene/components/pos-rot.js"
import { table } from "../../scene/components/table.js"
import avatarLookAt from "../look.js"
import { sendChangeLook } from '../../../socket-logic.js'

window.cameraLookAt = cameraLookAt
function cameraLookAt(toWhom, duration) {
  for (let i=1; i<noParticipants; i++) {
    participants[i].model.traverse(function(object) {
      if (object.isMesh) {
        if (object.name !== "Wolf3D_Glasses") {
          if (i !== toWhom) {
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
    if (toWhom === -1) {
      table.material.color.set( '#772200' )
    } else {
      table.material.color.set( '#551100' )
    }
  }
  let cameraTweenRotation = new TWEEN.Tween(camera.rotation).to(posRot[noParticipants].camera.rotations[toWhom], duration)
    .easing(TWEEN.Easing.Quintic.Out)
    .easing(TWEEN.Easing.Quintic.Out)
  cameraTweenRotation.start()
}

export default function createKeyBindings() {
  document.addEventListener("keydown", function(event) {
    if ( ['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes( event.key ) ) {
      event.preventDefault();
      lookControl(0, event.key)
    }
  });
}

window.lookControl = lookControl
function lookControl(who, k) {
  console.log(' in  new look control: ', who)
  if (participants[who].states.currentlyLookingAt === -1) { // table
    if ( k === 'ArrowUp' ) {
      participants[who].states.currentlyLookingAt = participants[who].states.previouslyLookingAt;
    } else if ( k === 'ArrowLeft' ) {
      participants[who].states.currentlyLookingAt = participants[who].states.previouslyLookingAt - 1;
    } else if ( k === 'ArrowRight' ) {
      participants[who].states.currentlyLookingAt = participants[who].states.previouslyLookingAt + 1;
    }
    if ( k !== 'ArrowDown' ) {
      participants[who].states.previouslyLookingAt = -1
    }
  } else {
    participants[who].states.previouslyLookingAt = participants[who].states.currentlyLookingAt;
    if ( k === 'ArrowLeft' ) {
      participants[who].states.currentlyLookingAt -= 1;
    } else if ( k === 'ArrowRight' ) {
      participants[who].states.currentlyLookingAt += 1;
    } else if ( k === 'ArrowDown' ) {
      participants[who].states.currentlyLookingAt = -1;
    }
  }
  if ( participants[who].states.currentlyLookingAt === 0 ) {
    participants[who].states.currentlyLookingAt = noParticipants-1;
  } else if ( participants[who].states.currentlyLookingAt >= noParticipants ) {
    participants[who].states.currentlyLookingAt = 1;
  }
  avatarLookAt( 0, participants[who].states.currentlyLookingAt, 500 )
  sendChangeLook( who, participants[who].states.currentlyLookingAt )
}

export { cameraLookAt }

