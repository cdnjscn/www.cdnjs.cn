exports.index = function(req, res){
	res.render('about',{
		page: {'title': '关于cdnjs.cn'}
	});
};