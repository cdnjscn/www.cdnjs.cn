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
    "repositories": {"type": String,"url": String},
    "assets": [{"version": String,"files": [String]}]
});
module.exports = db.model('cdnjs', project);

