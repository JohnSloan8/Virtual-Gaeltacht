function setUpAdmitRefuseEvents() {
  $('.admit-refuse').on('click', function(e) {
    e.preventDefault()
    admitRefuse(e.target.id)
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
  console.log('chat.waitingList:', chat.waitingList)
  if (chat.waitingList.length>0) {
    $('#whoIsWaiting').text(chat.waitingList[0])
    $('#allowEntry').show();
  } else {
    $('#allowEntry').hide();
  }
}



export { displayWaitingList }
