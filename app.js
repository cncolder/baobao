// require

import debug from './lib/debug';
import ms from 'ms';

let log = debug('app'); // jshint ignore:line


// db

import db from './lib/lowdb';


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
    maxAge: ms('1 hour'),
    // index: 'index.html',
    // hidden: false,
    defer: false,
  },

  polyfills: {
    path: '/js/polyfill.js',
  },

  session: {},

  views: {
    path: './views',
    default: 'html',
    map: {
      html: 'hogan',
    },
  },

  mail: {
    to: db('config').getById('customer_services').emails,
  },
};

if (app.env == 'development') {
  options.fileServer.maxAge = 0;
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

import session from 'koa-session';

session(options.session, app);


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

import Router from 'koa-router';

let router = new Router();

import nodemailer from 'nodemailer';

let mailer = nodemailer.createTransport();

router
  .get('/', function*() {
    yield this.render('layout', {
      partials: {
        content: 'index',
      },
      title: '包包',
    });
  })
  .get('/pospal', function*() {
    return this.redirect([
      'http://',
      this.query.shop,
      '.pospal.cn/m?qrc=',
      this.query.addr,
    ].join(''));
  })
  .post('/mail/contact_me.php', function*(next) {
    let body = yield * this.request.urlencoded();
    let email = {
      to: options.sendgrid.to,
      from: body.email,
      subject: '包包网站信息反馈',
      text: `${body.message}\n\n  ${body.name}  ${body.phone}`,
    };

    mailer.sendMail(email, function(err, res) {
      if (err) {
        log.e(err);
      }
      log(res);
    });

    this.status = 201;
    yield next;
  });

app
  .use(router.routes());
