// Set configuration
            seajs.config({  
                base: "http://127.0.0.1:3000/",
                alias:{
                    "jquery":"framework/jquery.min.js",
                    
                    "app":"js/app.js",
                    "controllers":"js/controllers.js",
                    "directives":"js/directives.js",
                    "filters":"js/filters.js",
                    "services":"js/services.js",                    
                    
                    "autosize":"framework/autosize.min.js",
                    "angular":"framework/angular/angular.js",
                    "angular-sanitize":"framework/angular/angular-sanitize.min.js",//过滤html标签
                    "angular-animate":"framework/angular/angular-animate.min.js", //动画
                    "angular-cookies":"framework/angular/angular-cookies.min.js",
                    "angular-loader":"framework/angular/angular-loader.min.js",
                    "angular-messages":"framework/angular/angular-messages.min.js",
                    "angular-mocks":"framework/angular/angular-mocks.js", //单元测试
                    "angular-resource":"framework/angular/angular-resource.min.js",
                    "angular-route":"framework/angular/angular-route.min.js", //路由
                    "angular-ui-router":"framework/angular/angular-ui-router.js", //路由
                    "angular-scenario":"framework/angular/angular-scenario.min.js", //场景测试
                    "angular-touch":"framework/angular/angular-touch.min.js", //移动端
                    "angular-ui-bootstrap":"framework/angular/ui-bootstrap-tpls.js", //移动端
                    
                    "bootstrap":"framework/bootstrap.min.js",
                    "calendar":"framework/calendar.min.js",
                    "chosen":"framework/chosen.min.js",
                    "charts":"framework/charts.js",
                    "easypiechart":"framework/easypiechart.js",
                    "fileupload":"framework/fileupload.min.js",
                    //"feeds":"framework/feeds.min.js",
                    "functions":"framework/functions.js",
                    "icheck":"framework/icheck.js",
                    "jquery-easing":"framework/jquery.easing.1.3.js",
                    "jquery-ui":"framework/jquery-ui.min.js",
                    "jquery.flot":"framework/charts/jquery.flot.js",
                    "jquery.flot.time":"framework/charts/jquery.flot.time.js",
                    "jquery.flot.animator":"framework/charts/jquery.flot.animator.min.js",
                    "jquery.flot.resize":"framework/charts/jquery.flot.resize.min.js",
                    "jquery.json-2.3.min":"framework/jquery.json-2.3.min.js",
                    "jvectormap":"framework/maps/jvectormap.min.js",
                    "usa":"framework/maps/usa.js",
                    "slider":"framework/slider.min.js",
                    "select":"framework/select.min.js",
                    "scroll":"framework/scroll.min.js",
                    "sparkline":"framework/sparkline.min.js",
                    "toggler":"framework/toggler.min.js",
                    "settings":"framework/webcontrol/settings.js",
                    "htmlparser":"framework/webcontrol/htmlparser.js",
                }
            });
            
            seajs.use("angular",function(){
       			seajs.use(["angular-ui-router","angular-animate","angular-route","angular-ui-bootstrap","icheck","functions"],function(){        	     
	                seajs.use(["app","controllers","directives","services","filters"])
	            });
            })
            
            seajs.use("jquery",function(){  
               	 if(location.href.indexOf("login" || "register") > 0){
               	 	
               	 }
            	/*seajs.use("autosize");           	
                seajs.use("bootstrap");
                seajs.use("calendar");
                seajs.use("chosen");                
                                
                seajs.use("fileupload");
                //seajs.use("feeds");
                seajs.use("icheck");                
                seajs.use("jquery-easing");
                seajs.use("jquery-ui");
                seajs.use("jquery.json-2.3.min");
                seajs.use("jquery.flot",function(){
                	seajs.use("jquery.flot.time")
                	seajs.use("jquery.flot.animator")
                	seajs.use("jquery.flot.resize")
                	seajs.use("easypiechart");	             	
                });
                 
                seajs.use("jvectormap",function(){
                	seajs.use("usa");      
                });
                               
                seajs.use("slider");
                seajs.use("select");
                seajs.use("scroll");
                seajs.use("sparkline",function(){
                	seajs.use("charts");
                });               
                seajs.use("toggler");
                seajs.use("functions");*/
               
            });

            // For development