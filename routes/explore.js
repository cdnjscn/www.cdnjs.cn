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
		page: function (callback) {
			callback(null,{
				title: '探索 - cdnjs.cn',
				description: '探索前端优秀的开源框架'
			});
		},
		pager:function(callback){
			cdnjscn.count(function(err,num){
				curPage = +curPage;
				var pager = {
					curPage: curPage,
					total: num
				};
				// curPage为第一或最后页的时候，不会显示上下页，可以简单的加减
				pager.prevPage = curPage - 1;
				pager.nextPage = curPage + 1;
				pager.maxPage = Math.ceil(num / listNum);
				if(curPage <= 2){
					pager.list = [1,2,3];
					pager.showPrev = false;
					pager.showNext = true;
				} else if(curPage > pager.maxPage - 2){
					pager.list = [pager.maxPage-2, pager.maxPage-1,pager.maxPage];
					pager.showNext = false;
					pager.showPrev = true;
				} else {
					pager.list = [curPage - 1, curPage, curPage + 1];
					pager.showNext = true;
					pager.showPrev = true;
				}
				_.each(pager.list,function(v,i){
					pager.list[i] = v == curPage ? {page: v,active: true} : {page: v,active: false};
				});
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
		res.render('explore', results);
	});
};