/**
 * Module dependencies.
 */

var mongoose = require('mongoose')
  , Schema = mongoose.Schema

var CountriesGroupSchema = new Schema( {
	countryName: {type: String, trim: true},
	isoCountryCode: {type: String, trim: true},
	occurrences: {type: Number}
}, { collection: 'country_groups' })

mongoose.model('CountriesGroup', CountriesGroupSchema)