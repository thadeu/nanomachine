import './array-utils'
import { now, uuidv4, hasProp } from './utils'
import MachineEmitter from './machine-emitter'

export function nanomachine(props) {
  if (!(this instanceof nanomachine)) {
    return new nanomachine(props)
  }

  this.initialProps = props
  this.state = props.initial || 'idle'

  this.transitions = props.transitions || []
  this.history = new Map()
  this.events = props.events || {}
  this.logLevel = props.logLevel ? props.logLevel : 0
  this.emitter = new MachineEmitter()

  this.createOrUpdateTransitions(this.transitions)
}

nanomachine.prototype.logger = function() {
  if (this.logLevel > 0) {
    console.log.apply(null, Array.prototype.slice.call(arguments))
  }
}

nanomachine.prototype.on = function(transitionName, cb) {
  if (!Object.keys(this.events).includes(transitionName)) {
    throw new Error(`cannot observer transition to ${transitionName}`)
  }

  return this.emitter.on(transitionName, cb)
}

nanomachine.prototype.createOrUpdateTransitions = function(transitions) {
  return transitions.map(k => {
    if (!nanomachine.prototype[k.name]) {
      nanomachine.prototype[k.name] = function() {
        return this.transitionTo(k.name)
      }
    }
  })
}

nanomachine.prototype.reset = function() {
  this.state = this.initialProps.initial
  this.history.clear()

  return this
}

nanomachine.prototype.can = function(transitionName) {
  const prevState = this.state
  const transition = this.transitions.flatFilter(f => f.name == transitionName)

  if (transition.from === '*') {
    return true
  }

  return transition.from.includes(prevState)
}

nanomachine.prototype.addHistory = function({ from, to }) {
  this.logger('[nanomachine] @ history added ')
  this.history.set(uuidv4(), { from, to, timestamp: now() })
}

nanomachine.prototype.transitionTo = function(transitionName) {
  const prevState = this.state
  const transition = this.transitions.flatFilter(f => f.name == transitionName)

  if (!this.can(transitionName)) {
    throw new TypeError(`cannot ${prevState} to ${transitionName}`)
  } else if (hasProp(transition, 'if') && !transition.if()) {
    throw new Error(`cannot ${prevState} to ${transitionName} because conditional failed`)
  } else if (hasProp(transition, 'unless') && transition.unless()) {
    throw new Error(`cannot ${prevState} to ${transitionName} because conditional failed`)
  }

  this.state = transition.to

  const currentEvent = this.events[this.state]

  if (currentEvent) {
    this.emitter.emit(this.state, currentEvent)
    this.addHistory({ from: prevState, to: this.state })
    this.logger(`[nanomachine] @ fired ${this.state}`)
  }
}

export default nanomachine
