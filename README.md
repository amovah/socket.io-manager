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
