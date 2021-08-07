import avatarLookAt from "./chat/animations/look.js"
import { participantNamesArray } from "./chat/scene/components/pos-rot.js"
import addAvatar from "./chat/models/components/addAvatar.js"

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

export { sendChangeLook, sendExpression, sendGesture, sendNodShake, sendNewParticipantEnter }
