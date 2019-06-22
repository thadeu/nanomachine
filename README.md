# nanomachine

[![NPM package version](https://img.shields.io/npm/v/@thadeu/nanomachine.svg)](https://www.npmjs.com/package/@thadeu/nanomachine)
[![Build Status](https://travis-ci.org/thadeu/nanomachine.svg?branch=master)](https://travis-ci.org/thadeu/nanomachine)
![Size](https://img.shields.io/github/size/thadeu/nanomachine/dist/nanomachine.js.svg)
![Issues](https://img.shields.io/github/issues/thadeu/nanomachine.svg)
![License: MIT](https://img.shields.io/github/license/thadeu/nanomachine.svg)

---

🔐 nanomachine is a state machine for tiny JS

# How to install

```bash
yarn add @thadeu/nanomachine
```

or

```bash
npm i @thadeu/nanomachine
```

or unpkg load script

```html
<a href="https://unpkg.com/@thadeu/nanomachine">https://unpkg.com/@thadeu/nanomachine</a>
```

# Usage

---

```js
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
```

With a state machine started, you have access to dynamically created methods. Like for example.

If you want to leave login and go to waiting, you can use.

```js
// state is login, right?
machine.waiting()
```

Everything is based on the transition `from` to `to` was configured

```js
{ name: 'waiting', from: ['login', 'unpause'], to: 'waiting' }
```

In the case above, we say, `waiting`, you can transition from `login` or `pause` to `waiting`
Of course, it will only happen, if there is a method created in events.

The above transition must have a method to be triggered when moving, example:

```js
const machine = nanomachine({
  ......
  events: {
    waiting: () => console.log('fired waiting')
  }
  ......
})

```

The waiting event, will be invoked whenever the transition is approved in the state machine

# Conditionals

Imagine the following situation, you need to change state, only after resolving something. So!

```js
const machine = nanomachine({
  ......
  transitions: [
    { name: 'login', from: '*', to: 'login' },
    { name: 'waiting', from: ['login', 'unpause'], to: 'waiting', if: () => true | false },
  ],
  ......
})
```

or use `unless`.

```js
{ name: 'waiting', from: ['login', 'unpause'], to: 'waiting', unless: () => true }
```

# On Any Transition

You can use observers, for example

```js
const machine = nanomachine({
  ....
})

machine.on('waiting', function() {
  console.log('onWaiting')
})
```

Whenever a `waiting` transitions occurs, this observer receives a message

# Contributing

Once you've made your great commits (include tests, please):

1. Fork this repository
2. Create a topic branch - `git checkout -b my_branch`
3. Push to your branch - `git push origin my_branch`
4. Create a pull request

That's it!

Please respect the indentation rules and code style. And use 2 spaces, not tabs. And don't touch the version thing or distribution files; this will be made when a new version is going to be released.

## License

(The MIT License)

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the 'Software'), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
