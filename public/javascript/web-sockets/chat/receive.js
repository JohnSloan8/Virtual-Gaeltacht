import { c } from '../../setup/chat/settings.js'
import { loadAll } from '../../setup/chat/init.js'
import { displayWaitingList, updateEntering } from '../../setup/chat/events.js'
import { displayChoosePositionCircle } from '../../setup/chat/choose-position-circle.js'
import { resolveNewConnection } from "../../setup/chat/init.js"
import { avatarLookAt } from "../../three-js/chat/animations-movements/look.js"
import { expression } from "../../three-js/chat/animations-movements/expression.js"
import { gesture } from "../../three-js/chat/animations-movements/gesture.js"
import { avatarNodShake } from "../../three-js/chat/animations-movements/nod-shake.js"
import { addAvatar } from "../../three-js/chat/models/add-avatar.js"
import { initialAvatarStates } from "../../three-js/chat/models/states.js"

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
      c.participantList = serverData.participantList
      c.waitingList = serverData.waitingList
      if (serverData.key === 'admit') {
        c.participantList = serverData.participantList
        c.lookingAtEntry = serverData.lookingAtEntry
        c.p[serverData.admittedRefusedParticipant] = {
          states: {...initialAvatarStates}
        }
        if (username === serverData.admittedRefusedParticipant) {
          $('#choosePositionOverlay').hide()
          loadAll();
        } else {
          addAvatar(serverData.admittedRefusedParticipant)
        }
        updateEntering(true, serverData.admittedRefusedParticipant)
      } else {
        if (username === serverData.admittedRefusedParticipant) {
          $('#choosePositionText').html(`Your request was refused or timed out. You can try again.`)
          displayChoosePositionCircle(serverData.participantList)
        }
      }
      displayWaitingList();

    // PARTICIPANT REMOVED
    } else if (serverData.type === "removeParticipant" ) {
      if (username === serverData.who) {
        window.location.href = '/dashboard'
      } else {
        //participantNames = serverData.participantNames
        host = serverData.host
        if (username === host) {
          alert('you are the new host')
          $('#host').show()
        }
        removeAvatar(serverData.who)
      }

    // OTHER PARTICIPANT ACTIONS
    } else if (c.participantList !== undefined) {

      // SOMEONE ENTERS
      if (serverData.type === "newParticipantEnter" ) {
      // check if it was not just refresh
        if (c.participantList.indexOf(serverData.who) === -1) {
          addAvatar(serverData.who)
        } else {
          console.log('already in names:', serverData.name)
        }

      // LOOKS
      } else if (serverData.type === "look" ) {
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
