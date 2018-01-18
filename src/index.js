import 'babel-polyfill';
import promisify from './promisify';

export class Socket {
  constructor(namespace = '/') {
    this.namespace = namespace;
    this._name = '';
    this.middles = [];
    this._handler = () => {};

    this.attach = this.attach.bind(this);
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
