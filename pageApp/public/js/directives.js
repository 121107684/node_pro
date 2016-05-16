var Directives = angular.module('Directives', []);
/*顶部导航*/
Directives.directive('headermsg',[function(){
    	return {
	        restrict: 'AE',
	        scope:{},
		    replace:false,
	        templateUrl:'tpls/publicmodel/header.html',
	        controller:"headerCtrl",
	    }
}]);
/*左侧信息栏*/
Directives.directive('sidebar',[function(){
    	return {
	        restrict: 'AE',
	        scope:{},
		    replace:true,
		    templateUrl:'tpls/publicmodel/sidebar.html',
	        controller: "sliderBarCtrl"
	    }
}]);
Directives.directive('openusercon',[function(){
	return {
			restrict: 'AE',
	        scope:{},
			link:function(scope, element,  attrs){
				element.on("click",function(){
					element.toggleClass("open")
				})
			}
	    }
}])
/*顶部看留言*/
Directives.directive('messages',[function(){
    	return {
	        restrict: 'AE',
	        scope:{},
		    replace:true,
		    templateUrl:'tpls/publicmodel/Messages.html',
	        controller: "MessagesCtrl"
	    }
}]);
/*报错信息等*/
Directives.directive('notifications',[function(){
    	return {
	        restrict: 'AE',
	        scope:{},
		    replace:true,
		    templateUrl:'tpls/publicmodel/Notifications.html',
	        controller: "NotificationsCtrl"
	    }
}]);
/*面包屑导航*/
Directives.directive('breadcrumb',[function(){
    	return {
	        restrict: 'AE',
	        scope:{},
		    replace:false,
		    templateUrl:'tpls/publicmodel/breadcrumb.html',
	    }
}]);


/*抓主要部分取*/
Directives.directive('media',[function(){
    	return {
	        restrict: 'AE',
		    replace:true,
		    controller:'mediahtml',
		    templateUrl:'tpls/htmlparser/media.html',
	    }
}]);
/*网页抓取相关-来源*/
Directives.directive('addnewhtml',[function(){
    	return {
	        restrict: 'AE',
	        scope:{},
		    replace:true,
		    controller:'addnewhtml',
		    templateUrl:'tpls/htmlparser/addnewhtml.html',
	    }
}]);
/*抓取banner图部分*/
Directives.directive('banner',[function(){
    	return {
	        restrict: 'AE',
	        scope:{},
		    replace:true,
		    templateUrl:'tpls/htmlparser/banner.html',
	    }
}]);
/*资源贡献者*/
Directives.directive('goodjob',[function(){
    	return {
	        restrict: 'AE',
	        scope:{},
		    replace:true,
		    templateUrl:'tpls/htmlparser/goodjob.html',
	    }
}]);
/*信息列表*/
Directives.directive('listviewheader',[function(){
    	return {
	        restrict: 'AE',
	        scope:{},
		    replace:true,
		    templateUrl:'tpls/htmlparser/listviewheader.html',
	    }
}]);
/*资源所占比重*/
Directives.directive('proportion',[function(){
    	return {
	        restrict: 'AE',
	        scope:{},
		    replace:true,
		    templateUrl:'tpls/htmlparser/proportion.html',
	    }
}]);
/*精品推荐*/
Directives.directive('recommend',[function(){
    	return {
	        restrict: 'AE',
	        scope:{},
		    replace:true,
		    templateUrl:'tpls/htmlparser/recommend.html',
	    }
}]);