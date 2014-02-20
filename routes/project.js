var mongoose = require('mongoose');

var Project = require('../models/project');

exports.index = function(req, res){
      mongoose.connect('mongodb://localhost/test2',function(err){
		  if (err) return;
		  Project.findOne({name:req.params.pname},function(err,data){
			  //mongoose.connection.close();
			  mongoose.disconnect();
			  
			  if (!data) {
				  console.log(err);
				  res.send(500);
				  return;
			  }
			  data.title = 'project';
			  res.render('project',data);
		  });
      });	  
};