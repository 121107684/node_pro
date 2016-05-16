var nodeAndAngularApp = angular.module('nodeAndAngularapp', ['ngAnimate','ui.bootstrap','ngRoute','ui.router','MyCtrls','MyService','Directives','myFilters']);

/*nodeAndAngularApp.run(function($templateCache){
	$templateCache.put("tpls/login/Register.html")
	$templateCache.put("tpls/login/findPassword.html")
})
*/

nodeAndAngularApp.config(function($urlRouterProvider, $stateProvider){
    $urlRouterProvider.otherwise('loginindex/login');
    
    $stateProvider.state("loginindex",{
    	url:"/loginindex",
    	views:{
    		'':{
    			transclude:true,
				templateUrl:'tpls/login/loginindex.html',
    		},
    	}
    })
    .state("loginindex.login",{
    	url:"/login",
    	views:{
    		'main@loginindex':{
    			transclude:true,
    			controller: "loginCtrl",
				templateUrl:'tpls/login/login.html',
    		},
    	}
    })
    .state("loginindex.Register",{
      	url: '/Register',
    	views:{
    		'main@loginindex':{
    			transclude:true,
				templateUrl:'tpls/login/Register.html',
				controller: "RegisterCtrl"
    		}
    	}
    })
    .state("loginindex.findPassword",{
       	url: '/findPassword',
    	views:{
    		'main@loginindex':{
    			transclude:true,
				templateUrl:'tpls/login/findPassword.html',
    		}
    	}
    })
    .state("app",{
    	url:"/app",
    	views:{
    		'':{
    			transclude:true,
				templateUrl:'tpls/publicmodel/base.html',
    		},
    	}
    })
    .state("app.index",{
    	url:"/index",
    	views:{
    		'main@app':{
    			transclude:false,
				templateUrl:'tpls/index/main.html',
    		},
    	}
    })
    .state("app.settings",{
    	url:"/settings",
    	views:{
    		'main@app':{
    			transclude:false,
				templateUrl:'tpls/settings/main.html',
    		},
    	}
    })
    .state("app.users",{
    	url:"/users",
    	views:{
    		'main@app':{
    			transclude:false,
				templateUrl:'tpls/users/main.html',
    		},
    	}
    })
    .state("app.htmlparser",{
    	url:"/htmlparser",
    	views:{
    		'main@app':{
    			transclude:false,
				templateUrl:'tpls/htmlparser/main.html',
    		},
    	}
    })
 	.state("app.htmlparser.movieList",{
    	url:"/movieList",
    	templateUrl:'tpls/htmlparser/media.html',
    	controller:'mediahtml'
    })
 	
  	.state("app.htmlparser.cinemaList",{
    	url:"/cinemaList",
    	templateUrl:'tpls/htmlparser/cinema.html',
    	controller:'cinemahtml'
    })
});


