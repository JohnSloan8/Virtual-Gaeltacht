import { c } from "./init.js"
import { setupKeyBindings, disableKeyBindings } from "./keyboard-events.js"
import { displayChoosePositionCircle } from "./choose-position-circle.js"
import { displayWaitingList } from './events.js'

const updateAvatarState = (who, k, v) => {
	c.p[who].states[k] = v
}

const updateChatState = (k, v) => {
	c[k] = v
  if (k === 'newParticipantEntering') {
    if (v) {
      disableKeyBindings();
      if (!c.meHavePosition) {
        $('#otherEnteringText').text(`Please wait, someone else is joining...`)
        $('#otherEnteringOverlay').show()
        $('#otherEnteringOverlay').css('opacity', 0.8)
      }
    } else {
      setupKeyBindings();
      if (!c.meHavePosition) {
        //$('#otherEnteringText').text(`Please wait: ${c.entering.who} is joining...`)
        $('#otherEnteringOverlay').hide()
        $('#otherEnteringOverlay').css('opacity', 1)
        displayChoosePositionCircle(c.participantList)
      }
    }
  }
}

export { updateAvatarState, updateChatState }
