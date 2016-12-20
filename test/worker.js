'use strict'
self.onmessage = ({data, ports: [port]}) => {
  port.postMessage(data)
}