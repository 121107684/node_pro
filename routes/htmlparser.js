var express = require('express');
var http = require('http');    //引用url模块，处理url地址相关操作
var cheerio = require("cheerio");    //引用cheerio模块,使在服务器端像在客户端上操作DOM,不用正则表达式
var iconv = require('iconv-lite');    //解决编码转换模块
var BufferHelper = require('bufferhelper');    //关于Buffer我后面细说

var htmlparser = express.Router();

/* GET users listing. */
htmlparser.get('/', function(req, res){
    //res.render('htmlparser/parserList',{username:req.session.user.username,"basepath":"http://127.0.0.1:3000/"});
    res.render('htmlparser/parserList',{"basepath":"http://127.0.0.1:3000/"});
});

htmlparser.get('/modelList',function(req,res){
  var htmlparser = global.usersdb.getModel('htmlparser');
  htmlparser.find({},{"htmlName":1,"htmlLogoUrlClass":1,"toUrl":1},function(err,doc){
    if(err){

    }else{
      res.send(doc);
    }
  })
});

/*获取电影信息*/
htmlparser.get("/moviesList",function(req,res){
    var moviesinfo = global.usersdb.getModel('moviesinfo');
    moviesinfo.find({},{
        'movieId':1,
        'movieImg':1,
        'movieTitle':1,
        'movieDirector':1,
        'movieProtagonist':1,
        'movieType':1,
        'movieCountry':1,
        'movieFirst':1,
        'movieLong':1,
        'movieStory':1
    },function(err,conenctList){
        if(err){
            console.log("没找到电影信息");
            res.send("没找到网页列表");
        }else if(conenctList){
            res.send(conenctList);
        }
    }).sort({mesTime:-1}).limit(12);
});
/*获取影院列表*/
htmlparser.get("/cinemaList",function(req,res){
    var cinemalist = global.usersdb.getModel('cinemalist');
    cinemalist.find({},function(err,conenctList){
        if(err){
            console.log("没找到影院信息");
            res.send("没找到影院信息");
        }else if(conenctList){
            res.send(conenctList);
        }
    }).sort({mesTime:-1}).limit(7);
});




htmlparser.get("/contentList",function(req,res){
    var htmlcontent = global.usersdb.getModel('htmlcontent');
    var userinfo = global.usersdb.getModel('userinfo');
    htmlcontent.find({},function(err,conenctList){
        if(err){
            console.log("没找到网页列表");
            res.send("没找到网页列表");
        }else if(conenctList){
            //多表查询是个坑！哎，烦死算了
            var accountAcc = [];
            for(i in conenctList){
                (function(){
                    if(accountAcc.indexOf(conenctList[i].account)<0){
                        accountAcc.push(conenctList[i].account);
                    };
                })(i)
            };
            userinfo.find({"account":{"$in":accountAcc}},function(err,userinfoList){
                if(err){
                    console.log("没找到用户详情");
                    res.send("没找到用户详情");
                }else if(userinfoList){
                    console.log(userinfoList);
                    res.send({"code":200,"conenctList":conenctList,"userinfoList":userinfoList});
                }
            })
        }
    }).sort({mesTime:-1}).limit(10);
});

htmlparser.post("/addHtmlModel",function(req,res){
  var htmlparser = global.usersdb.getModel('htmlparser');
    htmlparser.insert({
      account:req.session.user.account,
      htmlName:req.body.data[0].value,
      htmlLogoUrlClass:req.body.data[1].value,
      htmlBodyClassname:req.body.data[2].value
    },function(err,doc){
      if (err) {
        var htmlerror ={"code":200,"text":"网络异常错误"};
        res.send(htmlerror);
      } else if(doc){
        //添加完成重新查询来源网站列表
        htmlparser.find({},{"htmlName":1,"htmlLogoUrlClass":1},function(err,doc){
          if(err){
            //查询出错

          }else{
            //成功，返回列表
            var htmlerror ={"code":200,"text":"创建模板成功，尝试抓取网页吧！","newsList":doc};
            res.send(htmlerror);
          }
        })
      }
    })
});

