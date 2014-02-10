exports.index = function(req, res){
	var tags = {
		'pop': ['jquery','bootstrap','angular','undersocre','backbone','zepto','seajs'],
		'template': ['mustache','hogan','handlebars'],
		'css': ['bootstrap','animate','1140','960','authy-forms.css','colors'],
		'lib': ['jquery','underscore','lodash','zepto','yui']
	},
	tag = req.params.tag || 'pop';
	
	res.render('index', { title: 'cdnjs.cn',list: tags[tag] });
};