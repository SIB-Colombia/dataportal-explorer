/**
 * Module dependencies.
 */

var mongoose = require('mongoose')
  , Schema = mongoose.Schema

var DataProvidersGroupSchema = new Schema( {
	providerName: {type: String, trim: true},
	providerID: {type: Number},
	occurrences: {type: Number}
}, { collection: 'data_provider_groups' })

mongoose.model('DataProvidersGroup', DataProvidersGroupSchema)