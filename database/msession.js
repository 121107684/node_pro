/**
 * Created by baiy on 2016/1/6.
 */
 var Settings = require('./settings');
 var Db = require('mongodb').Db;
 var Server = require('mongodb').Server;
 var db = new Db(Settings.db, new Server(Settings.HOST, Settings.PORT, {auto_reconnect:true, native_parser: true}),{safe: true});

 module.exports = db;