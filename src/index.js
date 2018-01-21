import promisify from './promisify';

export class SocketEvent {
  constructor() {
    this._namespace = '/';
    this._name = '';
    this.guards = [];
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

  guard(...args) {
    this.guards.push(...args);

    return this;
  }

  handler(handler) {
    this._handler = handler;
  }

  attach(socket, nsp, io, ...args) {
    let guards = this.guards.map(
      guard => promisify(guard)(socket, nsp, io, ...args)
    );

    let handler = this._handler;

    Promise.all(guards).then(() => {
      handler(socket, nsp, io)(...args);
    });
  }
}

export function connect(io, sockets) {
  let group = sockets.reduce((acc, cur) => {
    if (!acc[cur.namespace]) {
      acc[cur.namespace] = [];
    }

    acc[cur.namespace].push(cur);

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
