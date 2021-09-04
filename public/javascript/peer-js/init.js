import { c } from '../setup/chat/init.js'
import { socketSend } from "../web-sockets/chat/send.js"
import { updateAvatarState } from "../setup/chat/updates.js"

let myID = window.location.pathname + '-' + username 
myID = myID.slice(6, myID.length).replaceAll('-', '') 
let peer = new Peer(myID)
peer.on('open', myID => {
  console.log('Peer opened. ID is: ' + myID);
})

const initPeer = () => {
  navigator.mediaDevices.getUserMedia({
    video: false,
    audio: true
  }).then(stream => {
    c.myStream = stream
    addAudioStream(myID, stream, true)
    checkForOtherPeersAndConnect()
    peer.on('call', call => {
      call.answer(stream)
      addAudioStream(call.peer, stream, false)
    })

  })
}

const addAudioStream = (userID, stream, muted) => {
  let thisAudio = document.createElement('audio')
  //console.log('audio stream added:', userID)
  thisAudio.id = userID
  $('#audioElements').append(thisAudio)
  thisAudio.srcObject = stream
  thisAudio.muted = muted
  thisAudio.addEventListener('loadedmetadata', () => {
    thisAudio.play()
    if (userID === myID) {
      addVolumeDetector(stream)
      showMuteButton(stream);
    } 
  })
}

const checkForOtherPeersAndConnect = () => {
  c.participantList.forEach( p => {
    if (p !== username) {
      if (!c.connectedStreams.includes(p)) {
        connectToUser(p, c.myStream)
      }
    }
  })
  setTimeout( checkForOtherPeersAndConnect, 5000 )
}

const connectToUser = (p, stream) => {
  let otherID = window.location.pathname + '-' + p
  otherID = otherID.slice(6, otherID.length).replaceAll('-', '') 
  const call = peer.call(otherID, stream)
  call.on('stream', otherAudioStream => {
    console.log('adding stream:', otherID)
    addAudioStream(otherID, otherAudioStream, false)
    c.connectedStreams.push(p)
  })
  call.on('close', () => {
    audio.remove()
  })
}

const addVolumeDetector = stream => {
  let audioContext = new AudioContext();
  let analyser = audioContext.createAnalyser();
  let microphone = audioContext.createMediaStreamSource(stream);
  let javascriptNode = audioContext.createScriptProcessor(2048, 1, 1);

  analyser.smoothingTimeConstant = 0.8;
  analyser.fftSize = 1024;

  microphone.connect(analyser);
  analyser.connect(javascriptNode);
  javascriptNode.connect(audioContext.destination);

  let count = 0
  let totalAverage = 0
  javascriptNode.onaudioprocess = function() {
    var array = new Uint8Array(analyser.frequencyBinCount);
    analyser.getByteFrequencyData(array);
    var values = 0;

    var length = array.length;
    for (var i = 0; i < length; i++) {
      values += (array[i]);
    }
    var average = values / length;
    totalAverage += average
    if (count === 10) {
      if (totalAverage > 150) {
        if (!c.p[username].states.speaking) {
          //console.log('speaking')
		      updateAvatarState(username, 'speaking', true)
          socketSend('speaking', true) 
        }
      } else if (totalAverage < 75){
        if (c.p[username].states.speaking) {
          //console.log('not speaking')
		      updateAvatarState(username, 'speaking', false)
          socketSend('speaking', false)
        }
      }
      count = 0
      totalAverage = 0
    }
    count += 1
  }
}

const showMuteButton = stream => {
  $('#muteButton').show()
  stream.getAudioTracks()[0].enabled = false

  $('#muteButton').click( () => {
    if (stream.getAudioTracks()[0].enabled) {
      stream.getAudioTracks()[0].enabled = false
      $('#muteButton').removeClass('fa-microphone')
      $('#muteButton').addClass('fa-microphone-slash')
    } else {
      stream.getAudioTracks()[0].enabled = true
      $('#muteButton').addClass('fa-microphone')
      $('#muteButton').removeClass('fa-microphone-slash')
    }
  })
}

export { initPeer, checkForOtherPeersAndConnect }
