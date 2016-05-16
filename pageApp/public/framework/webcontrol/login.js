/**
 * Created by baiy on 2016/1/13.
 */
$(function(){
	//加密算法是必须的！
	var _k1 = [2034,85,45,22,65,213,65,398,356,1709,354];  
	//秘钥~
	var _Charset = {  
            'cjk': [ 'u4e00', 'u9fa5' ],    // 汉字 [一-龥]  
            'num': [ 'u0030', 'u0039' ],    // 数字 [0-9]  
            'lal': [ 'u0061', 'u007a' ],    // 小写字母 [a-z]  
            'ual': [ 'u0041', 'u005a' ],    // 大写字母 [A-Z]  
            'asc': [ 'u0020', 'u007e' ]     // ASCII 可视字符  
        };  
  
    //  
    // 加密：字符码在字符集内平移。  
    // 特点：  
    // 1. 字串越短加密效果越好，若短文不大于密钥长度，则不可破解。  
    // 2. 不增加文本的长度，即密文长度等于原文长度。  
    // 缺点：  
    // 1. 一次只能对“一个”连续值的字符集进行处理，而一般字符串中会  
    //    同时包含多个字符集中的字符。  
    // 2. 汉字平移后的字较生僻，明显体现出已被平移处理；  
    // 推荐：  
    // 适于特定类型的短字符串的处理，如：时间串、名称、标题等。  
    //  
    // 参数 cset：  
    // 用 Unicode 表示 -- 4 位十六进制，前置‘u’，  
    // 可用预定义的 _Charset 属性名标识，默认为 cjk。  
    //  
    // @param array na  - 平移量数组  
    // @param array cset  - 字符集名/范围 [ 起点, 终点 ]）  
    // @return string  - 平移后的字符串  
    //  
    String.prototype._shift = (function()  
    {  
        var _cset, _id, _beg, _len, _exp;  
  		//console.log(_cset)
        return  function( na, cset ) {  
            switch (typeof cset) {  
                case 'undefined':  
                    cset = 'asc';  
                case 'string':  
                    _cset = (cset == _id) ? null : _Charset[cset];  
                    break;  
                default: _cset = cset;  
            }  
            if ( _cset ) {  
                _beg = parseInt(_cset[0].substring(1), 16);  
                _len = parseInt(_cset[1].substring(1), 16) - _beg + 1;  
                _exp = RegExp('[\\' + _cset[0] + '-\\' + _cset[1] + ']', 'g');  
                _id  = cset;  
            }  
            var _sz = na.length,  
                _cnt = 0;  
            return  this.replace(_exp, function(s) {  
                var _c = s.charCodeAt(0) - _beg;  
                return  String.fromCharCode((_c+na[_cnt++%_sz])%_len + _beg);  
            });  
        };  
    })();  
  
  
    //  
    // 解密：字符码在字符集内平移-恢复。  
    //  
    String.prototype._unshift = (function()  
    {  
        var _cset, _id, _beg, _len, _exp;  
  
        return  function( na, cset ) {  
            switch (typeof cset) {  
                case 'undefined':  
                    cset = 'asc';  
                case 'string':  
                    _cset = (cset == _id) ? null : _Charset[cset];  
                    break;  
                default: _cset = cset;  
            }  
            if ( _cset ) {  
                _beg = parseInt(_cset[0].substring(1), 16);  
                _len = parseInt(_cset[1].substring(1), 16) - _beg + 1;  
                _exp = RegExp('[\\' + _cset[0] + '-\\' + _cset[1] + ']', 'g');  
                _id  = cset;  
            }  
            var _sz = na.length,  
                _cnt = 0;  
            return  this.replace(_exp, function(s) {  
                var _c = s.charCodeAt(0) - _beg;  
                return  String.fromCharCode((_c-na[_cnt++%_sz]%_len+_len)%_len + _beg);  
            });  
        };  
    })(); 
	
	
	
    document.getElementById("register").addEventListener("click",function(){
        var account = $(this).siblings("input[name=account]").val(), //账户名
            username = $(this).siblings("input[name=username]").val(), //用户名
            email = $(this).siblings("input[name=email]").val(),	//email
            password = $(this).siblings("input[name=password]").val(), //密码
            confirmPassword = $(this).siblings("input[name=confirmPassword]").val(); //二次密码
        	
        	if(password !==confirmPassword){
        		return false;
        	}else if(password ===confirmPassword){
	        	var datas = {
	        		"account":account,
	        		"username":username,
	        		"email":email,
	        		"password":password
	        	}
        	$.ajax({
        		type:"post", 
        		url:"/register",
        		data:datas,
        		async: true,
        		success: function(data){
                    if(data.code==200){
        				$("#registererror").removeClass("hide").addClass("show").text(data.text);
        			}
                    return false;
                },
                error: function(data){
                	alert("报错");                   
                }
        	});
        }
    });
	$("#loginuser").on("click",function(){
		var account = $(this).siblings("input[name=account]").val();
		var password = $(this).siblings("input[name=password]").val();
		var data = {"account":account,"password":password};
		$("#loginerror").removeClass("show").addClass("hide");
        ajaxLogin(data);
	});
	
	
	var ajaxLogin = function(data,isauto){
		$.ajax({
			url:'/login',
			type:'post',
			data: data,
			async: true,
        	success:function(backData){
        		if(backData.code==202){
        			$("#loginerror").removeClass("hide").addClass("show").text(backData.text);
        		}else if(backData.code==200){
        			$("#loginerror").removeClass("hide").addClass("show").text(backData.text);
        			if($("#autologin").is(":checked")){
				       	var cookieLogin =JSON.stringify(data);
				        setCookie(cookieLogin,function(){
				        	setTimeout(function(){
				        		location.href="/index";
				        	},500)
				        });	
				     }else if(isauto=="autologin"){
				     	setTimeout(function(){
			        		location.href="/index";
			        	},0)
				     }else{
				     	setTimeout(function(){
			        		location.href="/index";
			        	},500)
				     }
        		}
        	},
			error:function(data){
				if(data.code==500){
        			$("#loginerror").removeClass("hide").addClass("show").text(data.text);
        		}
			}
        });
	};
	
	
	//设置COOKIE
	function setCookie(data,callback) {
		var Days = 30;
		var exp = new Date();
		exp.setTime(exp.getTime() + Days * 24 * 60 * 60 * 1000);
		var enc =  data._shift(_k1);
		document.cookie ="nodeLogin="+ enc+";expires=" + exp.toGMTString();
		callback();
	};
	var getCookie = function(nodeLogin){
		
		nodeLogin?nodeLogin:"nodeLogin";
		var arr,reg=new RegExp("(^| )"+nodeLogin+"=([^;]*)(;|$)");
			if(arr=document.cookie.match(reg)){
				var unenc =  unescape(arr[2])._unshift(_k1);//解密
				ajaxLogin(JSON.parse(unenc),"autologin");//str TO json
			}else{
				return null;
			}
		}
	getCookie("nodeLogin");
	
	
	
	
	

})