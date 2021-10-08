import { initThreeJs } from "../../three-js/gaeltacht/init.js";

// CREATE WEBSOCKET CONNECTION
const socket = io('/')

//socket.on('connected', () => {
  //console.log('connected to socket')
//})

// OPEN NEW CONNECTION
socket.emit('message-gaeltacht', {
  type: 'newConnection',
  chatID: window.location.pathname,
  who: username
})

// LISTEN FOR MESSAGES
socket.on('message-gaeltacht', serverData => {
  console.log('server message:', serverData)

  // NEW CONNECTION
  if (serverData.type === "newConnection" ) {
    initThreeJs('doneSceneLoad') 
  }
});

export { socket }
