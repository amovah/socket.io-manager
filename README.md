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

It is time to use `socket.io-manager`, it is easy.

Create a file and name it `foo.js` and import `socket.io-manager` then set up the socket router like below.

```javascript
// socket/foo.js
import { Router } from 'socket.io-manager';

let router = new Router();

router
.name('foo')
.middles(
  (next, socket) => text => {
    text === 'you can' ? next() : socket.emit('error', 'I can not do it');
  }
).handler((socket, nsp) => text => {
  nsp.emit('foo', text);
});
```

now let's back to our `index.js` and import our socket router. we can connect `io` and our socket routers together with `connect` function provided by `socket.io-manager`.

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

### `class` router

Create a socket router with this class.

#### Usage

```javascript
let router = new Router(namespace);
```

#### Parameters

* `namespace`: type `String`, default `/`, `optional`. socket namespace.

#### Methods

* `name(name)`: set event name for this routers.
  * `name`: type `String`, `required`. event name.
* `middle(middles)`: add middlewares for this event.
  * `middles`: type `Array`, `required`. middlewares.

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
* `sockets`: type `Array`, `required`. array of socket routers created by `Socket` class.
