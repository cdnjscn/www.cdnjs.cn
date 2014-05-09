
/**
 * Module dependencies.
 */
var express = require('express');
var http = require('http');
var path = require('path');
var mongoose = require('mongoose');
var mongo = require('./mongo.json');
var uri = 'mongodb://' + mongo.ip + ':' + mongo.port + '/cdnjs';
global.db = mongoose.createConnection(uri);
var routes = require('./routes');
var project = require('./routes/project');
var search = require('./routes/search');
var about = require('./routes/about');
var explore = require('./routes/explore');
var category = require('./routes/category');
var tag = require('./routes/tag');

var app = express();

// all environments
app.set('port', process.env.PORT || 8000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'mustache');
app.set('layout', 'layout');
app.enable('trust proxy');
if('production' == app.settings.env){
  app.enable('view cache');
}
app.engine('mustache', require('hogan-express'));

//app.use(express.favicon());
//app.use(express.logger('dev'));
//app.use(express.json());
//app.use(express.urlencoded());
//app.use(express.methodOverride());
//app.use(app.router);
//app.use(express.static( __dirname +  '/public'));

// development only
if ('development' == app.settings.env) {
  //app.use(express.errorHandler());
}

app.get('/', routes.index);
app.get('/about', about.index);
app.get('/explore', explore.index);
app.get('/search', search.index);
//app.get('/category/:tag', routes.index);

app.get('/tag', tag.all);
//2014年7月里可以删除此部分
app.get('/tag/:tag', function(req,res){
	var index = ['pop','mobile','responsive','template','css','lib'],query = req.params.tag;
	if(index.indexOf(query) >= 0) {
		res.redirect(301, '/?category=' + req.params.tag);
	}else{
		tag.index(req,res);
	}
});
app.get('/category/:tag', function(req,res){
	var index = ['pop','mobile','responsive','template','css','lib'],tag = req.params.tag;
	if(index.indexOf(tag) >= 0) {
		res.redirect(301, '/?category=' + req.params.tag);
	} else {
		category.index(req,res);
	}
});

app.get('/p/:pname', project.index);

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
