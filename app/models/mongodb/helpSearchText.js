/**
 * Module dependencies.
 */

var mongoose = require('mongoose')
  , Schema = mongoose.Schema

var HelpSearchTextSchema = new Schema( {
	subjectName: {type: String, trim: true},
	subjectID: {type: Number},
	text: {type: String, trim: true}
}, { collection: 'help_search_text' })

mongoose.model('HelpSearchText', HelpSearchTextSchema)