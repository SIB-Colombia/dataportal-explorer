/**
 * Module dependencies.
 */

var mongoose = require('mongoose')
  , Schema = mongoose.Schema

var InstitutionCodeGroupSchema = new Schema( {
	institutionCode: {type: String, trim: true},
	institutionCodeID: {type: Number},
	occurrences: {type: Number},
}, { collection: 'institution_code_groups' })

mongoose.model('InstitutionCodeGroup', InstitutionCodeGroupSchema)