'use strict'
const sendChannelMessage = require('../src/index.js')
describe('sendChannelMessage', () => {
  describe('to iframe', () => {
    let iframe

    const echoIframeContent = `
    <h1> iframe </h1>
    <script>
    onmessage = ({data, ports: [port]}) => {
      port.postMessage(data)
    }
    </script>`

    beforeAll(done => {
      iframe = document.createElement('iframe')
      const blob = new Blob([echoIframeContent], {type: 'text/html'})
      iframe.src = URL.createObjectURL(blob)
      document.body.appendChild(iframe)
      iframe.addEventListener('load', () => done())
    })
    it('should send a message via channel to an echo iframe and resolve once it is returned', done => {
      sendChannelMessage(iframe.contentWindow, {key: 'value'}, '*')
        .then(data => {
          expect(data).toEqual({key: 'value'})
        })
        .then(done)
    })
  })

  describe('to worker', () => {
    let worker
    const echoWorkerContent = `self.onmessage = ({data, ports: [port]}) => {
      port.postMessage(data)
    }`

    beforeAll(done => {
      const blob = new Blob([echoWorkerContent], {type: 'text/javascript'})
      worker = new Worker(URL.createObjectURL(blob))
      done()
    })

    it('should send a message via channel to an echo worker and resolve once it is returned', done => {
      sendChannelMessage(worker, {key: 'value'}, '*')
        .then(data => {
          expect(data).toEqual({key: 'value'})
        })
        .then(done)
    })

    afterAll(() => {
      worker.terminate()
    })
  })
})
