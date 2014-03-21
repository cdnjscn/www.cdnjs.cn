var Project = require('../models/project'),
	_ = require('underscore');

exports.index = function(req, res) {
	  Project.find({name: new RegExp(req.query.q,'i')},function(err,data){
		  
		  _.map(data,function(v){
			  var version = v.version;
			  v.assets = _.find(v.assets,function(item){
				  return item.version == version;
			  });
		  });
		  
		  res.render('search',{title:'搜索',list:data});
	  });
    
};