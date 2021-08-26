import { c } from '../setup/chat/init.js'

let myID = window.location.pathname + '-' + username 
myID = myID.slice(6, myID.length).replaceAll('-', '') 
let peer = new Peer(myID)
peer.on('open', myID => {
  console.log('My peer ID is: ' + myID);
})

const initPeer = () => {
  navigator.mediaDevices.getUserMedia({
    video: false,
    audio: true
  }).then(stream => {
    addAudioStream(myID, stream, true)
    checkForOtherPeersAndConnect(stream)
    peer.on('call', call => {
      call.answer(stream)
      addAudioStream(call.peer, stream, false)
    })
  })
}

const addAudioStream = (userID, stream, muted) => {
  let thisAudio = document.createElement('audio')
  thisAudio.id = userID
  $('#audioElements').append(thisAudio)
  thisAudio.srcObject = stream
  thisAudio.muted = muted
  thisAudio.addEventListener('loadedmetadata', () => {
    thisAudio.play()
  })
}

const checkForOtherPeersAndConnect = stream => {
  c.participantList.forEach( p => {
    console.log('username:', username)
    console.log('p:', p)
    if (p !== username) {
      connectToUser(p, stream)
    }
  })
}

const connectToUser = (p, stream) => {
  let otherID = window.location.pathname + '-' + p
  otherID = otherID.slice(6, otherID.length).replaceAll('-', '') 
  const call = peer.call(otherID, stream)
  console.log('call:', call)
  call.on('stream', otherAudioStream => {
    console.log('otherStream')
    addAudioStream(otherID, otherAudioStream)
  })
  call.on('close', () => {
    audio.remove()
  })
}


export { initPeer }
