import { initSocket } from '../../web-sockets/chat/receive.js'
import { c } from './settings.js'
import { calculatePosRot } from './pos-rot.js'
import { initScene } from '../../three-js/chat/init.js'

initSocket()

const resolveNewConnection = serverData_ => {
  c.participantList = serverData_.participantList
  c.lookingAtEntry = serverData_.lookingAt
  c.waitingList = serverData_.waitingList
  c.firstEntry = serverData_.firstEntry
  c.host = serverData_.host
  console.log('c:', c)

  if (c.host !== username && c.firstEntry ) {
    $('#waitingText').text(`waiting for the host (${c.host}) to let you in...`)
    $('#waitOverlay').show()
    requestEnter(username)
  }

	calculatePosRot(c.participantList.length)
  initScene('scene')

}

export { resolveNewConnection }
