export default func => (socket, nsp, io, ...args) =>
  new Promise(resolve => {
    func(resolve, socket, nsp, io)(...args);
  }).catch(e => { throw e; });
