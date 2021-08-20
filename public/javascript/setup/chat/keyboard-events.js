import TWEEN from 'https://cdn.jsdelivr.net/npm/@tweenjs/tween.js@18.5.0/dist/tween.esm.js'
import { avatarLookAt } from "../../three-js/chat/animations/avatar-look.js"
import { socketSend } from '../../web-sockets/chat/send.js'
import { updateAvatarState } from "./updates.js"
import { c } from './init.js'

const setupKeyBindings = () => {
  document.addEventListener("keydown", setKeys)
}

const disableKeyBindings = () => {
  document.removeEventListener("keydown", setKeys)
}

const setKeys = event => {
  if ( ['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes( event.key ) ) {
    event.preventDefault();
    lookControl(username, event.key)
  }
};

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

export { setupKeyBindings, disableKeyBindings }
