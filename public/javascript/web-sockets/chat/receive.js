import { c } from '../../setup/chat/init.js'
import { cameraEnter } from '../../three-js/chat/enter/camera-enter.js'
import { displayWaitingList } from '../../setup/chat/events.js'
import { displayChoosePositionCircle } from '../../setup/chat/choose-position-circle.js'
import { updateAvatarState } from '../../setup/chat/updates.js'
import { resolveNewConnection } from "../../setup/chat/init.js"
import { avatarLookAt } from "../../three-js/chat/animations/avatar-look.js"
import { expression } from "../../three-js/chat/animations/expression.js"
import { gesture } from "../../three-js/chat/animations/gesture.js"
import { avatarNodShake } from "../../three-js/chat/animations/nod-shake.js"
import { addAvatar } from "../../three-js/chat/models/add-avatar.js"
import { removeAvatar } from "../../three-js/chat/models/remove-avatar.js"

// CREATE WEBSOCKET CONNECTION
const socket = io('/')

socket.on('connected', () => {
  console.log('connected to socket')
})

// OPEN NEW CONNECTION
socket.emit('message', {
  type: 'newConnection',
  chatID: window.location.pathname,
  who: username
})

// LISTEN FOR MESSAGES
socket.on('message', serverData => {
  //console.log('server message:', serverData)

  // NEW CONNECTION
  if (serverData.type === "newConnection" ) {
    resolveNewConnection(serverData) 
  }
});

export { socket }
