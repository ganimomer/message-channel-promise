'use strict'
module.exports = function sendChannelMessage(message, target, {targetOrigin = '*', transfer = []} = {}) {

  const isWorker = typeof WorkerGlobalScope !== 'undefined' && self instanceof WorkerGlobalScope

  return new Promise((resolve, reject) => {
    if (isWorker) {
      target = self
    }
    if (!target || !target.postMessage) {
      reject(new Error('Invalid target'))
    }
    const {port1, port2} = new MessageChannel()
    if (isWorker || target instanceof Worker || target instanceof MessagePort) {
      target.postMessage(message, [port2, ...transfer])
    } else {
      target.postMessage(message, targetOrigin, [port2, ...transfer])
    }
    port1.onmessage = ({data}) => resolve(data)
  })
}
