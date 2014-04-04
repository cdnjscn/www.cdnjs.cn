var Project = require('../models/project'),
	reSort = require('../util').reSort,
	_ = require('underscore');

exports.index = function(req, res){
	var tags = [
		{
			tag:'pop',
			text: '流行',
			list: ['jquery','twitter-bootstrap','angular.js','underscore.js','backbone.js','zepto','seajs']
		},
		{
			tag:'template',
			text: '模版引擎',
			list: ['mustache.js','hogan.js','handlebars.js']
		},
		{
			tag:'css',
			text:'样式',
			list:['twitter-bootstrap','animate.css','less.js','authy-forms.css','stylus']
		},
		{
			tag:'lib',
			text: '框架',
			list: ['jquery','underscore.js','lodash.js','zepto']
		}
	],
	tag = req.params.tag || 'pop',
	data = _.find(tags,function(v){
  		return v.tag == tag;
    }),
	list = data.list;
	Project.find({name:{'$in': list  }},function(err,data){
		  if (!data) {
			  console.log(err);
			  res.send(500);
			  return;
		  }
		  _.map(data,function(v){
			  var version = v.version,files = v.assets[0].files;
			  v.assets = _.find(v.assets,function(item){
				  return item.version == version;
			  });
			  reSort(files,v);
			  v.hasExt = files.length > 2;
		  });
		  
		  res.render('index', { title: 'cdnjs.cn',list: data, tags:tags});
	});
};