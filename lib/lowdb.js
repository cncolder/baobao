import debug from './debug';
import lowdb from 'lowdb';
import underscoreDb from 'underscore-db';

let log = debug('lowdb'); // jshint ignore:line
let dbfile = (process.env.LOWDB_DIR || '') + 'db.json';


// open db file

log(`open file ${dbfile}`);

let db = lowdb(dbfile);


// mixin db function

db._.mixin(underscoreDb);


// fixture

let config = db('config');
let cs = config.getById('customer_services');
if (!cs) {
  config.insert({
    id: 'customer_services',
    emails: [''],
  });
}


// export

export default db;
