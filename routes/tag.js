var Project = require('../models/project'),
	Tag = require('../models/tags'),
	reSort = require('../util').reSort,
	_ = require('underscore'),
	async = require('async');

exports.index = function(req, res, next) {
	async.parallel({
		page: function(callback) {
			callback(null, {
				title: req.params.tag + ' - ' + 'cdnjs.cn'
			})
		},
		list: function(callback) {
			Project.find({
				"keywords": req.params.tag
			}).exec(function(err, data) {
				if(err){
					callback({code:500,msg:'数据库错误'});
					return;
				}
				if(data && data.length == 0){
					callback({code:404,msg:'找不到对象'});
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
		if(err){
			next(err);
			return;
	 	}
		json.tag = req.params.tag;
		req.query.view == 'json' ? res.json(json) : res.render('tag', json);
	});
};

exports.all = function(req, res, next) {
	async.parallel({
		page: function(callback) {
			callback(null, {
				title: '前端云图 - ' + 'cdnjs.cn'
			})
		},
		list: function(callback) {
			Tag.find({"value":{"$gt":1}}).sort({"_id":1}).lean().exec(function(err, data) {
				if(err){
					callback({code:500,msg:'数据库错误'});
					return;
				}
				var len = data.length,keys = {};
				for (var i = 0; i < len; i++) {
					if(!keys[data[i].value]){
						keys[data[i].value] = 1;
					}
				}
				keys = _.map(_.keys(keys),function(v){return +v});
				keys = keys.sort(function(a,b){return b-a});
				var tags = {};
				for(i=0,len=keys.length;i<len;i++){
					if(i>15){break}
					tags[keys[i]] = 't' + (15-i)
				}
				_.map(data,function(v,i){
					if(tags[v.value]){
						v.className = tags[v.value];
					}else{
						v.className = 't0'
					}
				});
				callback(null, data);
			});
		}
	}, function(err, json) {
		if(err){
			next(err);
			return;
	 	}
		req.query.view == 'json' ? res.json(json) : res.render('alltag', json);
	});
};
