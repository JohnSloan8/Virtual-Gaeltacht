import { c } from './settings.js'
import { socketSend } from "../../web-sockets/chat/send.js"

const setupAllEvents = () => {
  setUpAdmitRefuseEvents();
  setUpLeaveEvent();
}

function setUpAdmitRefuseEvents() {
  $('.admit-refuse').on('click', function(e) {
    e.preventDefault();
    socketSend('admitRefuse', e.target.id);
  })
}


function setUpLeaveEvent() {
  console.log('setting up leave Event')
  $('#leaveButton').on('click', function(e) {
    e.preventDefault()
  	removeParticipant(username)
  })
}

function displayWaitingList() {
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



export { displayWaitingList, setupAllEvents }
