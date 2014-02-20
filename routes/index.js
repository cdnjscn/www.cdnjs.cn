var mongoose = require('mongoose'),
Project = require('../models/project'),
_ = require('underscore');

exports.index = function(req, res){
	var tags = {
		'pop': ['jquery','twitter-bootstrap','angular.js','underscore.js','backbone.js','zepto','seajs'],
		'template': ['mustache.js','hogan.js','handlebars.js'],
		'css': ['twitter-bootstrap','animate.css','1140','authy-forms.css'],
		'lib': ['jquery','underscore.js','lodash.js','zepto','yui']
	},
	tag = req.params.tag || 'pop';
	
	mongoose.connect('mongodb://localhost/test2',function(err){
	  if (err) return;
	  Project.find({name:{'$in': tags[tag]  }},function(err,data){
		  mongoose.disconnect();
		  if (!data) {
			  console.log(err);
			  res.send(500);
			  return;
		  }
		  _.map(data,function(v){
			  v.assets = _.first(v.assets);
		  });
		  
		  res.render('index', { title: 'cdnjs.cn',list: data });
	  });
	});
	
	
	
};