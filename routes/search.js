var Project = require('../models/project'),
	reSort = require('../util').reSort,
	_ = require('underscore'),
	async = require('async');

exports.index = function(req, res) {
	async.parallel({
		page: function (callback) {
			callback(null,{
				title:'搜索'+req.query.q + ' - cdnjs.cn'
			})
		},
		list: function (callback) {
			// if(req.query.q == 'moment') {
// 				callback(null,[]);
// 				return;
// 			}
	  	  Project.find({name: new RegExp(req.query.q,'i')}).exec(function(err,data){  
	  		  _.map(data,function(v){
	  			  var version = v.version,files = null;
	  			  v.assets = _.find(v.assets,function(item){
	  				  return item.version == version;
	  			  });
	  			  files = v.assets[0].files
	  			  reSort(files,v);
	  			  v.hasExt = files.length > 2;
	  		  });
		  	  callback(err,data);
	  	  });
		}
	},function(err,json){
		if(err){
			res.send(err);
			return;
		}
		res.render('search',json);
	});
};