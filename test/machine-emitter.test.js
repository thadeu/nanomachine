import chai, { expect, spy } from 'chai'
import spies from 'chai-spies'

chai.use(spies)

import MachineEmitter from '../src/machine-emitter'

describe('MachineEmitter general specs', () => {
  describe('emitter #on', () => {
    it('added events', () => {
      const emitter = MachineEmitter()
      const cb = () => console.log('test #on')
      const spy = chai.spy(cb)

      emitter.on('test', spy)

      expect(Object.keys(emitter.events).length).to.eq(1)
    })
  })

  describe('emitter #emit', () => {
    it('emit event to be', () => {
      const emitter = MachineEmitter()
      const cb = data => data

      const spyA = spy(cb)
      const spyB = spy(cb)

      emitter.on('test-a', spyA)
      emitter.on('test-b', spyB)

      emitter.emit('test-a', { a: 1, b: 2 })

      expect(spyA).to.have.been.called.once.with({ a: 1, b: 2 })
    })
  })

  describe('emitter #off', () => {
    context('when not callback listener', () => {
      it('doesnt emit when off', () => {
        const emitter = MachineEmitter()
        const spyA = spy(() => ({ a: 1, b: 2 }))
        const spyB = spy(() => ({ a: 3, b: 4 }))

        emitter.on('test-a', spyA)
        emitter.on('test-a', spyB)
        expect(emitter.events['test-a'].length).to.eq(2)

        emitter.emit('test-a', { a: 1, b: 2 })
        expect(spyA).to.have.been.called()

        emitter.off('test-a', spyA)
        expect(emitter.events['test-a'].length).to.eq(1)

        emitter.emit('test-a', { a: 1, b: 2 })
        expect(spyB).to.have.been.called()
        expect(emitter.events['test-a'].length).to.eq(1)
      })
    })

    context('when not callback listener', () => {
      it('fired once and off event after that', () => {
        const emitter = MachineEmitter()
        const cb = data => data
        const spyCb = spy(cb)

        emitter.on('test-a', spyCb)
        emitter.off('test-a')
        expect(emitter.events['test-a'].length).to.eq(0)

        emitter.emit('test-a', { a: 1, b: 2 })
        expect(spyCb).not.to.have.been.called()
      })
    })
  })

  describe('emitter #once', () => {
    context('when callback listener', () => {
      it('fired once and off event after that', () => {
        const emitter = MachineEmitter()
        const cb = data => data
        const spyCb = spy(cb)

        emitter.once('test-a', spyCb)
        expect(emitter.events['test-a'].length).to.eq(1)

        emitter.emit('test-a', { a: 1, b: 2 })
        expect(spyCb).to.have.been.called.once.with({ a: 1, b: 2 })

        expect(emitter.events['test-a'].length).to.eq(0)
      })
    })
  })
})
