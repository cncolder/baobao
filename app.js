// require

import debug from './models/debug';
import ms from 'ms';

let log = debug('app'); // jshint ignore:line


// app

import koa from 'koa';

let app = koa();

app.proxy = true;
app.keys = ['baobao foods'];

export default app;


// config

let options = {
  compress: {
    // filter: function(content_type) {
    //   return /text/i.test(content_type)
    // },
    // threshold: 2048,
    // flush: require('zlib').Z_SYNC_FLUSH
  },

  fileServer: {
    root: './public',
    maxage: ms('1 hour'),
    // index: 'index.html',
    // hidden: false,
    defer: false,
  },

  polyfills: {
    path: '/js/polyfill.js',
  },

  session: {
    store: require('./models/mongoose').sessionStore,
  },

  views: {
    path: './views',
    default: 'html',
    map: {
      html: 'hogan',
    },
  },
};

if (app.env == 'development') {
  options.fileServer.maxage = 0;
}


// response time

import response from 'koa-response-time';

app.use(response());


// logger

import logger from 'koa-logger';

app.use(logger(options.logger));


// compress

import compress from 'koa-compress';

app.use(compress(options.compress));


// polyfills

import polyfills from 'koa-polyfills';

app.use(polyfills(options.polyfills));


// file server

import stat from 'koa-static';

app.use(stat(options.fileServer.root, options.fileServer));


// cros

import cors from 'koa-cors';

app.use(cors());


// session

import session from 'koa-generic-session';

app.use(session(options.session));


// view renderer

import views from 'koa-views';

app.use(views(options.views.path, options.views));


// body

import parsers from 'koa-body-parsers';

parsers(app);


// json

import json from 'koa-json';

app.use(json());


// router

import indexRoutes from './routes/index';

app
  .use(indexRoutes);
