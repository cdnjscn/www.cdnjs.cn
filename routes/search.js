var Project = require('../models/project'),
	reSort = require('../util').reSort,
	_ = require('underscore');

exports.index = function(req, res) {
	  Project.find({name: new RegExp(req.query.q,'i')},function(err,data){
		  
		  _.map(data,function(v){
			  var version = v.version,files = v.assets[0].files;
			  v.assets = _.find(v.assets,function(item){
				  return item.version == version;
			  });
			  reSort(files,v);
			  v.hasExt = files.length > 2;
		  });
		  
		  res.render('search',{title:'搜索',list:data});
	  });
    
};