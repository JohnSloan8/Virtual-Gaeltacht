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
        if (messageData.type === "newConnection" ) {
          // check if it was not just refresh
          if (participantNamesArray.indexOf(messageData.name) === -1) {
            addAvatar(messageData.name)
          } else {
            console.log('refresh by:', messageData.name)
          }
        } else if (messageData.type === "look" ) {
          avatarLookAt(participantNamesArray.indexOf(messageData.who), participantNames.indexOf(messageData.whom), 500)
        } else if (messageData.type === "expression" ) {
          expression(participantNames.indexOf(messageData.who), messageData.expression)
        } else if (messageData.type === "gesture" ) {
          gesture(participantNames.indexOf(messageData.who), messageData.gesture, 2000)
        } else if (messageData.type === "nodShake" ) {
          avatarNodShake(participantNames.indexOf(messageData.who), messageData.nodShake)
        }
    });

}

function sendChangeLook( who, whom ) {
  socket.send( JSON.stringify({
    chatID: window.location.pathname,
    who: username,
    whom: participantNamesArray[whom] ? participantNamesArray[whom] : "table",
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

export { sendChangeLook, sendExpression, sendGesture, sendNodShake }
