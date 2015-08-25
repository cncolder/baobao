import debug from 'debug';

debug.log = console.log.bind(console);

module.exports = namespace => {
  let log = debug(`app:${namespace}`);

  log.log = console.log.bind(console);

  return log;
};
