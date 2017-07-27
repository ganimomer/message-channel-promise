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
      sendChannelMessage({key: 'value'}, iframe.contentWindow, {targetOrigin: '*'})
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
      sendChannelMessage({key: 'value'}, worker, {targetOrigin: '*'})
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
    it('should send message from worker to message port', done => {
      const {port1, port2} = new MessageChannel()
      const worker = new Worker('/base/test/messagePortWorker.js')
      worker.onmessage = ({data}) => {
        expect(data).toBe(true)
        done()
      }
      port1.onmessage = ({data, ports: [port]}) => port.postMessage(true)
      worker.postMessage('START', [port2])
    })
  })
  describe('from window to itself', () => {
      it('should send a message via channel to itself properly', done => {
        const message = {key1: 'value1', key2: 'value2'}
        const handler = ({data, ports: [port]}) => {
          expect(data).toEqual(message)
          port.postMessage(data)
        }
        window.addEventListener('message', handler)
        sendChannelMessage(message, window)
          .then(res => {
            expect(res).toEqual(message)
          })
          .then(() => window.removeEventListener('message', handler))
          .then(done, done.fail)

      })
  })

  describe('transferring objects', () => {
    const encode = str => {
      const buf = new ArrayBuffer(str.length * 2)
      const bufView = new Uint16Array(buf)
      const arr = [...str]
      arr.forEach((c, i) => {
        bufView[i] = str.charCodeAt(i)
      })
      return buf
    }
    const decode = buffer => String.fromCharCode(...new Uint16Array(buffer))

    it('should pass serializable objects in transfer', () => {
      const {port1, port2} = new MessageChannel()
      const testString = 'hello'
      port1.onmessage = ({data, ports: [port, ...transfer]}) => {
        expect(decode(transfer[0])).toBe(data)
        port.postMessage()
      }
      sendChannelMessage(testString, port2, {transfer: [encode(testString)]})
    })
  })
})
