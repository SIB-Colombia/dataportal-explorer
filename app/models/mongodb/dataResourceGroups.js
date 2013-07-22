/**
 * Module dependencies.
 */

var mongoose = require('mongoose')
  , Schema = mongoose.Schema

var DataResourcesGroupSchema = new Schema( {
	resourceName: {type: String, trim: true},
	resourceID: {type: Number},
	occurrences: {type: Number},
	providerID: {type: Number}
}, { collection: 'data_resource_groups' })

mongoose.model('DataResourcesGroup', DataResourcesGroupSchema)