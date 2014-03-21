var Project = require('../models/project');

exports.index = function(req, res) {
	  Project.find({name: new RegExp(req.query.q,'i')},function(err,data){
		  res.render('search',{title:'搜索',list:data});
	  });
    
};