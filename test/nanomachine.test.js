import chai, { expect, spy } from 'chai'
import spies from 'chai-spies'
import nanomachine from '../src/nanomachine'

chai.use(spies)

describe('nanomachine general specs', () => {
  const machine = nanomachine({
    initial: 'login',
    transitions: [
      { name: 'login', from: '*', to: 'login' },
      { name: 'waiting', from: ['login', 'unpause'], to: 'waiting' },
      { name: 'pause', from: ['waiting'], to: 'pause' },
      { name: 'unpause', from: ['pause'], to: 'waiting' },
    ],
    events: {
      login: () => null,
      waiting: () => null,
      pause: () => null,
      unpause: () => null,
    },
  })

  describe('when invalid transition', () => {
    beforeEach(() => {
      machine.reset()
    })

    it('throw error received', () => {
      expect(() => machine.pause()).to.throw('cannot login to pause')
    })

    it('cannot waiting to unpause', () => {
      machine.waiting()

      expect(() => machine.unpause()).to.throw('cannot waiting to unpause')
      expect(machine.history.size).to.eq(1)
    })

    it('cannot waiting to unpause', () => {
      machine.waiting()
      machine.pause()
      machine.unpause()

      expect(machine.state).to.eq('waiting')
      expect(machine.history.size).to.eq(3)
    })
  })

  describe('when valid transition', () => {
    beforeEach(() => {
      machine.reset()
    })

    it('login to waiting', () => {
      machine.waiting()

      expect(machine.state).to.eq('waiting')
      expect(machine.history.size).to.eq(1)
    })

    it('waiting to pause', () => {
      machine.waiting()
      machine.pause()

      expect(machine.state).to.eq('pause')
      expect(machine.history.size).to.eq(2)
    })

    it('pause to unpause', () => {
      machine.waiting()
      machine.pause()
      machine.unpause()

      expect(machine.state).to.eq('waiting')
      expect(machine.history.size).to.eq(3)
    })

    it('pause to login', () => {
      machine.waiting()
      machine.pause()
      machine.unpause()
      machine.login()

      expect(machine.state).to.eq('login')
      expect(machine.history.size).to.eq(4)
    })
  })
})

describe('conditionals transitions "if"', () => {
  let ifConditionalAssert = false

  const machine = nanomachine({
    initial: 'idle',
    transitions: [
      { name: 'login', from: '*', to: 'login' },
      {
        name: 'waiting',
        from: ['login', 'unpause'],
        to: 'waiting',
        if: () => ifConditionalAssert,
      },
      { name: 'pause', from: ['waiting'], to: 'pause' },
      { name: 'unpause', from: ['pause'], to: 'waiting' },
    ],
    events: {
      login: () => null,
      waiting: () => null,
      pause: () => null,
      unpause: () => null,
    },
  })

  beforeEach(() => {
    machine.reset()
  })

  describe('check transition conditional', () => {
    it('transtion idle to login without conditional', () => {
      machine.login()
      expect(machine.state).to.eq('login')
    })

    it('transtion login to waiting with conditional false', () => {
      machine.login()

      expect(() => machine.waiting()).to.throw('cannot login to waiting because conditional failed')
    })

    it('transtion login to waiting with conditional true', () => {
      ifConditionalAssert = true

      machine.login()
      machine.waiting()

      expect(machine.state).to.eq('waiting')
    })
  })
})

describe('conditionals transitions "unless"', () => {
  let ifConditionalAssert = true

  const machine = nanomachine({
    initial: 'idle',
    transitions: [
      { name: 'login', from: '*', to: 'login' },
      {
        name: 'waiting',
        from: ['login', 'unpause'],
        to: 'waiting',
        unless: () => ifConditionalAssert,
      },
      { name: 'pause', from: ['waiting'], to: 'pause' },
      { name: 'unpause', from: ['pause'], to: 'waiting' },
    ],
    events: {
      login: () => null,
      waiting: () => null,
      pause: () => null,
      unpause: () => null,
    },
  })

  beforeEach(() => {
    machine.reset()
  })

  describe('check transition conditional', () => {
    it('transtion idle to login without conditional', () => {
      machine.login()
      expect(machine.state).to.eq('login')
    })

    it('transtion login to waiting with conditional true', () => {
      machine.login()

      expect(() => machine.waiting()).to.throw('cannot login to waiting because conditional failed')
    })

    it('transtion login to waiting with conditional false', () => {
      ifConditionalAssert = false

      machine.login()
      machine.waiting()

      expect(machine.state).to.eq('waiting')
    })
  })
})

describe('listener callback', () => {
  const machine = nanomachine({
    initial: 'login',
    transitions: [
      { name: 'login', from: '*', to: 'login' },
      { name: 'waiting', from: ['login', 'unpause'], to: 'waiting' },
      { name: 'pause', from: ['waiting'], to: 'pause' },
      { name: 'unpause', from: ['pause'], to: 'waiting' },
    ],
    events: {
      login: () => null,
      waiting: () => null,
      pause: () => null,
      unpause: () => null,
    },
  })

  context('when transition emit callback', () => {
    it('login to waiting', () => {
      const spyWaiting = spy(() => console.log('onWaiting'))
      const spyPause = spy(() => console.log('onPause'))

      machine.on('waiting', spyWaiting)
      machine.on('pause', spyPause)

      machine.waiting()
      expect(spyWaiting).to.have.been.called()

      machine.pause()
      expect(spyPause).to.have.been.once.called()

      machine.unpause()
      expect(spyWaiting).to.have.been.called()
    })
  })
})
