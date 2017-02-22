'use strict'
const sendChannelMessage = require('../src/index.js')
describe('sendChannelMessage', () => {
  describe('validity checks', () => {
    it('should throw error if target is undefined', done => {
      sendChannelMessage()
        .catch(err => {
          expect(err.message).toBe('Invalid target')
        })
        .then(done)
    })
  })
  it('should throw error if target is not a context', done => {
    sendChannelMessage({})
      .catch(err => {
        expect(err.message).toBe('Invalid target')
      })
      .then(done)
  })
  describe('to iframe', () => {
    let iframe
    beforeAll(done => {
      iframe = document.createElement('iframe')
      iframe.src = '/base/test/echoIframe.html'
      document.body.appendChild(iframe)
      iframe.addEventListener('load', () => done())
    })
    it('should send a message via channel to an echo iframe and resolve once it is returned', done => {
      sendChannelMessage({key: 'value'}, iframe.contentWindow, '*')
        .then(data => {
          expect(data).toEqual({key: 'value'})
        })
        .then(done)
    })
  })
  describe('to worker', () => {
    let worker

    beforeAll(done => {
      worker = new Worker('/base/test/echoWorker.js')
      done()
    })

    it('should send a message via channel to an echo worker and resolve once it is returned', done => {
      sendChannelMessage({key: 'value'}, worker, '*')
        .then(data => {
          expect(data).toEqual({key: 'value'})
        })
        .then(done)
    })

    afterAll(() => {
      worker.terminate()
    })
  })
  describe('from worker to itself', () => {
    it('should be able to send a message from a worker to itself', done => {
      const worker = new Worker('/base/test/usageWorker.js')
      worker.onmessage = ({data, ports}) => {
        if (data.done) {
          done()
        } else {
          ports[0].postMessage(data)
        }
      }
    })
  })
  describe('to message port', () => {
    it('should send a message via channel to a message port', done => {
      const {port1, port2} = new MessageChannel()
      const mockData = {key: 'value'}
      port1.onmessage = ({data, ports: [port]}) => {
        expect(data).toEqual(mockData)
        port.postMessage(data)
      }
      sendChannelMessage(mockData, port2)
        .then(data => {
          expect(data).toEqual(mockData)
        })
        .then(done)
    })
  })
})
