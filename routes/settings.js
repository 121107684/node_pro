var express = require('express');
var settings = express.Router();
var fs = require("fs");
var Settings = require('../database/settings');
var path = require("path");

/* GET users listing. */
settings.get('/', function(req, res){
    res.render('settings/settings',{username:req.session.user.username,"basepath":"http://127.0.0.1:3000/"});
    //res.render('settings/settings',{username:"测试用户名","basepath":Settings.HOST});
});

settings.get('/userBaseInfo', function(req, res){
    var data = req.session.user;
    res.send(data);
  // upLoad(req,res)
});

settings.get('/userOtherInfo', function(req, res){
    var data = req.session.user;
    var Userinfo = global.usersdb.getModel('userinfo');
    Userinfo.find({account:data.account},function (err, doc) {
        if (err) {
            var editerror = {"code": 202, "msg": err};
            res.send(editerror);
        } else if (doc) {
            var editsucc = {"code": 200, "msg": doc};
            console.log(doc);
            res.send(editsucc);
        }
    });
});

settings.post('/editUserBase', function(req, res){
  var data = {"account":req.session.user.account};
  var User = global.usersdb.getModel('usertab');
    console.log(req.body.username);
  User.update({"account":data.account},{
        $set:{
          "username":req.body.data[0].value,
          "email":req.body.data[1].value,
          "password":req.body.data[2].value
        }
    },function(err,doc){
      if(err){
        var editerror ={"code":202,"msg":err};
        res.send(editerror);
      }else if(doc){

      }
  });
  User.findOne({account:data.account},function(err,doc) {
    req.session.user = doc;
    res.send({"code":200,"text":req.session.user,"msg":"修改成功！"});
  })
});

settings.post("/addUserInfo",function(req,res){

    var data = req.session.user;
    var filed = req.files;
    if(filed){
        var timestamp = Date.parse(new Date());//时间戳，凑活用了（注意少了八个时区);
        var extension = req.files.file.extension;
        var tmpPath = req.files.file.path;
        var basePath = path.dirname(__dirname);
        var targetPath =basePath+'/public/Upload/'+req.session.user.username+timestamp+'.'+req.files.file.extension;
        fs.rename(tmpPath, targetPath,function(err) {
            if(err){
                res.send({code: 200, msg:err});
            }else{
                //删除临时文件
                fs.unlink(tmpPath, function(){
                    if(err) {
                        res.send({code: 200, msg:err});
                    }
                })
            }
        })
    }

    var userinfo = global.usersdb.getModel('userinfo');
        userinfo.findOne({account:data.account},function(err,doc){
            if(err){
                 var usererror ={"code":500, "text":"网络错误"};
                 res.send(usererror);
            }else if(!doc){
                //未找到，新建
                var newData = req.body;
                var addData = arrToJson(data,newData,timestamp,extension);
                userinfo.create(addData,function(err,doc){
                    if(err){
                        var usererror ={"code":200, "text":err};
                        res.send(usererror);
                    }else{
                        var usererror ={"code":200, "text":"新增成功"};
                        res.send(usererror);
                    }
                })
            }else{
                var newData = req.body;
                var addData = arrToJson(data,newData,timestamp,extension);
                userinfo.update(
                    {"account":data.account},{
                        $set:addData
                    },function(err,doc){
                        if(err){
                            var usererror ={"code":200,"text":err};
                            res.send(usererror);
                        }else{
                            var usererror ={"code":200,"text":doc};
                            res.send(usererror);
                        }
                    })
            }
        });
     // 目标路径

});

function arrToJson(data,newData,timestamp,extension){
    var basePath = path.dirname(__dirname);// x:\work\login\routes的上一级目录
    var person = "{"+"account"+":"+"\""+data.account+"\",";
    for (i in newData.name){
        console.log(newData.value[i]);
        var tepmval = (newData.value[i]!=' ')?newData.value[i]:'';
        person = person  +"\""+ newData.name[i]  +"\":" +"\""+tepmval+"\""+",";
    };
    if(timestamp){
        person = person +"\""+"userimg"+"\":" +"\""+data.username+timestamp+"."+extension+"\",";
    }
    person = person.substr(0,person.length-1)+"}"
    var createData =  eval('('+person+')');
    return createData;
}




module.exports = settings;
