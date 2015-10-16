
/**
 * Module dependencies.
 */
var express = require('express');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var http = require('http');
var path = require('path');
var mongoose = require('mongoose');

var mongo = require('./mongo.json');
global.db = mongoose.createConnection(mongo.URI.replace(/\{db\}/gi,'cdnjs'), {read_secondary: true});
global.notesDB = mongoose.createConnection(mongo.URI.replace(/\{db\}/gi,'notes'), {read_secondary: true});

var routes = require('./routes');
var project = require('./routes/project');
var search = require('./routes/search');
var about = require('./routes/about');
var explore = require('./routes/explore');
var category = require('./routes/category');
var tag = require('./routes/tag');
var cmd = require('./routes/cmd');

// 前端笔记
var note = require('./routes/note');
var noteWrite = require('./routes/notewrite');
var noteapi = require('./routes/noteapi');

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
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser('~h1AiECeb(-)z!D-'));

// development only
if ('development' == app.settings.env) {
  // app.use(express.errorHandler());
}

app.get('/', routes.index);
app.get('/about', about.index);
app.get('/explore', explore.index);
app.get('/search', search.index);
//app.get('/category/:tag', routes.index);

app.get('/tag', tag.all);
//2014年7月里可以删除此部分
app.get('/tag/:tag', function(req,res,next){
	var index = ['pop','mobile','responsive','template','css','lib'],query = req.params.tag;
	if(index.indexOf(query) >= 0) {
		res.redirect(301, '/?category=' + req.params.tag);
	}else{
		tag.index(req,res,next);
	}
});
app.get('/category/:tag', function(req,res,next){
	var index = ['pop','mobile','responsive','template','css','lib'],tag = req.params.tag;
	if(index.indexOf(tag) >= 0) {
		res.redirect(301, '/?category=' + req.params.tag);
	} else {
		category.index(req,res,next);
	}
});

app.get('/p/:pname', project.index);
app.get('/cmd', cmd.index);

app.get('/n/:id', note.note);
app.get('/n', function(req,res,next){
	res.redirect(301, '/note');
});
app.get('/note', note.index);
// 发表笔记
app.get('/note/write', noteWrite.index);

app.post('/noteapi/save', noteapi.save);




app.use(function(err,req, res, next){
	// res.status(500);
	if(err.code == 404){
		res.status(404);
	} else {
		res.status(500);
	}
	res.render('error', {error: err.msg});
});

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
