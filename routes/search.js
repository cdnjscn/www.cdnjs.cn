var mongoose = require('mongoose'),
Project = require('../models/project'),
mongoConf = require('../mongo.json');

exports.index = function(req, res) {
    mongoose.connect('mongodb://' + mongoConf.ip + ':' + mongoConf.port + '/cdnjs',function(err){
	  if (err) return;
	  Project.find({name: new RegExp(req.query.q,'i')},function(err,data){
		  mongoose.disconnect();
		  res.render('search',{title:'搜索',list:data});
	  });
    });
};