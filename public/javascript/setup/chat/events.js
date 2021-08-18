import { c } from './settings.js'
import { socketSend } from "../../web-sockets/chat/send.js"

const setupAllEvents = () => {
  setUpAdmitRefuseEvents();
  setUpLeaveEvent();
}

const setUpAdmitRefuseEvents = () => {
  $('.admit-refuse').on('click', function(e) {
    e.preventDefault();
    socketSend('admitRefuse', e.target.id);
  })
}

const setUpLeaveEvent = () => {
  console.log('setting up leave Event')
  $('#leaveButton').on('click', function(e) {
    e.preventDefault()
  	removeParticipant(username)
  })
}

const displayWaitingList = () => {
  $('#allowEntry').hide();
  if (c.waitingList.length > 0) {
    if (username === c.waitingList[0].requirer0 || username === c.waitingList[0].requirer1) {
      if (username === c.waitingList[0].requirer0) {
        $('#allowEntry').removeClass('allow-entry-right');
        $('#allowEntry').addClass('allow-entry-left');
      } else {
        $('#allowEntry').removeClass('allow-entry-left');
        $('#allowEntry').addClass('allow-entry-right');
      }
      $('#whoIsWaiting').html(`<strong style="color: yellow">${c.waitingList[0].name}&nbsp</strong> wants to join`)
      $('#allowEntry').show();
    }
  } else {
    $('#allowEntry').hide();
  }
}

const updateEntering = ( entering, who ) => {
  if (entering) {
    if ( who === username ) {
      c.entering = {
        me: true,
        other: false,
        who: who
      }
    } else {
      c.entering = {
        me: false,
        other: true,
        who: who
      }
    }
    if (!c.participantList.includes(username)) {
      $('#otherEnteringText').text(`Please wait: ${c.entering.who} is joining...`)
      $('#otherEnteringOverlay').show()
      $('#otherEnteringOverlay').css('opacity', 0.8)
    }
  } else {
    c.entering = {
      me: false,
      other: false,
      who: null
    }
    if (!c.participantList.includes(username)) {
      $('#otherEnteringText').text(`Please wait...`)
      $('#otherEnteringOverlay').hide()
    }
  }
}

export { displayWaitingList, setupAllEvents, updateEntering }
