var Project = require('../models/project'),
	reSort = require('../util').reSort,
	_ = require('underscore'),
	async = require('async');

exports.index = function(req, res) {
	var tags = [{
		tag: 'pop',
		text: '流行',
		list: ['jquery', 'twitter-bootstrap', 'angular.js', 'ember.js', 'underscore.js', 'backbone.js', 'zepto', 'seajs']
	}, {
		tag: 'mobile',
		text: '移动端',
		list: ['zepto', 'jquery-mobile', 'jo', 'swipe', 'iScroll', 'topcoat']
	}, {
		tag: 'responsive',
		text: '响应式',
		list: ['twitter-bootstrap', 'foundation', 'responsive-nav.js', 'skeleton', 'topcoat', 'respond.js']
	}, {
		tag: 'template',
		text: '模版引擎',
		list: ['mustache.js', 'hogan.js', 'handlebars.js']
	}, {
		tag: 'css',
		text: '样式',
		list: ['twitter-bootstrap', 'animate.css', 'less.js', 'authy-forms.css', 'stylus']
	}, {
		tag: 'lib',
		text: '框架',
		list: ['jquery', 'underscore.js', 'lodash.js', 'zepto']
	}];

	async.parallel({
		page: function (callback) {
			callback(null, {
				title: 'cdnjs.cn - 加速、探索和讨论前端那些事儿'
			});
		},
		total: function(callback) {
			Project.count(function(err, num) {
				callback(err, num);
			});
		},
		tags: function(callback) {
			var tag = req.params.tag || 'pop',
				len = tags.length,
				i = 0;
			for (; i < len; i++) {
				if(tags[i].tag == tag ){
					tags[i].selected = true;
					break;
				}
			}
			callback(null, tags);
		},
		list: function(callback) {
			var tag = req.params.tag || 'pop',
				data = _.find(tags, function(v) {
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
