exports.index = function(req, res, next) {
	res.render('cmd', {
		page: {
			title: '前端生态圈 - cdnjs.cn',
			description: '浏览器端共享node模块，模块化才是前端的未来！',
			keywords: 'CommonJS,CMD,模块化'
		}
	});
};