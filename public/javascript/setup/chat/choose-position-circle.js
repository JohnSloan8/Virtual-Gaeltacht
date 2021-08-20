import { c } from './init.js'
import { socketSend } from '../../web-sockets/chat/send.js'

const displayChoosePositionCircle = pL => { 
  $('.participants-names').remove()
  $('.choose-participant-location-circle').remove()
  //let waiter = c.waitingList.find(wL => wL.name === username)
  let circleDiameter = pL.length * 200 / Math.PI
  $('#choosePositionCircle').css({
    "height": circleDiameter,
    "width": circleDiameter,
  })
  $('#choosePositionOverlay').show();
  let circleCenterX = $('#choosePositionCircle').offset().left + 0.5 * circleDiameter
  let circleCenterY = $('#choosePositionCircle').offset().top + 0.5 * circleDiameter
  let participantCount = 0
  let angle = Math.PI / pL.length
  pL.forEach(function(p){
    $('#choosePositionContainer').append('<h4 style="position: absolute;" class="participants-names" id="' + p + 'Pos">' + p + '</h4>')
    let XOffset = circleCenterX + 0.5 * circleDiameter * Math.sin(participantCount * angle)
    let YOffset = circleCenterY - 0.5* circleDiameter * Math.cos(participantCount * angle)
    $('#' + p + 'Pos').offset({
      left: XOffset, 
      top: YOffset
    })

    participantCount += 1
    $('#choosePositionContainer').append('<div style="position: absolute;" class="choose-participant-location-circle" id="' + p + 'Button"></div>')
    XOffset = circleCenterX + 0.5 * circleDiameter * Math.sin(participantCount * angle)
    YOffset = circleCenterY - 0.5* circleDiameter * Math.cos(participantCount * angle)
    $('#' + p + 'Button').offset({
      left: XOffset, 
      top: YOffset
    })

    participantCount += 1
  })

  $('.choose-participant-location-circle').css("background-color", "white")
  $('.participant-names').css("color", "white")
  $('#choosePositionText').text("Click a circle where you wish to stand")

  //if (waiter !== undefined) {
    //highlightChosenSpace(waiter.requirer0, waiter.requirer1)
  //} else {
    $('.choose-participant-location-circle').on('click', function(e) {
      choosePositionEvent(e.target.id, pL)
    })
  //}
}

const choosePositionEvent = (p, pL_) => {
  let requirer0 = p.slice(0, p.length-6)
  let indexOfRequirer0 = pL_.indexOf(requirer0)
  let requirer1
  if (indexOfRequirer0 === pL_.length - 1) {
    requirer1 = pL_[0]
  } else {
    requirer1 = pL_[indexOfRequirer0+1]
  }
  highlightChosenSpace(requirer0, requirer1)
  socketSend('requestEnter', [requirer0, requirer1])
}

const highlightChosenSpace = (r0, r1) => {
  $('.choose-participant-location-circle').off('click')
  $('.choose-participant-location-circle').css('background-color', '#888')
  $('.participants-names').css('color', '#888')
  $('#' + r0 + 'Button').css('background-color', 'yellow')
  $('#' + r0 + 'Pos').css('color', 'yellow')
  $('#' + r1 + 'Pos').css('color', 'yellow')
  $('#choosePositionText').html(`Waiting for <strong style="color: yellow">${r0}</strong> or <strong style="color: yellow">${r1}</strong> to let you in...`)
}

export { displayChoosePositionCircle }
