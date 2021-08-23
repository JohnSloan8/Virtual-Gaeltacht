import { c } from './init.js'

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

const highlightExpressionGesture = (emotionGesture, expression, start) => {
  console.log('emotionGesture:', emotionGesture)
  console.log('expression:', expression)
  console.log('start:', start)
	if (start) {
		$('#' + expression).parent().removeClass('bg-dark')	
		$('#' + expression).parent().addClass('bg-light')	
	} else {
		$('#' + expression).parent().removeClass('bg-light')	
		$('#' + expression).parent().addClass('bg-dark')	
	}
}

const displayLeaveButton = (display, enterLeave) => {
  if (display) {
    $('#leaveModalButton').show()
    $('#someoneEntering').hide()
  } else {
    $('#leaveModalButton').hide()
    $('#leaveChatModal').modal('hide')
    $('#someoneEntering').text(`${enterLeave}...`)
    $('#someoneEntering').show()
  }
}

export { displayWaitingList, highlightExpressionGesture, displayLeaveButton }
