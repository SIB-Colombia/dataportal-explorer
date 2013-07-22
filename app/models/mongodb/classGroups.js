/**
 * Module dependencies.
 */

var mongoose = require('mongoose')
  , Schema = mongoose.Schema

var ClassGroupSchema = new Schema( {
	nameClass: {type: String, trim: true},
	occurrences: {type: Number}
}, { collection: 'class_groups' })

mongoose.model('ClassGroup', ClassGroupSchema)