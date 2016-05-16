$(function(){
	//angular读取消息等等
	var data;
	var msgList = angular.module('msgList',[]);
		var messageTB = msgList.controller('msgListcon',function($scope,$http){
			$http.get("/addMessage/msgList").success(function(data){
				//新消息条数
				var mesListNum = data.length;
				document.getElementById("msgListNum").innerHTML=mesListNum;				
				$scope.msgListinfo = data;
			});
		});
	//发送新增消息
	$("#addMessages").on("click",function(){
		var message = $("#addmessage").serialize();
		console.log(message)
		$.ajax({
			type:"post",
			url:"/addMessage/add",
			data:message,
			async:true,
			success:function(data){
				if(data.code==200){
					if(document.all) {
						document.getElementById("closeMessages").click();
					}
					// 其它浏览器
					else {
						var e = document.createEvent("MouseEvents");
						e.initEvent("click", true, true);
						document.getElementById("closeMessages").dispatchEvent(e);
					}			
				}
			},
			error:function(data){
				console.log(data);			
			}
		});
	});
})
