// 项目数据库
var Schema = require('mongoose').Schema;
var cdnjscn = new Schema({ 
	  "name": String,
	  'g_star': Number,
	  'g_fork': Number
});
module.exports = db.model('cdnjscn', cdnjscn);