htmlparser.post("/addHtmlcontent",function(req,res){
        req.session.user =  { _id: '56a5e8adca483f2c291eac68',
            account: 'baiyang',
            username: '白杨',
            email: '121107684@qq.com',
            password: 'baiyangby311',
            __v: 0 };

        var htmlparser = global.usersdb.getModel('htmlparser');
        var userinfo = global.usersdb.getModel('userinfo');
        var moviesinfo = global.usersdb.getModel('moviesinfo');
        console.log(req.body);
        htmlparser.find({},function(err,doc){
            if(err){
                console.log(err);
            }else if(doc){
                var downloadArr = new Array();
                moviesinfo.find({},{'movieId':1},function(err,doc){
                    if(err){
                        console.log(err);
                    }else if(doc){
                        console.log(doc.length)
                        for (k in doc){
                            downloadArr[k] = doc[k].movieId;
                        }
                    }
                    //console.log(downloadArr);
                    //downloadArr数组为全部的、已经抓取的电影ID，此数组是为了去重
                });

                download('http://bj.nuomi.com/pcindex/main/filmlist?type=1',function(data){

                    var $ = cheerio.load(data,{decodeEntities: false});
                    var aHrefs = [];
                    $("#showing-movies-j .j-sliders a").each(function(i,elem){
                        aHrefs.push($(this).attr('href').substr(6))
                    });
                    var docwsID = inarray(aHrefs,downloadArr);
                    console.log(docwsID);
                    var moviesdataarr = [];
                    for(x in docwsID){
                        (function(){
                            download('http://bj.nuomi.com/film/'+docwsID[x], function (datainfo){
                                var $ = cheerio.load(datainfo, {decodeEntities: false});
                                //!*电影首图movieImg*!/
                                var movieImg = $(".w-cinema-detail .cinema-img").attr("src");
                                //!*电影标题moveTitle*!/
                                var movieTitle = $(".w-cinema-detail .content h2").text();
                                //!*电影导演movieDirector*!/
                                var movieDirector =nodetext($(".w-cinema-detail .content .de p").eq(0));
                                //!*电影主演movieProtagonist*!/
                                var movieProtagonist = strToArr( nodetext($(".w-cinema-detail .content .de p").eq(1)));
                                //!*电影类型movieType*!/
                                var movieType =  strToArr(nodetext($(".w-cinema-detail .content .de p").eq(2)));
                                //!*电影国家movieCountry*!/
                                var movieCountry =  nodetext($(".w-cinema-detail .content .de ul li").eq(0));
                                //!*电影首映movieFirst*!/
                                var movieFirst =  nodetext($(".w-cinema-detail .content .de ul li").eq(1));
                                //!*电影片长movieLong*!/
                                var movieLong =  nodetext($(".w-cinema-detail .content .de ul li").eq(2));
                                //!*电影剧情movieStory*!/
                                var movieStory = nodetext($(".w-cinema-detail .content .de p.intro .c"));
                                //!*电影海报moviePoster*!/
                                var moviePoster = [];
                                var _id =  $(".w-cinema-detail .content h2 a").attr('href').substr(6);
                                download('http://bj.nuomi.com/pcindex/main/moviepic?movieId=' + _id, function (datainfos){
                                    var jsonstr = eval('('+datainfos+')');
                                    for(j in jsonstr.data.stills){
                                        (function(){
                                            moviePoster.push(jsonstr.data.stills[j].imageUrl);
                                        })(j);
                                    }
                                    moviesinfo.create({
                                        movieId:_id,
                                        movieImg:movieImg,
                                        movieTitle:movieTitle,
                                        movieDirector:movieDirector,
                                        movieProtagonist:movieProtagonist,
                                        movieType:movieType,
                                        movieCountry:movieCountry,
                                        movieFirst:movieFirst,
                                        movieLong:movieLong,
                                        movieStory:movieStory,
                                        moviePoster:moviePoster
                                    },function(err,doc){
                                        if(err){
                                            //查询出错
                                        }else{
                                            //成功，添加进json
                                            moviesdataarr.push(doc);
                                        }
                                    });
                                })
                            });
                        })(x)
                    }
                })
            }
        })

       // var link = req.body.data[1].value;    //获取抓取的link
      // var userinfo = global.usersdb.getModel('userinfo');
        //var link = req.body.data
     /* download(link,function(data){
          var $ = cheerio.load(data,{decodeEntities: false});
          $("*").attr("style",'')
          var title  =DeleteHtml($("#activity-name").html())//过滤一家伙
          var contents  = DeleteHtml($("#js_content").remove("p[first-child]").html());
          var htmlcontent = global.usersdb.getModel('htmlcontent');
                htmlcontent.create({
                    "account":req.session.user.account,
                    "htmlForm":req.body.data[0].value,
                    "htmlUrl":req.body.data[1].value,
                    "htmlTitle":title,
                    "htmlcontents":contents,
                    "htmldate":Date.parse(new Date())
                },function(err,doc){
                    if(err){
                        var error = {"code":500,"msg":err};
                        res.send(error)
                    }else{
                        userinfo.find({"account": req.session.user.account},function(err,userinfoList){
                            if(err){
                                var data = {"code":200,"msg":doc,"user":{}};
                            }else if(userinfoList){
                                req.session.userinfo = userinfoList;
                                console.log(userinfoList[0])
                                console.log(doc);
                                var data = {"code":200,"msg":doc,"user":req.session.userinfo};
                                res.send(data)
                            }
                        })
                    }
                })
      })*/
});

