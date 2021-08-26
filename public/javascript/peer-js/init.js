import { c } from '../setup/chat/init.js'
import { startMouthing, stopMouthing } from '../three-js/chat/animations/mouth.js'

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

    let audioContext = new AudioContext();
    let analyser = audioContext.createAnalyser();
    let microphone = audioContext.createMediaStreamSource(stream);
    let javascriptNode = audioContext.createScriptProcessor(2048, 1, 1);

    analyser.smoothingTimeConstant = 0.8;
    analyser.fftSize = 1024;

    microphone.connect(analyser);
    analyser.connect(javascriptNode);
    javascriptNode.connect(audioContext.destination);

    setTimeout( function() {
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
        count += 1
        if (count === 7) {
          if (totalAverage > 70) {
            if (!c.p[username].states.speaking) {
              startMouthing(username)
            }
            console.log('talking')
          } else {
            if (c.p[username].states.speaking) {
              stopMouthing(username)
            }
            console.log('not talking')
          }
          count = 0
          totalAverage = 0
        }
        //console.log('volumen:', Math.round(average))
      }
    }, 3000)
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
