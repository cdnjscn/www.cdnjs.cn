var mongoose = require('mongoose');
//require('../models/project');
var Project = require('../models/project');

exports.index = function(req, res) {
    mongoose.connect('mongodb://localhost/test2',function(err){
	  if (err) return;
	  Project.find({name: new RegExp(req.query.q,'i')},function(err,data){
		  mongoose.disconnect();
		  res.render('search',{title:'list',list:data});
	  });
    });
};