var Schema = require('mongoose').Schema;
var tags = new Schema({ 
	  "_id": String,
	  'value': Number
},{collection: 'tags'});
module.exports = db.model('tags', tags);
