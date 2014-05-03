var Project = require('../models/project'),
	reSort = require('../util').reSort,
	_ = require('underscore'),
	async = require('async');

exports.index = function(req, res) {
	var tags = require('../tags.json'),
		tag = req.query.category || 'pop';
		
	async.parallel({
		page: function (callback) {
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
				if(tags[i].selected){
					delete tags[i].selected;
				}
				if(!tags[i].selected && tags[i].tag == tag ){
					tags[i].selected = true;
				}
			}
			callback(null, tags);
		},
		list: function(callback) {
			var data = _.find(tags, function(v) {
					return v.tag == tag;
				}),
				list = data.list;
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
		}
	}, function(err, data) {
		res.render('index', data);
	});
};
