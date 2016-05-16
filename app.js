var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var session = require('express-session');
var Settings = require('./database/settings');
var multer = require('multer');
var mongoose=require('mongoose');

var app = express();

//设置跨域访问
app.all('/app*/*', function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
    res.header("X-Powered-By",' 3.2.1');
    res.header("Content-Type", "application/json;charset=utf-8");
    next();
});

// view engine setup
app.set('views', path.join(__dirname+'/pageApp/public', 'tpls'));
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');

// uncomment after placing your favicon in /public
app.use(favicon(path.join(__dirname, 'pageApp/public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser({uploadDir: './Upload'}));

app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'pageApp/public')));

//session
app.use(session({
    cookie: {maxAge:Settings.cookietime},
    secret: Settings.COOKIE_SECRET
}));

app.use(function(req, res, next){
    res.locals.user = req.session.user;
    next();
});

app.all('*',function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Content-Length, Authorization, Accept, X-Requested-With , yourHeaderFeild');
    res.header('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS');
    if (req.method == 'OPTIONS') {
        res.send(200);
    }
    else {
        next();
    }
});

//mongodb
app.use(multer({dest:'./'}));
global.usersdb = require('./database/usersdb.js');
global.db = mongoose.connect(Settings.URL);

var index = require('./routes/index');
var login = require('./routes/login');
var settings = require('./routes/settings');
var users = require('./routes/users');
var message = require('./routes/message');
var htmlparser = require('./routes/htmlparser');
var appmovie = require('./routes/appmovie');

app.use('/',login);
app.use('/index',index);
app.use('/settings',settings);
app.use('/users',users);
app.use('/addMessage',message);
app.use('/htmlparser',htmlparser);
app.use('/appmovie',appmovie);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res) {
    res.status(err.status || 500);
      if(req.session.user == null){
          res.redirect('login');
      }else {
          res.render('error/404', {
              message: err.message
          });
          return false;
      }
  });
}

// no stacktraces leaked to user//
app.use(function(err, req, res){
  res.status(err.status || 500);
    console.log(req.session.user);
    if(req.session.user == null){
        res.redirect('login');
    }else {
       res.render('error/404',{
            message: err.message
        });
    }
});

module.exports = app;