/*影院信息列表抓取*/
htmlparser.post("/cinemaList",function(req,res){
    var cinemalist = global.usersdb.getModel('cinemalist');
    download('http://www.nuomi.com/cinema',function(data){
        var $ = cheerio.load(data,{decodeEntities: false});
        var cinemaArr = new Array();
        var pagers = 8;
        for (var i = 1;i<=pagers;i++){
            download('http://bj.nuomi.com/cinema/0-0/subd/cb0-d10000-s0-o-b1-f0?pn='+i,function(datas){
                var $ = cheerio.load(datas,{decodeEntities: false});
                //console.log($("#j-cinema-info-list").html())
                var localdata = new Array();
                $("#j-cinema-info-list .cinema .cinema-info").each(function(j,elem){
                   // console.log($(elem).attr("data-cinema").replace(/&quot;/g,'\''));
                    localdata.push($(elem).attr("data-cinema").replace(/&quot;/g,'\''));
                });
                //console.log(localdata.length)
                for(x in localdata){
                    var tempdata = eval('('+localdata[x]+')');
                    cinemalist.create({
                        uid: tempdata.uid, //影院ID
                        name: tempdata.name, //影院名称
                        address:tempdata.address, //影院地址
                        alias: tempdata.alias, //别名
                        city: tempdata.city,//城市
                        area: tempdata.area,//区域
                        longitude: tempdata.baidu_longitude, //经度
                        latitude: tempdata.baidu_latitude, //纬度
                        shopHours: tempdata.shopHours, //营业时间
                        overallRating: tempdata.overallRating, //评分
                        lowestGoodPrice: tempdata.lowestGoodPrice, //最低团购购票价格 ￥19800
                        lowestOrderPrice: tempdata.lowestOrderPrice, //最低选座购票价格 ￥8000
                        phone:tempdata.phone
                    },function(err,doc){
                        if(err){
                            console.log(err)
                        }else if(doc){
                            console.log("已抓取："+doc.name);

                        }
                    })

                }
            })
        }
        res.send("aaa")
    });
});




function DeleteHtml(str) {
    str =str.replace(/(^\s*)|(\s*$)/g, "");
    str =str.replace("\t","",str);
    str =str.replace("\r\n","",str);
    str =str.replace("\r","",str);
    str =str.replace("\n","",str);
    str =str.replace(" "," ",str);
    return str;
}


function download(url, callback) {
    http.get(url, function (res){
         var bufferHelper = new BufferHelper();    //解决中文编码问题
         res.on('data', function (chunk) {
            bufferHelper.concat(chunk);
         });
         res.on("end", function () {
             //注意，此编码必须与抓取页面的编码一致，否则会出现乱码，也可以动态去识别
            var val = iconv.decode(bufferHelper.toBuffer(),'utf-8');
             //var val = iconv.decode();
             callback(val);
         });
     }).on("error", function () {
         callback(null);
     });
 }

function nodetext(ele){
    var text = ele.contents().filter(function(){
        return this.nodeType === 3;
    }).text();
    return text;
}

function strToArr(str){
    if(','.indexOf(str)){
        return str.split(',')
    }else if('/'.indexOf(str)){
        return str.split('/')
    }
}
/*
arrayA:最新抓取的糯米电影ID
arrayB：数据中所以的电影ID
*/
function inarray(arrayA,arrayB){
    console.log('arrayA:'+arrayA);
    console.log('arrayB:'+arrayB);
    var reArray = [];
    for(var i = 0;i<=arrayA.length;i++){
        var isNotIn = true; //c初始值，假设是新值
        for(var j = 0;j<=arrayB.length;j++){
            if(arrayA[i]==arrayB[j]){
                isNotIn = false;
                break;
            }
        }
        if(isNotIn){
            reArray.push(arrayA[i])
        }
    }
    return reArray;
}



module.exports = htmlparser;
