import { initThreeJs } from '../../three-js/chat/init.js'
import { initPeer } from '../../peer-js/init.js'

const resolveNewConnection = serverData_ => {
  propogateC(serverData_)
  initPeer()
  initThreeJs('scene')
}

let c
const propogateC = sD_ => {
  c = {
    p: {}, // participants
    participantEntering: true,
    meEntering: false,
    meHavePosition: true,
    participantLeaving: false,
    positions: {},
    reversePositions: {},
    participantList: sD_.participantList,
    lookingAtEntry: sD_.lookingAt,
    waitingList: sD_.waitingList,
    firstEntry: sD_.firstEntry,
  }
  c.participantList.forEach(function(n){
    c.p[n] = {}
  })
  if (!c.participantList.includes(username)) {
    c.meHavePosition = false;
  }
  console.log('c:', c)
  window.c = c
}

export { resolveNewConnection, c }
