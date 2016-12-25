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
    });
  });
  it('should throw error if target is not a context', done => {
    sendChannelMessage({})
      .catch(err => {
        expect(err.message).toBe('Invalid target')
      })
      .then(done)
  });
  describe('to iframe', () => {
    let iframe
    beforeAll(done => {
      iframe = document.createElement('iframe')
      iframe.src = '/base/test/iframe.html'
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

    beforeAll(done => {
      worker = new Worker('/base/test/worker.js')
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
