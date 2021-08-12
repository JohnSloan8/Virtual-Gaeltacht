export default const socketSend = (key, val) => {

  socket.send( JSON.stringify({
    chatID: window.location.pathname,
    who: username,
    type: key,
    key: val,
    timestamp: new Date()
  }))

}
