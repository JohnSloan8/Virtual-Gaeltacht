import { c } from "./init.js"
import { setupKeyBindings, disableKeyBindings } from "./keyboard-events.js"
import { displayChoosePositionCircle } from "./choose-position-circle.js"
import { displayWaitingList, displayLeaveButton } from './events.js'

const updateAvatarState = (who, k, v) => {
  if (c.p[who] !== undefined) {
	  c.p[who].states[k] = v
  }
}

const messages = {
  'participantEntering': 'someone is entering...',
  'participantLeaving': 'someone is leaving...'
}
const updateChatState = (k, v) => {
	c[k] = v
  //console.log('k:', k)
  //console.log('v:', v)
  if (k === 'participantEntering' || k === "participantLeaving") {
    if (v) {
      disableKeyBindings();
      displayLeaveButton(false, k);
      if (!c.meHavePosition) {
        $('#otherEnteringText').text(`Please wait, ${messages[k]}`)
        $('#otherEnteringOverlay').show()
        $('#otherEnteringOverlay').css('opacity', 0.8)
      }
    } else {
      setupKeyBindings();
      setTimeout(function(){displayLeaveButton(true, k)}, 2000);
      if (!c.meHavePosition) {
        $('#otherEnteringOverlay').hide()
        $('#otherEnteringOverlay').css('opacity', 1)
        $('#choosePositionText').text("Click a new place where you wish to stand")
        displayChoosePositionCircle(c.participantList)
      }
    }
  }
}

export { updateAvatarState, updateChatState, messages }
