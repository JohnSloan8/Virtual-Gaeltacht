import { c } from '../../setup/chat/init.js'
import { cameraEnter } from '../../three-js/chat/enter/camera-enter.js'
import { displayWaitingList } from '../../setup/chat/events.js'
import { displayChoosePositionCircle } from '../../setup/chat/choose-position-circle.js'
import { updateAvatarState } from '../../setup/chat/updates.js'
import { resolveNewConnection } from "../../setup/chat/init.js"
import { checkForOtherPeersAndConnect } from "../../peer-js/init.js"
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
    checkForOtherPeersAndConnect()

  // REQUESTED ENTRY
  } else if (serverData.type === "requestEnter" ) {
    c.waitingList = serverData.waitingList
    displayWaitingList()

  // ADMITTED OR REFUSED
  } else if (serverData.type === "admitRefuse" ) {
    c.waitingList = serverData.waitingList
    if (serverData.key === 'admit') {
      c.participantList = serverData.participantList
      displayWaitingList()
      c.lookingAtEntry = serverData.lookingAtEntry
      if (username === serverData.admittedRefusedParticipant) {
        cameraEnter()
      } else {
        addAvatar(serverData.admittedRefusedParticipant)
      }
    } else {
      if (username === serverData.admittedRefusedParticipant) {
        $('#choosePositionText').html(`Your request was refused or timed out. You can try again.`)
        displayChoosePositionCircle(serverData.participantList)
      }
      displayWaitingList()
    }

  // PARTICIPANT REMOVED
  } else if (serverData.type === "removeParticipant" ) {
    if (username === serverData.who) {
      window.location.href = '/chats/chat-history/' + window.location.pathname.slice(6)
    } else {
      c.participantList = serverData.participantList
      removeAvatar(serverData.who)
    }

  // OTHER PARTICIPANT ACTIONS
  } else if (c.participantList !== undefined && c.meEntered) {

    // LOOKS
    if (serverData.type === "look" ) {
      avatarLookAt(serverData.who, serverData.key, 500, serverData.body)
    
    // FACIAL EXPRESSIONS
    } else if (serverData.type === "expression" ) {
      expression(serverData.who, serverData.key, 500)
    
    // GESTURES
    } else if (serverData.type === "gesture" ) {
      gesture(serverData.who, serverData.key, 2000)
    
    // NODS OR SHAKES HEAD
    } else if (serverData.type === "nodShake" ) {
      avatarNodShake(serverData.who, serverData.key)

    // Speaking
    } else if (serverData.type === "speaking" ) {
      if (serverData.key) {
        updateAvatarState(serverData.who, 'speaking', true)
      } else {
        updateAvatarState(serverData.who, 'speaking', false)
      }
    }
  }
});

export { socket }
