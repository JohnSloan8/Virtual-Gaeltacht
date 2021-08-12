import { c } from '../../setup/chat/settings.js'
import { resolveNewConnection } from "../../setup/chat/init.js"

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
      if (host === username) {
        console.log('entry requested')
        chat.waitingList = serverData.waitingListArray
        if (!chat.newParticipantEntering) {
          displayWaitingList()
        }
      }

    // ADMITTED OR REFUSED
    } else if (serverData.type === "admitRefuse" ) {
      console.log('socket admitRefuse')
      if (host === username) {
        chat.waitingList = serverData.waitingListArray
      }
      if (serverData.admit) {
        participantNames += "," + serverData.newParticipant
        participantLookingAt += ","
        if (username === serverData.newParticipant) {
          $('#waitOverlay').hide()
          init();
        }
        if (host === username) {
          $('#allowEntry').hide();
          if (!chat.participantLeaving) {
            chat.newParticipantEntering = true;
          } 
        } 
      } else {
        if (host === username) {
          chat.newParticipantEntering = false;
          displayWaitingList();
        } 
      }

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
        if (c.participantList.indexOf(serverData.name) === -1) {
          addAvatar(serverData.who)
        } else {
          console.log('already in names:', serverData.name)
        }

      // LOOKS
      } else if (serverData.type === "look" ) {
        avatarLookAt(serverData.who, serverData.whom, 500)
      
      // FACIAL EXPRESSIONS
      } else if (serverData.type === "expression" ) {
        expression(serverData.who, serverData.expression)
      
      // GESTURES
      } else if (serverData.type === "gesture" ) {
        gesture(serverData.who, serverData.gesture, 2000)
      
      // NODS OR SHAKES HEAD
      } else if (serverData.type === "nodShake" ) {
        avatarNodShake(serverData.who, serverData.nodShake)
      }
    }
  });
}

export { initSocket }
