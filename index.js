require('debug').log = console.log.bind(console);
require('babel/register');
require('./server');
