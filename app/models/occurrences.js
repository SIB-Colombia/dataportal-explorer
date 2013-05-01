/**
 * Module dependencies.
 */

var mongoose = require('mongoose')
  , Schema = mongoose.Schema

var OccurrenceSchema = new Schema( {
	id: {type: Number},
	canonical: {type: String, default: '', trim: true},
	num_occurrences: {type: Number},
	latitude: {type: Number},
	longitude: {type: Number}
})

mongoose.model('Occurrence', OccurrenceSchema)