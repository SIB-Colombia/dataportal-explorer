/**
 * Module dependencies.
 */

var mongoose = require('mongoose')
  , Schema = mongoose.Schema

var SpeciesGroupSchema = new Schema( {
	species: {type: String, trim: true},
	occurrences: {type: Number}
}, { collection: 'species_groups' })

mongoose.model('SpeciesGroup', SpeciesGroupSchema)