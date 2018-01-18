export default func => (socket, nsp, io, ...args) =>
  new Promise(resolve => {
    func(resolve, socket, nsp, io)(...args);
  }).catch(err => { console.error(err); });
