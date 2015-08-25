import debug from './models/debug';
import http from 'http';
import app from './app';

let log = debug('server'); // jshint ignore:line
let host = process.env.HOST;
let port = parseInt(process.env.PORT || 3000, 10);
let server = http.createServer(app.callback());

server.listen(port, host, function() {
  let address = server.address();

  log('Listening at http://%s:%s', address.address, address.port);
});
