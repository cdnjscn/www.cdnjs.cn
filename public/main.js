$(document).on('click','.ext',function(e){
	var target = null;
	e.preventDefault();
	target = $(e.target);
	
	if(target.html() == '展开'){
		target.html('收起');
		target.prev().css({'height':'auto'});
	} else {
		target.prev().css({'height':'38px'});
		target.html('展开');
	}
});