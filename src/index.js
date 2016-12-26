'use strict'
module.exports = function sendChannelMessage(message, target, targetOrigin = '*') {

  const isWorker = typeof WorkerGlobalScope !== 'undefined' && self instanceof WorkerGlobalScope

  return new Promise((resolve, reject) => {
    if (isWorker) {
      target = self
    }
    if (!target || !target.postMessage) {
      reject(new Error('Invalid target'))
    }
    const {port1, port2} = new MessageChannel()
    if (target === self || target instanceof Worker) {
      target.postMessage(message, [port2])
    } else {
      target.postMessage(message, targetOrigin, [port2])
    }
    port1.onmessage = ({data}) => resolve(data)
  })
}
