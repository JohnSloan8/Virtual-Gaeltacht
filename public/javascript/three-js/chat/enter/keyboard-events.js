import TWEEN from 'https://cdn.jsdelivr.net/npm/@tweenjs/tween.js@18.5.0/dist/tween.esm.js'
import { avatarLookAt } from "../animations/look.js"
import { socketSend } from '../../../web-sockets/chat/send.js'
import { updateAvatarState } from "../models/states.js"
import { c } from '../../../setup/chat/settings.js'

const cameraLookAt = (toWhom, duration) => {
  try {
    c.participantList.forEach(function(p) {
      c.p[p].model.traverse(function(object) {
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
  console.log('toWhom:', toWhom)
  let cameraTweenRotation = new TWEEN.Tween(c.cameras.main.camera.rotation).to(c.cameras.main.rotations[toWhom], duration)
    .easing(TWEEN.Easing.Quintic.Out)
  cameraTweenRotation.start()
}

const createKeyBindings = () => {
  document.addEventListener("keydown", function(event) {
    if ( ['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes( event.key ) ) {
      event.preventDefault();
      lookControl(username, event.key)
    }
  });
}

const lookControl = (who, k) => {
  console.log('in lookControl')
	updateAvatarState(who, 'previouslyLookingAt', c.p[who].states.currentlyLookingAt)
  let positionOfLookAt = c.reversePositions[c.p[who].states.currentlyLookingAt]
  if ( k === 'ArrowLeft' ) {
    positionOfLookAt -= 1;
  } else if ( k === 'ArrowRight' ) {
    positionOfLookAt += 1;
  //} else if ( k === 'ArrowDown' ) {
    //c.p[who].states.currentlyLookingAt = -1;
  }
  if ( positionOfLookAt === 0 ) {
    positionOfLookAt = c.participantList.length-1;
  } else if ( positionOfLookAt >= c.participantList.length ) {
    positionOfLookAt = 1;
  }
  //if (c.p[who].states.previouslyLookingAt !== -1 && k === 'ArrowUp' ) { 
  //} else {
	updateAvatarState(who, 'currentlyLookingAt', c.positions[positionOfLookAt])
  avatarLookAt( username, c.p[who].states.currentlyLookingAt, 500 )
	socketSend("look", c.p[who].states.currentlyLookingAt)
  //}
}

export { cameraLookAt, createKeyBindings }

