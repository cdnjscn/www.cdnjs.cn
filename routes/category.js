var cdnjscn = require('../models/cdnjscn'),
	Project = require('../models/project'),
	reSort = require('../util').reSort,
	_ = require('underscore'),
	async = require('async'),
	tags = require('../tags');

exports.index = function(req, res, next) {
	var tag = req.params.tag,
		data = null,
		len = tags.length;

	for (var i = 0; i < len; i++) {
		if (tag == tags[i].tag) {
			data = tags[i];
		}
	}
	
	if(!data) {
		next({
			code: 404,
			msg: '未找到对象'
		});
		return;
	}
	
	async.parallel({
		page: function(callback) {
			callback(null, {
				title: data.text + ' - cdnjs.cn',
				description: '探索前端优秀的开源框架'
			});
		},
		list: function(callback) {
			var list = data.list;
			Project.find({
				name: {
					'$in': list
				}
			}).exec(function(err, data) {
				if(err){
					callback({
						code: 500,
						msg: '数据库错误'
					});
					return;
				}
				if (!data) {
					callback({
						code: 404,
						msg: '未找到对象'
					});
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
				callback(null, data);
			});
		},

	}, function(err, json) {
		if(err){
			next(err);
			return;
		}
		json.tag = tag;
		req.query.view == 'json' ? res.json(json) : res.render('category', json);
	});

};
