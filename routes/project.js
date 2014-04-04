var Project = require('../models/project'),
	reSort = require('../util').reSort,
	_ = require('underscore');

exports.index = function(req, res){
      
		  Project.findOne({name:req.params.pname},function(err,data){
			  if (!data) {
				  res.send(500);
				  return;
			  }
			  data.title = data.name;
			  
			  _.each(data.assets,function(v){
					reSort(v.files,data);
					v.hasExt = v.files.length > 2;
			  });
			  
			  res.render('project',data);
		  });
};