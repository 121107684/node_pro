$(function(){	
	
	var userEdit = angular.module('userEdit',[]);	
	 	userEdit.controller("userController",function($scope,$http){		
		$http.get("/settings/userBaseInfo").success(function(data){
			formInp(data)
			$scope.editIng = function(){	
				if(
					$scope.username !=data.username && $scope.username != null ||
					$scope.email !=data.email && $scope.email != null ||
					$scope.password !=data.password && $scope.password != null)
				{
					$scope.editTrue=false;
					$scope.editReturn=false;
				}else{
					$scope.editTrue=true;
					$scope.editReturn=true;
				}
			};
			
			$scope.returnEdit = function(){
				formInp(data);
			}
			//基本信息修改
			$scope.saveBaseEdit = function(){
				var eidtBase = $("#userBaseinfo").serializeArray();
				$http.post("/settings/editUserBase",{
					data:eidtBase
				}).success(function(data){
					if(data.code == 200){
						formInp(data.text);
						$("#loginEditError").removeClass("hide").addClass("show").text(data.msg);
					}
				}).error(function(data){
					$("#loginEditError").removeClass("hide").addClass("show").text(data.msg);
				})
			}
			
		})
		//填表方法
		var formInp = function(data){
				$("#userBaseinfo input[type=text]").each(function(){
					var name = $(this).prop("name");
					$(this).val(data[name]);
					$scope.editTrue=true;
					$scope.editReturn=true;
				});
			}
	});
	
	
	var userInfoEdit = angular.module("userInfoEdit",[]);
		userInfoEdit.controller("userInfoEdit",function($scope,$http){
			$http.get("/settings/userOtherInfo").success(function(data){
				console.log(data.msg.length)
				if(data.code == 202 || data.msg.length==0){
					$scope.appellation = "一块快乐的好丽友";
					$scope.phoneNumber = "480G*12";
					$scope.address = "Carrefour";
					$scope.qq = "12块三";
					$scope.leave = "为了防止NODE门事件，程序员吃了都说好！";
				}else if(data.code == 200){
					$scope.appellation = data.msg[0].appellation ;
					$scope.phoneNumber = data.msg[0].phoneNumber ;
					$scope.address = data.msg[0].address ;
					$scope.qq = data.msg[0].qq ;
					$scope.leave = data.msg[0].leave ;
				}
			})
			$scope.saveUserInfo = function(){
				
				
			}
	});


	
	(function(){
		
		$("#editUserInfo").on("click",function(){
			var editInfo = $("#addUserInfo").serializeArray();
			var userimg = $("#userImg").val();
			//console.log(userimg);
			var dataImg = new FormData();
				dataImg.append("file", $("#userImg")[0].files[0]);
				
				for(i in editInfo){
					console.log(editInfo[i].value)
					//if(editInfo[i].value!=''){
						dataImg.append("name",editInfo[i].name);
						dataImg.append("value",editInfo[i].value?editInfo[i].value:' ')
					//}	
				}	
				
			$.ajax({
				type:"post",
				url:"/settings/addUserInfo",
				cache: false, 
	            processData: false,  
	            contentType: false,
	            dataType:"json",
				data:dataImg,
				success:function(data){
					console.log("data"+data);
				}
			})
		})
		
		
		/* Limited */
		$(".tag-select-limited").chosen({
			max_selected_options: 5
		});

		/* Overflow */
		$('.overflow').niceScroll();
	})();
	
	
	angular.bootstrap(document.getElementById("userEdit"), ['userEdit']);
	angular.bootstrap(document.getElementById("userInfoEdit"), ['userInfoEdit']);
});

 