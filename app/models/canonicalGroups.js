/**
 * Module dependencies.
 */

var mongoose = require('mongoose')
  , Schema = mongoose.Schema

var CanonicalGroupSchema = new Schema( {
	canonical: {type: String, trim: true},
	occurrences: {type: Number}
}, { collection: 'canonical_groups' })

mongoose.model('CanonicalGroup', CanonicalGroupSchema)