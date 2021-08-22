import { c } from '../../setup/chat/init.js'
import { cameraEnter } from '../../three-js/chat/enter/camera-enter.js'
import { displayWaitingList } from '../../setup/chat/events.js'
import { displayChoosePositionCircle } from '../../setup/chat/choose-position-circle.js'
import { resolveNewConnection } from "../../setup/chat/init.js"
import { avatarLookAt } from "../../three-js/chat/animations/avatar-look.js"
import { expression } from "../../three-js/chat/animations/expression.js"
import { gesture } from "../../three-js/chat/animations/gesture.js"
import { avatarNodShake } from "../../three-js/chat/animations/nod-shake.js"
import { addAvatar } from "../../three-js/chat/models/add-avatar.js"
import { removeAvatar } from "../../three-js/chat/models/remove-avatar.js"

// CREATE WEBSOCKET CONNECTION
var socket
const initSocket = () => {
    
  // OPEN NEW CONNECTION
  socket = new WebSocket('ws://localhost:8080')
  socket.addEventListener('open', function (event) {
    socket.send(JSON.stringify({
      type: 'newConnection',
      who: username,
      chatURL: window.location.pathname
    }));
  });

  // LISTEN FOR MESSAGES
  socket.addEventListener('message', function (event) {
    let serverData = JSON.parse(event.data)
    console.log('serverData:', serverData)

    // NEW CONNECTION
    if (serverData.type === "newConnection" ) {
      resolveNewConnection(serverData) 

    // REQUESTED ENTRY
    } else if (serverData.type === "requestEnter" ) {
      console.log('entry requested:', serverData.waitingList)
      c.waitingList = serverData.waitingList
      displayWaitingList()

    // ADMITTED OR REFUSED
    } else if (serverData.type === "admitRefuse" ) {
      c.waitingList = serverData.waitingList
      if (serverData.key === 'admit') {
        c.participantList = serverData.participantList
        displayWaitingList()
        c.lookingAtEntry = serverData.lookingAtEntry
        if (username === serverData.admittedRefusedParticipant) {
		      cameraEnter()
        } else {
          addAvatar(serverData.admittedRefusedParticipant)
        }
      } else {
        if (username === serverData.admittedRefusedParticipant) {
          $('#choosePositionText').html(`Your request was refused or timed out. You can try again.`)
          displayChoosePositionCircle(serverData.participantList)
        }
        console.log('waitingList:', c.waitingList)
        displayWaitingList()
      }

    // PARTICIPANT REMOVED
    } else if (serverData.type === "removeParticipant" ) {
      if (username === serverData.who) {
        window.location.href = '/dashboard'
      } else {
        c.participantList = serverData.participantList
        removeAvatar(serverData.who)
      }

    // OTHER PARTICIPANT ACTIONS
    } else if (c.participantList !== undefined) {

      // LOOKS
      if (serverData.type === "look" ) {
        avatarLookAt(serverData.who, serverData.key, 500)
      
      // FACIAL EXPRESSIONS
      } else if (serverData.type === "expression" ) {
        expression(serverData.who, serverData.key)
      
      // GESTURES
      } else if (serverData.type === "gesture" ) {
        gesture(serverData.who, serverData.key, 2000)
      
      // NODS OR SHAKES HEAD
      } else if (serverData.type === "nodShake" ) {
        avatarNodShake(serverData.who, serverData.key)
      }
    }
  });
}

export { initSocket, socket }
