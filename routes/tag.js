var Tag = require('../models/tags'),
	reSort = require('../util').reSort,
	_ = require('underscore'),
	async = require('async');

exports.index = function(req, res){
	async.parallel({
		page: function (callback) {
			callback(null,{
				title: req.params.tag + ' - ' + 'cdnjs.cn'
			})
		},
		tag: function (callback) {
		  // console.log(req.params.tag);
  		  Tag.findOne({'_id':req.params.tag},function(err,data){
  			  callback(err,data);
  		  });
		}
	}, function(err,json){
		req.query.view == 'json' ? res.json(json) : res.render('tag', json);
	});	  
};