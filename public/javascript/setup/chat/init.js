import { initSocket } from '../../web-sockets/chat/receive.js'
import { c } from './settings.js'
import { setupAllEvents } from './events.js'
import { displayChoosePositionCircle } from './choose-position-circle.js'
import { calculatePosRot } from './pos-rot.js'
import { initScene } from '../../three-js/chat/init.js'

initSocket()

const resolveNewConnection = serverData_ => {
  c.participantList = serverData_.participantList
  c.lookingAtEntry = serverData_.lookingAt
  c.waitingList = serverData_.waitingList
  c.firstEntry = serverData_.firstEntry
  c.host = serverData_.host
  c.participantList.forEach(function(n){
    c.p[n] = {}
  })
  console.log('c:', c)
  if (c.host !== username && c.firstEntry) {
    displayChoosePositionCircle([...c.participantList])
  } else {
    loadAll()
  }
}

const loadAll = () => {
  setupAllEvents()
  calculatePosRot(c.participantList.length)
  initScene('scene')
}

export { resolveNewConnection, loadAll }