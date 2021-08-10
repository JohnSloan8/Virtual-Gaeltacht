import avatarLookAt from "./chat/animations/look.js"
import { participantNamesArray } from "./chat/scene/components/pos-rot.js"
import addAvatar from "./chat/models/components/addAvatar.js"
import { init } from "./chat/main.js"
import { chat } from "./chat/scene/settings.js"

// Create WebSocket connection.
var socket

export default function initSocket() {
    
  socket = new WebSocket('ws://localhost:8080')
  socket.addEventListener('open', function (event) {
      socket.send(JSON.stringify({
          type: "newConnection",
          newConnection: true,
          name: username,
          chatURL: window.location.pathname
      }));
  });

  // Listen for messages
  socket.addEventListener('message', function (event) {
    let messageData = JSON.parse(event.data)
    console.log('messageData:', messageData)
    if (messageData.type === "newConnection" ) {
      chat.waitingList = messageData.waitingList
      if ( host === username || firstEnter !== "true" ) {
        init()
      } else {
        requestEnter(username)
        $('#waitOverlay').show()
      }
      if ( host === username) {
        setUpAdmitRefuseEvents();
      }
    } else if (messageData.type === "requestEnter" ) {
      if (host === username) {
        console.log('entry requested')
        chat.waitingList = messageData.waitingListArray
        if (!chat.newParticipantEntering) {
          displayWaitingList()
        }
      }
    } else if (messageData.type === "admitRefuse" ) {
      console.log('socket admitRefuse')
      if (host === username) {
        chat.waitingList = messageData.waitingListArray
      }
      if (messageData.admit) {
        participantNames += "," + messageData.newParticipant
        participantLookingAt += ","
        if (username === messageData.newParticipant) {
          $('#waitOverlay').hide()
          init();
        }
        if (host === username) {
          $('#allowEntry').hide();
          chat.newParticipantEntering = true;
        } 
      } else {
        if (host === username) {
          chat.newParticipantEntering = false;
          displayWaitingList();
        } 
      }
    } else if (participantNamesArray !== undefined) {

      if (messageData.type === "newParticipantEnter" ) {
      // check if it was not just refresh
        if (participantNamesArray.indexOf(messageData.name) === -1) {
          addAvatar(messageData.who)
        } else {
          console.log('already in names:', messageData.name)
        }
      } else if (messageData.type === "look" ) {
        avatarLookAt(messageData.who, messageData.whom, 500)
      } else if (messageData.type === "expression" ) {
        expression(messageData.who, messageData.expression)
      } else if (messageData.type === "gesture" ) {
        gesture(messageData.who, messageData.gesture, 2000)
      } else if (messageData.type === "nodShake" ) {
        avatarNodShake(messageData.who, messageData.nodShake)
      }
    }
  });
}

function sendChangeLook( who, whom ) {
  socket.send( JSON.stringify({
    chatID: window.location.pathname,
    who: username,
    whom: whom,
    type: "look",
    timestamp: new Date()
  }))
}

function sendExpression( who, expression ) {
  socket.send( JSON.stringify({
    chatID: window.location.pathname,
    who: username,
    expression: expression,
    type: "expression",
    timestamp: new Date()
  }))
}

function sendGesture( who, gesture ) {
  socket.send( JSON.stringify({
    chatID: window.location.pathname,
    who: username,
    gesture: gesture,
    type: "gesture",
    timestamp: new Date()
  }))
}

function sendNodShake( who, nodShake ) {
  socket.send( JSON.stringify({
    chatID: window.location.pathname,
    who: username,
    nodShake: nodShake,
    type: "nodShake",
    timestamp: new Date()
  }))
}

function sendNewParticipantEnter( who ) {
  socket.send( JSON.stringify({
    chatID: window.location.pathname,
    who: username,
    newParticipant: true,
    type: "newParticipantEnter",
    timestamp: new Date()
  }))
}

function requestEnter( who ) {
  socket.send( JSON.stringify({
    chatID: window.location.pathname,
    who: username,
    requestEnter: true,
    type: "requestEnter",
    timestamp: new Date()
  }))
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

function setUpAdmitRefuseEvents() {
  $('.admit-refuse').on('click', function(e) {
    e.preventDefault()
    admitRefuse(e.target.id)
  })
}

function admitRefuse(aR) {
  socket.send(JSON.stringify({
    chatID: window.location.pathname,
    who: chat.waitingList[0],
    admitRefuse: true,
    type: "admitRefuse",
    admit: (aR === "admit") ? true: false,
    timestamp: new Date()
  }))
}

export { displayWaitingList, sendChangeLook, sendExpression, sendGesture, sendNodShake, sendNewParticipantEnter }
