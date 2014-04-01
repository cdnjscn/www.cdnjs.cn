var cdnjscn = require('../models/cdnjscn'),
	Project = require('../models/project'),
	reSort = require('../util').reSort,
	_ = require('underscore'),
	async = require('async');

exports.index = function(req, res){
	async.parallel({
		pager:function(callback){
			callback(null,{});
		},
		list: function(callback){
			async.waterfall([
			    function(next){
					cdnjscn.find({},{'_id':0}).sort({'g_fork':-1}).limit(20).exec(function(err,sortList){
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
			  		  	});
						// parallel
						callback(null,list);
						list = null;
					});
			    }
			]);	
		}
	},function(err,results){
		res.render('explore',{title:'发现-cdnjs.cn',list:results.list});
	});
};