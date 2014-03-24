var _ = require('underscore');
exports.reSort = function(list,v){
  var cssPriority = {
	  'twitter-bootstrap': true
  };
  //min.js or min.css 提前
  var temp='',i=0,len=0,re=/(min\.js|min\.css)$/;
  if(cssPriority[v.name]){
  	  re = /min\.css$/gi
  }
  for(i=0,len=list.length;i<len;i++){
	  if(re.test(list[i])){
		  if(temp !== '' && list[i].length > list[0].length) continue;
		  temp = list[0];
		  list[0] = list[i];
		  list[i] = temp;
	  }
  }
  //没有min.css 或 min.js的 filename提前
  var _list = _.find(list,function(v){
	  return re.test(v);
  });
  if(!_list){
	  i = _.indexOf(list,v.filename);
	  temp = list[0];
	  list[0] = v.filename;
	  list[i] = temp;
  }
  _list = null;
  
};