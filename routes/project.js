var mongoose = require('mongoose'),
Project = require('../models/project'),
mongoConf = require('../mongo.json');

exports.index = function(req, res){
      mongoose.connect('mongodb://' + mongoConf.ip + ':' + mongoConf.port + '/cdnjs',function(err){
		  if (err) return;
		  Project.findOne({name:req.params.pname},function(err,data){
			  mongoose.disconnect();
			  
			  if (!data) {
				  res.send(500);
				  return;
			  }
			  data.title = data.name;
			  res.render('project',data);
		  });
      });	  
};