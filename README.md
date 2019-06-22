# nanomachine

[![NPM package version](https://img.shields.io/npm/v/@thadeu/nanomachine.svg)](https://www.npmjs.com/package/@thadeu/nanomachine)
[![Build Status](https://travis-ci.org/thadeu/nanomachine.svg?branch=master)](https://travis-ci.org/thadeu/nanomachine)
![Minified size](http://img.badgesize.io/thadeu/nanomachine/master/dist/nanomachine.min.js.svg?label=min+size)
![Minified+Gzip size](http://img.badgesize.io/thadeu/nanomachine/master/dist/nanomachine.min.js.svg?compression=gzip&label=min%2Bgzip+size)
![License: MIT](https://img.shields.io/npm/l/@thadeu/nanomachine.svg)

---

🔐 nanomachine is a `state machine` for tiny JS with < 1Kb

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

Com uma máquina de estado iniciada, você tem acesso aos métodos criados dinamicamente. Como por exemplo.

Caso você queira sair de `login` e ir para `waiting`, você pode usar.

```js
// state is login, right?
machine.waiting()
```

Tudo se baseia na transição do `from` para o `to` nas transações configuradas.

```js
{ name: 'waiting', from: ['login', 'unpause'], to: 'waiting' }
```

No caso acima, dizemos que `waiting`, poderá transitar de `login` ou `unpause` para `waiting`.
Isso claro, só vai acontecer se existir um método criado em `events`, com o mesmo nome exemplo:

```js
{ name: 'waiting', from: ['login', 'unpause'], to: 'waiting' }
```

A transição acima deve possuir um `method(callback)` para ser acionado ao transitar.

```js
events: {
  waiting: () => console.log('fired waiting')
}
```

O evento `waiting` será invocado, sempre que a transição for aprovada no fluxo da máquina de estado.

# Conditionals

Imagine a seguinte situação, você precisa mudar de estado, apenas após a resolução de algo. Então veja a transitions como ficaria nesse caso.

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

Notou a funcão `if` ?

```js
{ name: 'waiting', from: ['login', 'unpause'], to: 'waiting', if: () => true }
```

Caso a transição seja aprovado, o `if` será verificado também. E a transição só será aceita em caso de sucesso da condição.

Pode-se usar também o `unless`.

```js
{ name: 'waiting', from: ['login', 'unpause'], to: 'waiting', unless: () => true }
```

Isso indicaria que, `waiting`, seria invocado sempre, a não ser que, `unless`, seja `true`

# On Any Transition

Você também pode criar observadores, exemplo:

```js
const machine = nanomachine({
  ....
})

machine.on('waiting', function() {
  console.log('onWaiting')
})
```

Sempre que uma transição `waiting` ocorrer, esse observador recebe uma mensagem.

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
