var Project = require('../models/project'),
	reSort = require('../util').reSort,
	_ = require('underscore'),
	async = require('async');

exports.index = function(req, res){
	async.parallel({
		page: function (callback) {
			callback(null,{
				title: req.params.pname + ' - ' + 'cdnjs.cn'
			})
		},
		project: function (callback) {
  		  Project.findOne({name:req.params.pname},function(err,data){
  			  if (!data) {
  				  res.send(500);
  				  return;
  			  }
			  var temp = null,lastestIndex = 0;
  			  _.each(data.assets,function(v,i){
  					reSort(v.files,data);
  					v.hasExt = v.files.length > 2;
					
  				  	if(v.version == data.version && i > 0){
					  lastestIndex = i;
  				  	}
  			  });
			  
			  if(lastestIndex){
				  temp = data.assets.splice(lastestIndex,1);
				  data.assets.unshift(temp[0]);
				  temp = null;
				  lastestIndex = 0;	
			  }
  			  callback(err,data);
  		  });
		}
	}, function(err,json){
		res.render('project',json);
	});	  
};