import TWEEN from 'https://cdn.jsdelivr.net/npm/@tweenjs/tween.js@18.5.0/dist/tween.esm.js'
import { avatarLookAt } from "../../three-js/chat/animations/avatar-look.js"
import { socketSend } from '../../web-sockets/chat/send.js'
import { updateAvatarState } from "./updates.js"
import { c } from './init.js'

const setupKeyBindings = () => {
  //console.log('in setupKeyBindings')
  document.addEventListener("keydown", setKeys)
}

const disableKeyBindings = () => {
  //console.log('in disableKeyBindings')
  document.removeEventListener("keydown", setKeys)
}

const setKeys = event => {
  if ( ['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes( event.key ) ) {
    event.preventDefault();
    lookControl(username, event.key)
  }
};

const lookControl = (who, k) => {
  if (c.participantList.length > 1) {
    let positionOfLookAt = c.reversePositions[c.p[who].states.currentlyLookingAt]
    if (c.p[who].states.currentlyLookingAtBody) {
      positionOfLookAt *= -1
    }
    let change = true
    let body = c.p[who].states.currentlyLookingAtBody
    if ( k === 'ArrowLeft' ) {
      if (body) {
        body = false
        positionOfLookAt = Math.abs(positionOfLookAt) - 1;
      } else {
        positionOfLookAt -= 1;
      }
    } else if ( k === 'ArrowRight' ) {
      if (body) {
        body = false
        positionOfLookAt = Math.abs(positionOfLookAt) + 1;
      } else {
        positionOfLookAt += 1;
      }
    } else if ( k === 'ArrowDown' ) {
      if (positionOfLookAt > 0) {
        positionOfLookAt *= -1;
        body = true
      } else {
        change = false
      }
    } else if ( k === 'ArrowUp' ) {
      if (positionOfLookAt < 0) {
        positionOfLookAt *= -1;
        body = false
      } else {
        change = false
      }
    }
    if ( positionOfLookAt === 0 ) {
      positionOfLookAt = c.participantList.length-1;
    } else if ( positionOfLookAt >= c.participantList.length ) {
      positionOfLookAt = 1;
    }
    
    if (change) {
      let lookAt = c.positions[Math.abs(positionOfLookAt)]
      avatarLookAt( username, lookAt, 500, body )
      socketSend("look", lookAt, body)
    }
  }
}

export { setupKeyBindings, disableKeyBindings }
