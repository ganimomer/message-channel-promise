'use strict'
module.exports = function sendChannelMessage(target, message, targetOrigin = '*') {
  return new Promise(resolve => {
    const {port1, port2} = new MessageChannel()
    if (target instanceof Worker) {
      target.postMessage(message, [port2])
    } else {
      target.postMessage(message, targetOrigin, [port2])
    }
    port1.onmessage = ({data}) => resolve(data)
  })
}
