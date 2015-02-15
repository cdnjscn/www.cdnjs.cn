exports.index = function(req, res, next) {
	res.render('notewrite', {
		page: {
			title: '发表笔记 - cdnjs.cn',
			description: '浏览器端共享node模块，模块化才是前端的未来！',
			keywords: '趋势,前沿'
		}
	});
};