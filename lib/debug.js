import debug from 'debug';

debug.log = console.log.bind(console);

let d = namespace => {
  let log = debug(`app:${namespace}`);

  log.warn = log.w = debug(`app:${namespace}#warn`);
  log.error = log.e = debug(`app:${namespace}#error`);

  return log;
};

if (process.browser) {
  d.enable = debug.enable.bind(debug);
}

export default d;
