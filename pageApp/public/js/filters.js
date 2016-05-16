var myFilters = angular.module("myFilters", []);

myFilters.filter("imgstr",function(){
	var func = function(test,elem){
        return test.replace(/&amp;/g,'&').replace(/%3A/g,':').replace(/%2F/g,'/');
    };
    return func;
});

myFilters.filter("arrToStr",function(){
	var func = function(test){
        return test.join(',');
    };
    return func;
});