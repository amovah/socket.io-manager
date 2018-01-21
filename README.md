# socket.io-manager

Manage your socket events easily.

## Usage (example)

As first step, let's install `socket.io` and `socket.io-manager`:

```
npm i socket.io socket.io-manager -S
```

Or:

```
yarn add socket.io socket.io-manager
```

Now we need socket server. Create a file called `index.js`.

```javascript
// index.js
import socketIO from 'socket.io';

const io = socketIO(9090);
```

It is time to use `socket.io-manager`.

Create a file and name it `foo.js` and import `SocketEvent` from `socket.io-manager` and then set up the socket event manager like below.

```javascript
// foo.js
import { SocketEvent } from 'socket.io-manager';

let socket = new SocketEvent();

// default namespace is '/', if you want change, use SocketEvent.namespace method.

socket
.name('foo')
.guard(
  (next, socket) => text => {
    text === 'you can' ? next() : socket.emit('error', 'I can not do it');
  }
).handler((socket, nsp) => text => {
  nsp.emit('foo', text);
});
```

now let's back to our `index.js` and import our socket event manager. we can connect `io` and our socket events together with `connect` function provided by `socket.io-manager`.

```javascript
// index.js
import socketIO from 'socket.io';
import { connect } from 'socket.io-manager';
import foo from './foo';

const io = socketIO(9090);

// we can connect io to our socket routers with connect function
connect(io, [foo]);
```

It's done. we can organize our socket like this now. I hope you enjoy it.

## API

### `class` SocketEvent

#### Usage

```javascript
let socket = new SocketEvent();
```

#### Methods

* `namespace(namespace)`: set namespace.  default value of namespace is `/`, if you don't want to change namespace don't call this method.
  * `namespace`: type `String`, `required`.
* `name(name)`: set event name for this routers.
  * `name`: type `String`, `required`. event name.
* `guard(guards)`: add middlewares for this event.
  * `guards`: type `Array`, `required`. middlewares.

    How to write a middleware ? it's simple. first look at this example.

    ```javascript
    export default (next, socket, nsp, io) => (user, msg) => {
      socket.user = user;
      msg = msg + user.name;

      next();
    }
    ```

    first, it takes 4 arguments, `next` calls next middleware or handler. `socket` obviously is socket object. `nsp` is current namespace `scoket.io` object. `io` is main `socket.io` object.

    then it return a function that this function take some arguments. these are event data. for example if in client side I run this code, `socket.emit('foo', { name: 'ali' }, 'hey there')`, the second function take 2 arguments based on what I've sent to the event. `user` argument is `{ name: 'ali' }` and `msg` is `hey there`.

    that's all.

* `handler(handler)`: it's main socket handler.
  * `handler`: type `Function`,  `required`.

  it looks like middleware function with little difference, it doesn't have `next` argument.

### connect

#### Usage
```javascript
connect(io, sockets);
```

#### Parameters

* `io`: `socket.io` server class.
* `sockets`: type `Array`, `required`. array of socket events created by `SocketEvent` class.

### applyGuards

if you want to add same middlewares as head middlewares in socket events, it's better to use this function. this function add middlewares before all middlewares in socket events.

#### Usage
```javascript
applyGuards(guards, socketsEvents);
```

#### Parameters
* `guards`: type `Array`, `required`. array of middlewares to apply on socket events.
* `socketEvents`: type `Array`, `required`. array of socket events.

#### Example

suppose that we have 2 guards (AKA middlewares) and one socket event named foo. now we want add these two guards in `foo` socket event. in code language it will be something like this:

```javascript
applyGuards([ guard1, guard2 ], [ foo ]);
```
