/**
 * Module dependencies.
 */

var mongoose = require('mongoose')
  , Schema = mongoose.Schema

var OrderRankGroupSchema = new Schema( {
	order_rank: {type: String, trim: true},
	occurrences: {type: Number}
}, { collection: 'order_rank_groups' })

mongoose.model('OrderRankGroup', OrderRankGroupSchema)