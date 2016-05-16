var MyServiceApp = angular.module('MyService', []);

MyServiceApp.factory('myPostData', ['$http',
    function($http){
    	var doRequest=function(data, path) {
            return $http({
            	data:data,
                method: 'post',
                url: path
            });
        }
        return {
            datas: function(data, path) {
                return doRequest(data, path);
            }
        };
    }
]);

MyServiceApp.factory('myGetData', ['$http',
    function($http){
    	var doRequest=function(path) {
            return $http({
                method: 'get',
                url: path
            });
        }
        return {
            datas: function(data) {
                return doRequest(data);
            }
        };
    }
]);

MyServiceApp.service('shareMovieInfo', ['$http','myGetData',function($http,myGetData){
	var share = {
	        shareData: {},
	        getDate:function (path){
	       		return myGetData.datas(path);
	        }
   	}
   return share;
	
}]);
