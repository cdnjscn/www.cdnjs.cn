var mongoose = require('mongoose'),
	post = require('../models/note');

//save post	
exports.save = function(req, res){ 
	var title = req.body.t,
		content = req.body.c;
	
	var p = new post({
		'title': title,
		'content': content
	});
	p.save(function(){
		res.send('发表成功');
	});	
};

// 更新
exports.update = function(req, res) {  
	var title = req.body.t,
		content = req.body.c,
		id = req.body.id;
		post.update({'_id': mongoose.Types.ObjectId(id)},
					{
						'$set' : {
							'title': title,
							'content': content
						}
					},
					{},
					function(){
							res.send('更爱你成功');
					}
		);
};

// 删除
exports.delete = function(req, res){
	var id = req.body.id;
		post.remove(
					{'_id': mongoose.Types.ObjectId(id)},
					function(){
							res.send('删除成功');
					}
		);
};