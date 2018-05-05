export default func => (obj, ...args) =>
  () => new Promise(resolve => {
    func(resolve, obj)(...args);
  }).catch(err => { console.error(err); });
