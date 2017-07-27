'use strict'
self.module = {}
self.importScripts('/base/src/index.js')
const sendChannelMessage = self.module.exports

self.onmessage = ({ports: [port]}) => {
  sendChannelMessage('', port)
    .then(val => self.postMessage(val))
}