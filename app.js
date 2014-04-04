
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

var app = express();

// all environments
app.set('port', process.env.PORT || 8000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'mustache');
app.set('layout', 'layout');
//app.set('partials', {footer: "footer",header: "header"});
if('production' == app.get('env')){
  app.enable('view cache');
}
app.engine('mustache', require('hogan-express'));

app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static( __dirname +  '/public'));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/', routes.index);
app.get('/about', about.index);
app.get('/explore', explore.index);
app.get('/search', search.index);
app.get('/category/:tag', routes.index);
//2014年7月里可以删除此部分
app.get('/tag/:tag', function(req,res){
	res.redirect(301, '/category/' + req.params.tag);
});

app.get('/p/:pname', project.index);

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
