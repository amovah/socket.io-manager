import 'babel-polyfill';
import promisify from './promisify';

export class Router {
  constructor(namespace = '/') {
    this.namespace = namespace;
    this._name = '';
    this.middles = [];
    this._handler = () => {};
  }

  name(name) {
    this._name = name;

    return this;
  }

  middle(...args) {
    this.middles.push(...args);

    return this;
  }

  handler(handler) {
    this._handler = handler;
  }

  attach(socket, nsp, io, ...args) {
    let middles = this.middles.map(
      middle => promisify(middle)(socket, nsp, io, ...args)
    );

    let handler = this._handler;

    Promise.all(middles).then(() => {
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

  for (let [namespace, routers] of Object.entries(group)) {
    let nsp = io.of(namespace);

    nsp.on('connection', socket => {
      for (let router of routers) {
        socket.on(router._name, router.attach.bind(router, socket, nsp, io));
      }
    });
  }
}
