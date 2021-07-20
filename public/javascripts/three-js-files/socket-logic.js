import avatarLookAt from "./chat/animations/look.js"

// Create WebSocket connection.
var socket

export default function initSocket() {
    // Connection opened
    //let data = {
        url: window.location.pathname
    //}
    
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
        avatarLookAt(participantNames.indexOf(messageData.user), participantNames.indexOf(messageData.lookTo), 500)
    });

    const sendMessage = (arrow) => {
        socket.send('Hello from C1')
    }

}

function sendChangeLook( who, whom ) {
  socket.send( JSON.stringify({
    chatID: window.location.pathname,
    who: username,
    whom: participantNames[whom] ? participantNames[whom] : "table",
    timestamp: new Date()
  }))
}

export { sendChangeLook }
