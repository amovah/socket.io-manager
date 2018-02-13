import promisify from './promisify';

export class SocketEvent {
  constructor() {
    this._namespace = '/';
    this._name = '';
    this.middlewares = [];
    this._handler = () => {};
  }

  namespace(namespace) {
    this._namespace = namespace;

    return this;
  }

  name(name) {
    this._name = name;

    return this;
  }

  middleware(...args) {
    this.middlewares.push(...args);

    return this;
  }

  handler(handler) {
    this._handler = handler;
  }

  async attach(socket, nsp, io, ...args) {
    socket.eventName = this._name;

    let middlewares = this.middlewares.map(
      middleware => promisify(middleware)(socket, nsp, io, ...args)
    );

    try {
      for (let middleware of middlewares) {
        await middleware();
      }

      this._handler(socket, nsp, io)(...args);
    } catch (e) {
      console.error(e);
    }
  }
}

export function connect(io, sockets) {
  let group = sockets.reduce((acc, cur) => {
    if (!acc[cur._namespace]) {
      acc[cur._namespace] = [];
    }

    acc[cur._namespace].push(cur);

    return acc;
  }, {});

  for (let [namespace, socketEvents] of Object.entries(group)) {
    let nsp = io.of(namespace);

    nsp.on('connection', socket => {
      for (let socketEvent of socketEvents) {
        socket.on(
          socketEvent._name,
          socketEvent.attach.bind(socketEvent, socket, nsp, io)
        );
      }
    });
  }
}

export function applyMiddleware(middlewares, sockets) {
  return sockets.map(
    item => {
      item.middlewares.unshift(...middlewares);
      return item;
    }
  );
}
