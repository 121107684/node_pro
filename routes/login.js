var express = require('express');
var login = express.Router();
/* GET home page. */
/*
login.get('/', function(req, res, next) {
    res.redirect('login');
});
*/

login.route('/')
    .get(function(req, res){
       /* if (req.session.user) {
            res.redirect('/index');
        }*/
        res.render('app', { title: '用户登录'});
    })

login.post(("/login"),function(req, res) {
    var User = global.usersdb.getModel('usertab');
    var userinfos = global.usersdb.getModel('userinfo');
    User.findOne({account:req.body.account},function(err,doc) {
        if(err){
            var usererror ={"code":500, "text":"网络错误","path":"login"};
            res.send(usererror);
        }else if(!doc){
            var usererror ={"code":202, "text":"未找到该用户","path":"login"};
            res.send(usererror);
        }else{
            if(req.body.password != doc.password){
                var usererror ={"code":202, "text":"登录密码错误","path":"login"};
                res.send(usererror);
            }else{
                req.session.user = doc;
                userinfos.findOne({account:req.session.user.account},function(err,docs){
                    if(err){
                        var usererror ={"code":200, "text":"登录成功","userinfo":doc};
                        res.send(usererror);
                    }else{
                        var userinfos = eval('('+(JSON.stringify(doc)+JSON.stringify(docs)).replace(/}{/,',')+')');
                        var usererror ={"code":200, "text":"登录成功","userinfo":userinfos};
                        res.send(usererror);
                    }
                })


            }
        }
    });
});

login.get(("/logout"),function(req,res){
    req.session.user=null;
    res.send({code:200,text:"退出成功"})
})

login.route("/register")
    .get(function(req,res){
        res.redirect('login');
    })
    .post(function(req,res){
    var User = global.usersdb.getModel('usertab');
    var account = req.body.account, //
        username = req.body.username, //
        email = req.body.email,
        password = req.body.password,
        confirmPassword = req.body.confirmPassword;
    //console.log(req);
    User.findOne({account: account},function(err,doc){
        if(err){
            var usererror ={"code":200, "text":"网络异常错误","path":"register"};
            res.send(usererror);
        }else if(doc){
            var usererror ={"code":200,"text":"用户名已存在","path":"register"};
            res.json(usererror);
        }else{
            User.create({
                account: account,
                username: username,
                email: email,
                password: password
            },function(err,doc){
                if (err) {
                    var usererror ={"code":200,"text":"网络异常错误","path":"register"};
                    res.send(usererror);
                } else {
                    var usererror ={"code":200,"text":"用户创建成功","path":"register"};
                    res.send(usererror);
                }
            });
        }
    });
});

module.exports = login;
