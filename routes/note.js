var _ = require('underscore'),
	post= require('../models/note'),
	mongoose = require('mongoose'),
	markdown = require('marked'),
	async = require('async'),
	s = require("underscore.string");
	
// 列表页面
exports.index = function(req, res, next) {
	var curPage = req.query.page || 1,
		listNum = 10;
	
	async.parallel({
		page: function(callback){
			callback(null, {
				title: '前端笔记 - cdnjs.cn',
				description: '浏览器端共享node模块，模块化才是前端的未来！',
				keywords: '趋势,前沿'
			});
		},
		pager: function(callback){
			post.count(function(err,num){
				var pager = {
					curPage: curPage,
					total: num
				};
				pager.maxPage = Math.ceil(num / listNum);
				pager.list = _.range(1,pager.maxPage + 1);
				callback(err,pager);
			});
		},
		noteList: function(callback){
			post.find({})
			.skip((curPage - 1) * listNum)
			.limit(listNum)
			.sort('-_id')
			.exec(function(err,data){
				_.each(data,function(v){
					v.content = s.truncate(s.stripTags(markdown(v.content)), 200);
				});
				callback(err,data);
			});
		}
	},function(err, json){
		res.render('notelist', json);
	});
};

// 详情页
exports.note = function(req, res, next) {
	async.parallel({
		note: function(callback){
			post.findOne({
				'_id': mongoose.Types.ObjectId(req.params.id)
			}).exec(function(err, data){
				if (!data) {
					res.send(500);
					return;
				}
				data.content = markdown(data.content);
				callback(null, data);
			}); 
		}
	},function(err, json){
		json.page = {
				title: json.note.title + ' - cdnjs.cn',
				description: '浏览器端共享node模块，模块化才是前端的未来！',
				keywords: '趋势,前沿'
		};
		res.render('note', json);
	});
};