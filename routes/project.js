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
  			  _.each(data.assets,function(v){
  					reSort(v.files,data);
  					v.hasExt = v.files.length > 2;
  			  });			  
  			  callback(err,data);
  		  });
		}
	}, function(err,json){
		res.render('project',json);
	});	  
};