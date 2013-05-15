/**
 * Module dependencies.
 */

var mongoose = require('mongoose')
  , Schema = mongoose.Schema

var GeneralIndicatorSchema = new Schema( {
	name: {type: String, trim: true},
	value: {type: Number}
}, { collection: 'general_stats' })

mongoose.model('GeneralIndicator', GeneralIndicatorSchema)