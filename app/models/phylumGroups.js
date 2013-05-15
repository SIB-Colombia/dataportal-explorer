/**
 * Module dependencies.
 */

var mongoose = require('mongoose')
  , Schema = mongoose.Schema

var PhylumGroupSchema = new Schema( {
	phylum: {type: String, trim: true},
	occurrences: {type: Number}
}, { collection: 'phylum_groups' })

mongoose.model('PhylumGroup', PhylumGroupSchema)