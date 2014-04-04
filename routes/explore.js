var cdnjscn = require('../models/cdnjscn'),
	Project = require('../models/project'),
	reSort = require('../util').reSort,
	_ = require('underscore'),
	async = require('async');

exports.index = function(req, res){
	var curPage = req.query.page || 1,
		sortBy = req.query.sort || 'fork',
		listNum = 10;
		
	async.parallel({
		pager:function(callback){
			cdnjscn.count(function(err,num){
				var pager = {
					curPage: curPage,
					total: num
				};
				pager.maxPage = Math.ceil(num / listNum);
				pager.list = _.range(1,pager.maxPage + 1);
				callback(err,pager);
			});
		},
		list: function(callback){
			async.waterfall([
			    function(next){
					var _sort = {
						'fork' : {'g_fork':-1},
						'star' : {'g_star':-1}
					};
					cdnjscn.find({},{'_id':0})
					.skip((curPage - 1) * listNum)
					.sort( _sort[sortBy] || {'g_fork':-1})
					.limit(20)
					.exec(function(err,sortList){
						var names = [],len = sortList.length;
						for (var i = 0; i < len; i++) {
							names.push(sortList[i].name);
						}
						next(null, names,sortList);
					});
			    },
			    function(names, sortList){
					var len = sortList.length,
						list = [];
					Project.find({ name: {'$in' : names } }).exec(function(err,data){
						var item = null;
						for (var i = 0; i < len; i++) {
							item = _.find(data,function(v) {
								return v.name == sortList[i].name;
							});
							item['g_star'] = sortList[i].g_star;
							item['g_fork'] = sortList[i].g_fork;
							list.push(item);
						}
			  		  	_.map(list,function(v){
			  			  var version = v.version;
			  			  v.assets = _.find(v.assets,function(item){
			  				  return item.version == version;
			  			  });
			  			  reSort(v.assets[0].files,v);
						  v.hasExt = v.assets[0].files.length > 2;
			  		  	});
						// parallel
						callback(null,list);
						list = null;
					});
			    }
			]);	
		}
	},function(err,results){
		results.title = '发现 - cdnjs.cn';
		res.render('explore', results);
	});
};