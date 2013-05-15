/**
 * Module dependencies.
 */

var mongoose = require('mongoose')
  , Schema = mongoose.Schema

var GenusGroupSchema = new Schema( {
	genus: {type: String, trim: true},
	occurrences: {type: Number}
}, { collection: 'genus_groups' })

mongoose.model('GenusGroup', GenusGroupSchema)