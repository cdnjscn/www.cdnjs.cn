// 项目数据库
var Schema = require('mongoose').Schema,
	postSchema = new Schema({
		"title": String,
		"content": String
	},
	{
		collection: 'note'
	});
module.exports = notesDB.model('note', postSchema);

