import avatarLookAt from "./chat/animations/look.js"

// Create WebSocket connection.
var socket

export default function initSocket() {
    
    socket = new WebSocket('ws://localhost:8080')
    socket.addEventListener('open', function (event) {
        socket.send(JSON.stringify({
            newConnection: true,
            name: username,
			      chatURL: window.location.pathname
        }));
    });

    // Listen for messages
    socket.addEventListener('message', function (event) {
        console.log('Message from server ', event.data);
        let messageData = JSON.parse(event.data)
        console.log('messageData: ', messageData)
        console.log('messageData.type: ', messageData.type)
        if (messageData.type === "look" ) {
          avatarLookAt(participantNames.indexOf(messageData.who), participantNames.indexOf(messageData.whom), 500)
        } else if (messageData.type === "expression" ) {
          console.log('who:', participantNames.indexOf(messageData.who))
          console.log('expression:', messageData.expression)
          expression(participantNames.indexOf(messageData.who), messageData.expression)
        } else if (messageData.type === "gesture" ) {
          gesture(participantNames.indexOf(messageData.who), messageData.gesture, 2000)
        }
    });

    //const sendMessage = (arrow) => {
        //socket.send('Hello from C1')
    //}

}

function sendChangeLook( who, whom ) {
  socket.send( JSON.stringify({
    chatID: window.location.pathname,
    who: username,
    whom: participantNames[whom] ? participantNames[whom] : "table",
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

export { sendChangeLook, sendExpression, sendGesture }
