var express = require('express');
var users = express.Router();

/* GET users listing. */
users.get('/', function(req, res, next){
  var usedata;
  var User = global.usersdb.getModel('usertab');
  User.find({},function(err,doc){
    if(err){

    }else if(doc){
      res.send(doc);
    }

  })

});

module.exports = users;
