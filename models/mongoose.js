import debug from './debug';
import mongoose from 'mongoose';
import SessionStore from 'koa-generic-session-mongo';

const NODE_ENV = process.env.NODE_ENV || 'development';

let log = debug('mongoose');

if (NODE_ENV == 'development') {
  let url = 'mongodb://127.0.0.1:27017/baobao?auto_reconnect=true';

  mongoose.connect(url);
  mongoose.set('debug', log);
  mongoose.sessionStore = new SessionStore({
    url: url,
  });
} else if (process.env.NODE_ENV === 'test') {
  let url = 'mongodb://127.0.0.1:27017/?auto_reconnect=true';

  mongoose.connect(url);
  mongoose.sessionStore = new SessionStore({
    url: url,
  });
} else if (process.env.MONGO_URL) {
  let url = process.env.MONGO_URL;

  mongoose.connect(url);
  mongoose.sessionStore = new SessionStore({
    url: url,
  });
}

module.exports = mongoose;
