var cdnjscn = require('../models/cdnjscn'),
	Project = require('../models/project'),
	reSort = require('../util').reSort,
	_ = require('underscore'),
	sites = require('../sites'),
	async = require('async');

exports.index = function(req, res) {
	var valueCheck = {
		'star': true,
		'fork': true
	},
		curPage = req.query.page || 1,
		sortBy = req.query.sort || 'fork',
		listNum = 10;

	curPage = +curPage;

	if (!valueCheck[sortBy]) {
		sortBy = 'star';
	}

	async.parallel({
		site: function(callback) {
			callback(null, sites[req.cookies._c || 'u']);
		},
		sortState: function(callback) {
			var state = {};
			state[sortBy + '_selected'] = true;
			callback(null, state);
		},
		page: function(callback) {
			callback(null, {
				title: '探索 - cdnjs.cn',
				description: '探索前端优秀的开源框架'
			});
		},
		pager: function(callback) {
			cdnjscn.count(function(err, num) {
				var pager = {
					curPage: curPage,
					total: num
				};
				// curPage为第一或最后页的时候，不会显示上下页，可以简单的加减
				pager.prevPage = curPage - 1;
				pager.nextPage = curPage + 1;
				pager.maxPage = Math.ceil(num / listNum);
				if (curPage <= 2) {
					pager.list = [1, 2, 3];
					pager.showPrev = false;
					pager.showNext = true;
				} else if (curPage > pager.maxPage - 2) {
					pager.list = [pager.maxPage - 2, pager.maxPage - 1, pager.maxPage];
					pager.showNext = false;
					pager.showPrev = true;
				} else {
					pager.list = [curPage - 1, curPage, curPage + 1];
					pager.showNext = true;
					pager.showPrev = true;
				}
				_.each(pager.list, function(v, i) {
					pager.list[i] = v == curPage ? {
						page: v,
						active: true
					} : {
						page: v,
						active: false
					};
				});
				callback(err, pager);
			});
		},
		tags: function(callback) {
			callback(null, [{
				_id: 'css',
				value: 26,
				className: 't10'
			}, {
				_id: 'popular',
				value: 54,
				className: 't14'
			}, {
				_id: 'angular',
				value: 17,
				className: 't2'
			}, {
				_id: 'jquery',
				value: 110,
				className: 't15'
			}, {
				_id: 'mobile',
				value: 25,
				className: 't8'
			}, {
				_id: 'framework',
				value: 40,
				className: 't13'
			}, {
				_id: 'form',
				value: 20,
				className: 't5'
			}, {
				_id: 'ajax',
				value: 17,
				className: 't3'
			}, {
				_id: 'animation',
				value: 17,
				className: 't1'
			}, {
				_id: 'html5',
				value: 27,
				className: 't11'
			}, {
				_id: 'bootstrap',
				value: 25,
				className: 't9'
			}, {
				_id: 'canvas',
				value: 21,
				className: 't6'
			}, {
				_id: 'browser',
				value: 19,
				className: 't4'
			}, {
				_id: 'javascript',
				value: 23,
				className: 't7'
			}, {
				_id: 'responsive',
				value: 17,
				className: 't0'
			}, {
				_id: 'ui',
				value: 34,
				className: 't12'
			}]);
		},
		list: function(callback) {
			async.waterfall([
				function(next) {
					var _sort = {
						'fork': {
							'g_fork': -1
						},
						'star': {
							'g_star': -1
						}
					};
					cdnjscn.find({}, {
						'_id': 0
					})
						.skip((curPage - 1) * listNum)
						.sort(_sort[sortBy] || {
							'g_fork': -1
						})
						.limit(listNum)
						.exec(function(err, sortList) {
							var names = [],
								len = sortList.length;
							for (var i = 0; i < len; i++) {
								names.push(sortList[i].name);
							}
							next(null, names, sortList);
						});
				},
				function(names, sortList) {
					var len = sortList.length,
						list = [];
					Project.find({
						name: {
							'$in': names
						}
					}).exec(function(err, data) {
						var item = null;
						for (var i = 0; i < len; i++) {
							item = _.find(data, function(v) {
								return v.name == sortList[i].name;
							});
							item['g_star'] = sortList[i].g_star;
							item['g_fork'] = sortList[i].g_fork;
							list.push(item);
						}
						_.map(list, function(v) {
							var version = v.version;
							v.assets = _.find(v.assets, function(item) {
								return item.version == version;
							});
							reSort(v.assets[0].files, v);
							v.hasExt = v.assets[0].files.length > 2;
						});
						// parallel
						callback(null, list);
						list = null;
					});
				}
			]);
		}
	}, function(err, json) {
		req.query.view == 'json' ? res.json(json) : res.render('explore', json);
	});
};
