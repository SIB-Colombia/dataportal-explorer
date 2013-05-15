/**
 * Module dependencies.
 */

var mongoose = require('mongoose')
  , Schema = mongoose.Schema

var KingdomGroupSchema = new Schema( {
	kingdom: {type: String, trim: true},
	occurrences: {type: Number}
}, { collection: 'kingdom_groups' })

mongoose.model('KingdomGroup', KingdomGroupSchema)