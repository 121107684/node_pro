/**
 * Created by baiy on 2016/1/7.
 */

var mongoose = require('mongoose');
var schema = mongoose.Schema;
var models = require('./models');

for (var m in models){
    mongoose.model(m , new schema(models[m]));
}

module.exports = {
    getModel: function(type){
        return _getModel(type);
    }
};

var _getModel = function(type){
    return mongoose.model(type);
};



