// 项目数据库
var Schema = require('mongoose').Schema;
var project = new Schema({
    "name": String,
    "filename": String,
    "version": String,
    "homepage": String,
    "description": String,
    "keywords": [String],
    "maintainers":[{"name": String,"email":String,"web": String}],
    "bugs": String,
    "licenses": [{"type":String,"url":String}],
    "repositories": [],
    "assets": [{"version": String,"files": [String]}]
},{ collection: 'cdnjs' });
module.exports = db.model('cdnjs', project);

