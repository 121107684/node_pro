/**
 * Created by baiy on 2016/5/11.
 */
var express = require('express');
var http = require('http');

var appmovie = express.Router();
var moviecount = 0;//��Ӱ������


(function(){
    var moviesinfo = global.usersdb.getModel('moviesinfo');
    moviesinfo.find({},function(err,conenctList){
        if(err){
            console.log("��Ӱ���ݴ���")
        }else if(conenctList){
            console.log('movieall��'+conenctList.length);
            moviecount = conenctList.length;
        }
    });
})()

appmovie.post('/moviesList',function(req,res){
    var page = req.body.page; //��ǰҳ��
    console.log(page);
    console.log(moviecount);

    var moviesinfo = global.usersdb.getModel('moviesinfo');
        moviesinfo.find({},{
            'movieId':1,
            'movieImg':1,
            'movieTitle':1
        },function(err,allmovie){
            if(err){
                res.send({code:201,data:err,text:'û�ҵ���Ӱ��Ϣ'});
            }else if(allmovie){
                console.log(page*12+allmovie.length);
                if((page*12+allmovie.length)==moviecount){
                    res.send({code:200,data:allmovie,endmoviepage:true});
                }else{
                    res.send({code:200,data:allmovie,endmoviepage:false});
                }
            }
        }).sort({mesTime:-1}).limit(12).skip(page*12);

})

appmovie.post('/movieInfo',function(req,res){
    var movieId = req.body.id; //��ǰҳ��

    var moviesinfo = global.usersdb.getModel('moviesinfo');
    moviesinfo.find({movieId:movieId},function(err,infos){
        if(err){
            res.send({code:201,data:err,text:'û�ҵ���Ӱ��Ϣ'});
        }else if(infos){
            console.log(infos);
            res.send({code:200,data:infos});
        }
    });

})


module.exports = appmovie;
