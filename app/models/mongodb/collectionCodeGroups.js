/**
 * Module dependencies.
 */

var mongoose = require('mongoose')
  , Schema = mongoose.Schema

var CollectionCodeGroupSchema = new Schema( {
	collectionCode: {type: String, trim: true},
	collectionCodeID: {type: Number},
	occurrences: {type: Number},
}, { collection: 'collection_code_groups' })

mongoose.model('CollectionCodeGroup', CollectionCodeGroupSchema)