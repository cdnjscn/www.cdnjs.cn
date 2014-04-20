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
			  var temp = null;
  			  _.each(data.assets,function(v,i){
  					reSort(v.files,data);
  					v.hasExt = v.files.length > 2;
					
  				  	if(i > 0 && v.version == data.version){
  					  temp = data.assets[0];
  					  data.assets[0] = v;
  					  data.assets[i] = temp;
  					  temp = null;
  				  	}
  			  });	
			  
  			  callback(err,data);
  		  });
		}
	}, function(err,json){
		res.render('project',json);
	});	  
};