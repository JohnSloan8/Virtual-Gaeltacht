import { c } from "./init.js"
import { setupKeyBindings, disableKeyBindings } from "./keyboard-events.js"
import { displayChoosePositionCircle } from "./choose-position-circle.js"
import { displayWaitingList, displayLeaveButton } from './events.js'

const updateAvatarState = (who, k, v) => {
	c.p[who].states[k] = v
}

const updateChatState = (k, v) => {
	c[k] = v
  if (k === 'newParticipantEntering') {
    if (v) {
      disableKeyBindings();
      displayLeaveButton(false);
      if (!c.meHavePosition) {
        $('#otherEnteringText').text(`Please wait, someone else is joining...`)
        $('#otherEnteringOverlay').show()
        $('#otherEnteringOverlay').css('opacity', 0.8)
      }
    } else {
      setupKeyBindings();
      displayLeaveButton(true);
      if (!c.meHavePosition) {
        $('#otherEnteringOverlay').hide()
        $('#otherEnteringOverlay').css('opacity', 1)
        $('#choosePositionText').text("Click a new place where you wish to stand")
        displayChoosePositionCircle(c.participantList)
      }
    }
  } else if (k === 'newParticipantEntering' || k === 'newParticipantEntering') {
    if (v) {
      disableKeyBindings();
      displayLeaveButton(false);
    } else {
      setupKeyBindings();
      displayLeaveButton(true);
    }
  }
}

export { updateAvatarState, updateChatState }
