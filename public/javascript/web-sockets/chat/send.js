import { socket } from "./receive.js"

const socketSend = (key, val, arg1) => {

  let data = {
    chatID: window.location.pathname,
    who: username,
    type: key,
    key: val,
    timestamp: new Date()
  }

  if (key === "look") {
    data.body = arg1
  }
  
  socket.send( JSON.stringify(data))

}

export { socketSend }
