import { userID } from './chat/main.js'
import avatarLookAt from "./chat/animations/look.js"

// Create WebSocket connection.
var socket

export default function initSocket() {
    // Connection opened
    let data = {
        userID: userID.toString()
    }
    
    socket = new WebSocket('ws://localhost:8080')
    //socket.addEventListener('open', function (event) {
        //socket.send(JSON.stringify(data));
    //});

    // Listen for messages
    socket.addEventListener('message', function (event) {
        console.log('Message from server ', event.data);
        let messageData = JSON.parse(event.data)
        console.log('messageData: ', messageData)
        avatarLookAt(messageData.user, messageData.lookTo, 500)
    });

    const sendMessage = (arrow) => {
        socket.send('hello from C1')
    }

}

function sendChangeLook( who, whom ) {
  socket.send( JSON.stringify({
    user: who,
    lookTo: whom
  }))
}

export { sendChangeLook }
