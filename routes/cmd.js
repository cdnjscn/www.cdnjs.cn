exports.index = function(req, res, next) {
	res.render('cmd', {
		page: {
			title: '生态圈 - cdnjs.cn',
			desc: '浏览器端共享node模块，模块化才是前端的未来！'
		}
	});
};