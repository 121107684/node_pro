
var MyCtrls = angular.module('MyCtrls', []);

MyCtrls.controller('loginCtrl', ['$scope','$location','$state','$rootScope',"myPostData",//loginServices已经由$injector实例化
    function($scope,$location,$state,$rootScope,myPostData) {
        $scope.userBase ={"account":"baiyang","password":"baiyangby311","autologin":false}
        $scope.userLogin = function(){
        	myPostData.datas($scope.userBase,"/login").success(function(data){
	        	if(data.code==200){
	        		$rootScope.userinfo = data.userinfo;
					$state.go("app.index")
	        	}
	        })
        }
         $scope.autoToggle = function(){
         	$scope.userBase.autologin = !$scope.userBase.autologin
         }
        angular.element(document).ready(function() {
		  	icheck();
		});
    }
]);

MyCtrls.controller('RegisterCtrl', ['$scope',
    function($scope){
       
    }
]);

MyCtrls.controller('findPasswordCtrl', ['$scope',
    function($scope) {
        $scope.pageClass="findPassword";
    }
]);
/*顶级控制器*/
MyCtrls.controller('indexCtrl', ['$scope','$rootScope',
    function($scope,$rootScope) {
        //$scope.isToggled = false;
        $scope.closeModel = function(event){
        	$rootScope.$emit('closeModel','closeModel');
        };
        
        $rootScope.$on('menutoggle',function(event){
        	$scope.isToggleds = !$scope.isToggleds;
        })
        
    }
]);
/* 顶部控制器*/
MyCtrls.controller('headerCtrl', ['$scope','$rootScope',
    function($scope,$rootScope){
    	 $scope.menuToggle = function($ev){
        	$rootScope.$emit('menutoggle')
        }
        $scope.msgBoxIn = function($ev){
        	$ev.stopPropagation();
        	$scope.msgId = $ev.currentTarget.getAttribute('data-drawer');
        	$rootScope.$emit('msgAndNot',$scope.msgId);
        }
    }
]);
/* 提醒1控制器*/
MyCtrls.controller('MessagesCtrl', ['$scope','$rootScope','myGetData',
    function($scope,$rootScope,myGetData){
    	myGetData.datas("/addMessage/msgList").success(function(data){
    		$scope.msgListinfo = data;
    	})
    	$scope.isShow = false;
        $rootScope.$on('msgAndNot',function(event,strs){
        	
        	if(strs == 'messages'){
        		$scope.isShow = !$scope.isShow;
        	}
        })
        $rootScope.$on('closeModel',function(event){
        	if($scope.isShow){
        		$scope.isShow = false;
        	}
        })
    }
]);
/* 提醒2控制器*/
MyCtrls.controller('NotificationsCtrl', ['$scope','$rootScope',
    function($scope,$rootScope) {
        $scope.isShow = false;
        $rootScope.$on('msgAndNot',function(event,strs){       	
        	if(strs == 'notifications'){
        		$scope.isShow = !$scope.isShow;
        	}
        })
        $rootScope.$on('closeModel',function(event){
        	if($scope.isShow){
        		$scope.isShow = false;
        	}
        })
    }
]);

/* 右侧NAV控制器*/
MyCtrls.controller('sliderBarCtrl', ['$scope','$rootScope','myGetData','$state',
    function($scope,$rootScope,myGetData,$state){
    	$scope.isToggled = false;
        $rootScope.$on('menutoggle',function(event,strs){
        	$scope.isToggled = !$scope.isToggled;
        })
        if(!$rootScope.userinfo){
	        	myGetData.datas('/settings/userOtherInfo').success(function(data){
	        	$scope.appellation = data.msg[0].appellation;
	        	$scope.userimg = '/Upload/'+data.msg[0].userimg;
	        })
        }else{
        	$scope.appellation = $rootScope.userinfo.appellation;
	        $scope.userimg = '/Upload/'+$rootScope.userinfo.userimg;
        }
        
        $scope.logout = function(){
        	myGetData.datas("/logout").success(function(data){
        		if(data.code==200){
        			$state.go("loginindex.login")
        		}
        	})
        		
        }
    }
]);

/*用户基本信息控制器*/
MyCtrls.controller('userController',['$scope','$rootScope','myGetData',
	function($scope,$rootScope,myGetData){
		$scope.userBaseinfo = {};
		myGetData.datas('/settings/userBaseInfo').success(function(data){
			$scope.userBaseinfo.account = data.account;
			$scope.userBaseinfo.username = data.username;
			$scope.userBaseinfo.email = data.email;
			$scope.userBaseinfo.password = data.password;
				
        })
	}]);
/*用户详细信息控制器*/
MyCtrls.controller('userInfoEdit',['$scope','$rootScope','myGetData',
	function($scope,$rootScope,myGetData){
		myGetData.datas('/settings/userOtherInfo').success(function(data){
			$("#userInfoEdit input[type=text]").each(function(){
				var name = $(this).prop("name");
				$(this).val(data.msg.name);
			});		
        })
	}]);
/*用户基本信息列表控制器*/	
MyCtrls.controller('usersList',['$scope','$rootScope','myGetData',
	function($scope,$rootScope,myGetData){
		console.log("usersList")
		$scope.userBaseinfo = {};
		myGetData.datas('/users').success(function(data){
			$scope.userlist = data;	
        })
	}]);

/*网页抓取来源列表*/
MyCtrls.controller('addnewhtml',['$scope','$rootScope','myGetData','myPostData',
	function($scope,$rootScope,myGetData,myPostData){
		$scope.userBaseinfo = {};
		myGetData.datas('/htmlparser/modelList').success(function(data){
			$scope.modelList = data;
       });
       $scope.addNewMoive = function(url){
	       	$scope.htmlform = {
	       		'id':""
	       	}
	       	myPostData.datas($scope.htmlform,'/htmlparser/'+url).success(function(data){
	       		console.log(data)
	       	})
       }
	}]);
/*抓取的电影列表*/
MyCtrls.controller('mediahtml',['$scope','$rootScope','$modal','myGetData',
	function($scope,$rootScope,$modal,myGetData){
	   	myGetData.datas('/htmlparser/moviesList').success(function(data){
	   		$scope.moviesList=data;
	   	});
	   	
	   	$scope.infoEdit = function(id,size){
	    	var modalInstance = $modal.open({
				templateUrl:'tpls/htmlparser/movieInfo.html',
				controller:'ModalMovieInfoCtrl',
				size:size
				/*resolve: {
					items: function() {
						return $scope.items;
					}
				}*/
			});
			modalInstance.result.then(function() {
				//$scope.selected = selectedItem;
				},function() {
					//$log.info('Modal dismissed at: ' + new Date());
			});
		}
	}
]);

MyCtrls.controller('ModalMovieInfoCtrl',function($scope, $modalInstance,shareMovieInfo){
	$scope.modelShow = 'mInfp';
	$scope.changInfo = function(modelName){
		$scope.modelShow = modelName;
	}
	
	
	$scope.ok = function() {
		$modalInstance.close();
	};

	$scope.cancel = function() {
		$modalInstance.dismiss();
	};
});

MyCtrls.controller('cinemahtml',function($scope,myGetData){
	myGetData.datas('/htmlparser/cinemaList').success(function(data){
	   	$scope.cinemaList=data;
	});
});
/*MyCtrls.controller('movieInfo',['$scope','$rootScope','myGetData','myPostData',
	function($scope,$rootScope,myGetData,myPostData){
		console.log("aaa")
	}]);*/
/**
 * 这里接着往下写，如果控制器的数量非常多，需要分给多个开发者，可以借助于grunt来合并代码
 */