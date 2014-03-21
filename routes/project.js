var Project = require('../models/project');

exports.index = function(req, res){
      
		  Project.findOne({name:req.params.pname},function(err,data){
			  if (!data) {
				  res.send(500);
				  return;
			  }
			  data.title = data.name;
			  res.render('project',data);
		  });
        
};