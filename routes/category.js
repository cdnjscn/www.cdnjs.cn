var cdnjscn = require('../models/cdnjscn'),
	Project = require('../models/project'),
	reSort = require('../util').reSort,
	_ = require('underscore'),
	async = require('async'),
	tags = require('../tags');

exports.index = function(req, res){
	var tag = req.params.tag,
		data = null,
		len = tags.length;
	
	for(var i=0; i<len; i++) {
		if(tag == tags[i].tag) {
			data = tags[i];
		}
	}
		
	async.parallel({
		page: function (callback) {
			callback(null,{
				title: data.text + ' - cdnjs.cn',
				description: '探索前端优秀的开源框架'
			});
		},
		list: function (callback) {
			var list = data.list;
			Project.find({
				name: {
					'$in': list
				}
			}).exec(function(err, data) {
				if (!data) {
					console.log(err);
					res.send(500);
					return;
				}
				_.map(data, function(v) {
					var version = v.version,
						files = null;
					v.assets = _.find(v.assets, function(item) {
						return item.version == version;
					});
					files = v.assets[0].files;
					reSort(files, v);
					v.hasExt = files.length > 2;
				});
				callback(err, data);
			});
		},
		
	},function(err,json){
		// console.log(json);
		// res.render('category', json);
		json.tag = tag;
		req.query.view == 'json' ? res.json(json) : res.render('category', json);
	});
	
};