var Project = require('../models/project'),
	reSort = require('../util').reSort,
	_ = require('underscore'),
	async = require('async');

exports.index = function(req, res, next) {
	var tags = require('../tags.json'),
		tag = req.query.category || 'pop';

	tags = _.filter(tags, function(v) {
		return ['pop', 'mobile', 'responsive', 'template', 'css', 'lib'].indexOf(v.tag) > -1;
	});

	async.parallel({
		page: function(callback) {
			callback(null, {
				title: 'cdnjs.cn - 加速、探索和讨论前端那些事儿',
				description: 'cdnjs.cn是cdnjs在国内的镜像站点，静态资源托管在又拍云存储，每天同步更新且支持https协议!'
			});
		},
		total: function(callback) {
			Project.count(function(err, num) {
				callback(err, num);
			});
		},
		tags: function(callback) {
			var len = tags.length,
				i = 0;
			for (; i < len; i++) {
				if (tags[i].selected) {
					delete tags[i].selected;
				}
				if (!tags[i].selected && tags[i].tag == tag) {
					tags[i].selected = true;
				}
			}
			callback(null, tags);
		},
		list: function(callback) {
			var data = _.find(tags, function(v) {
				return v.tag == tag;
			}),list = null;
			if (data) {
				list = data.list;
			} else {
				callback({
					code: 404,
					msg: '未找到对象'
				});
				return;
			}

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
				callback(err, data);
			});
		}
	}, function(err, json) {
		if (err) {
			next(err);
			return;
		}
		req.query.view == 'json' ? res.json(json) : res.render('index', json);
	});
};
