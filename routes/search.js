var Project = require('../models/project'),
	reSort = require('../util').reSort,
	_ = require('underscore'),
	async = require('async');

exports.index = function(req, res, next) {
	async.parallel({
		page: function(callback) {
			callback(null, {
				title: '搜索' + req.query.q + ' - cdnjs.cn'
			})
		},
		list: function(callback) {
			Project.find({
				name: new RegExp(req.query.q, 'i')
			}).exec(function(err, data) {
				if (err) {
					callback({
						code: 500,
						msg: '数据库错误'
					});
					return;
				}
				_.map(data, function(v) {
					var version = v.version,
						files = null;
					v.assets = _.find(v.assets, function(item) {
						return item.version == version;
					});
					if (v.assets && v.assets[0]) {
						files = v.assets[0].files
						reSort(files, v);
						v.hasExt = files.length > 2;
					}
				});
				callback(null, data);
			});
		}
	}, function(err, json) {
		if (err) {
			next(err);
			return;
		}
		req.query.view == 'json' ? res.json(json) : res.render('search', json);
	});
};
