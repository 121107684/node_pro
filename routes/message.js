/**
 * Created by baiy on 2016/2/3.
 */
var express = require('express');
var message = express.Router();

//新增
message.post("/add",function(req,res){
    var messages = global.usersdb.getModel('messages');
    var mesTitle = req.body.mesTitle,
        mesText = req.body.mesText;
    var data = new Date();
    console.log(messages);
    messages.create({
        account:"baiyang",
        //account:req.session.user.account,
        mesTitle:mesTitle,
        mesText:mesText,
        mesTime:data.getTime()+(8*60*60*1000),
        adminText:"null",
        adminTime:data.getTime()+(8*60*60*1000)
    },function(err,doc){
        if(err){
            var usererror ={"code":200, "text":err};
            res.send(usererror);
        }else{
            var usererror ={"code":200, "text":"success"};
            res.send(usererror);
        }
    })
});
//读取
message.get("/msgList",function(req,res){
    var messages = global.usersdb.getModel('messages');
    messages.find({adminText:{$gte:'null'}},{"account":1,"mesTime":1,"_id":1,"mesTitle":1},function(err,doc){
        res.send(doc);
    }).sort({mesTime:-1}).limit(5);
});

module.exports = message;