var mongoose = require('mongoose'),
Project = require('../models/project'),
_ = require('underscore'),
mongoConf = require('../mongo.json');

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
			list:['twitter-bootstrap','animate.css','1140','authy-forms.css']
		},
		{
			tag:'lib',
			text: '框架',
			list: ['jquery','underscore.js','lodash.js','zepto','yui']
		}
	],
	tag = req.params.tag || 'pop',
	data = _.find(tags,function(v){
  		return v.tag == tag;
    }),
	list = data.list;
	mongoose.connect('mongodb://' + mongoConf.ip + ':' + mongoConf.port + '/cdnjs',function(err){
	  if (err) return;
	  Project.find({name:{'$in': list  }},function(err,data){
		  mongoose.disconnect();
		  if (!data) {
			  console.log(err);
			  res.send(500);
			  return;
		  }
		  _.map(data,function(v){
			  v.assets = _.first(v.assets);
		  });
		  res.render('index', { title: 'cdnjs.cn',list: data, tags:tags});
	  });
	});
	
	
	
};