$(function(){
	var htmlModelList = angular.module("parserMain",[]);
		
		htmlModelList.controller("moduleList",function($scope,$http,$sce){
			$http.get("/htmlparser/modelList").success(function(data){
					$scope.modelLists = data;
				});
				
			$http.get("/htmlparser/contentList").success(function(data){
					if(data.code==200){
						$.each(data.conenctList, function(i){   
							var sAccount = data.conenctList[i].account;
							//console.log(sAccount)
							$.each(data.userinfoList, function(x) {   
								  if(sAccount==data.userinfoList[x].account){
								  		var resultJsonObject={};  
								        for(var attr in data.conenctList[i]){ 
								            resultJsonObject[attr]=data.conenctList[i][attr];  
								        }
								        for(var attr in data.userinfoList[x]){
								            resultJsonObject[attr]=data.userinfoList[x][attr];
								        }
								        //console.log(resultJsonObject)
								        data.conenctList[i]= resultJsonObject;    
								  }
							});
							
							data.conenctList[i].htmldate= new Date(parseInt(data.conenctList[i].htmldate)).toLocaleString().replace(/:\d{1,2}$/,' ');
							
						});
					}	
					
					$scope.contentHtml = $sce.trustAsHtml(data.conenctList);

			});
			$scope.selectfun = function(){
				$('#selected').selectpicker();
			}
			
			$scope.fromChange = function(){
				
			};
			//绑定单击添加来源网页
			$scope.newParserHtml = function(){
				//serializeArray生成了数组，而serialize则生成了经过编译的字符串
				var data = $("#addHtmlForm").serializeArray()
				$http.post("/htmlparser/addHtmlModel",{
					data : data
				}).success(function(datas){
					if(datas.code==200){
						if(document.all) {
							document.getElementById("closeaddHTML").click();
						}
						// 其它浏览器
						else {
							var e = document.createEvent("MouseEvents");
							e.initEvent("click", true, true);
							document.getElementById("closeaddHTML").dispatchEvent(e);
						}		
					};
					$scope.modelLists = datas.newsList;
				}).error(function(data){
					
				})
			}
			
			$scope.newHtmlInfo = function(){
				var data = $("#addHtmlInfo").serializeArray();
				//console.log(data)
				$http.post("/htmlparser/addHtmlcontent",{
					data:data
				}).success(function(datas){
					if(datas.code==200){
						var resultJsonObject={};  
						for(var attr in datas.msg){ 
							resultJsonObject[attr]=datas.msg[attr];  
						}
						for(var attr in datas.user[0]){
							resultJsonObject[attr]=datas.user[0][attr];
						}
						console.log(resultJsonObject);
						resultJsonObject.htmldate= new Date(parseInt(resultJsonObject.htmldate)).toLocaleString().replace(/:\d{1,2}$/,' ');
						$scope.contentHtml.unshift(resultJsonObject);
						$("#new-html-info").modal("hide");
					}
				})
			}
			
			
		})
		
		
	angular.bootstrap(document.getElementById("parserMain"), ['parserMain']);
	

})