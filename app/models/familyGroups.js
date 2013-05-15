/**
 * Module dependencies.
 */

var mongoose = require('mongoose')
  , Schema = mongoose.Schema

var FamilyGroupSchema = new Schema( {
	family: {type: String, trim: true},
	occurrences: {type: Number}
}, { collection: 'family_groups' })

mongoose.model('FamilyGroup', FamilyGroupSchema)