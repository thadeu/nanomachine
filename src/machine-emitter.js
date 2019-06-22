export function MachineEmitter() {
  if (!(this instanceof MachineEmitter)) {
    return new MachineEmitter()
  }

  this.events = {}
}

MachineEmitter.prototype.on = function(eventName, listener) {
  if (eventName && listener) {
    let listeners = this.events[eventName] || (this.events[eventName] = [])
    listeners.push(listener)

    return this
  }

  throw new Error('event name and listener is required')
}

MachineEmitter.prototype.once = function(event, listener) {
  let s = this

  this.on(event, once)

  function once() {
    listener.apply(s, arguments)
    s.removeListener(event, once)
  }
}

MachineEmitter.prototype.emit = function(event) {
  var args = Array.prototype.slice.call(arguments, 1)
  var eventThis = { event: event }
  var listeners = []
  var eventListeners = this.events[event]

  if (eventListeners) {
    Array.prototype.push.apply(listeners, eventListeners)

    listeners.map(listener => {
      listener.apply(eventThis, args)
    })
  }
}

MachineEmitter.prototype.removeListener = function(event, listener) {
  let events = this.events
  let evt = events[event]

  if (listener) {
    let idx = Array.prototype.indexOf.call(evt, listener)

    if (idx !== -1) {
      evt.splice(idx, 1)
    }
  } else {
    events[event] = evt.slice()
  }

  return this
}

MachineEmitter.prototype.off = function(event, listener) {
  if (listener) {
    this.removeListener(event, listener)
  } else {
    this.events[event] = []
  }
}

export default MachineEmitter
