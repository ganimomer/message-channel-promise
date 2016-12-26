'use strict'
self.module = {}
self.importScripts('/base/src/index.js')
const sendChannelMessage = self.module.exports
sendChannelMessage('echo')
  .then(result => {
    if (result === 'echo') {
      self.postMessage({done: true})
    }
  })