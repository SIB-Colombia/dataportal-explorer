/**
 * Module dependencies.
 */

var mongoose = require('mongoose')
  , Schema = mongoose.Schema

var GeoOccurrenceSchema = new Schema( {
	id: {type: Number},
	canonical: {type: String, default: '', trim: true},
	num_occurrences: {type: Number},
	latitude: {type: String},
	longitude: {type: String},
	data_provider_id: {type: Number},
	data_provider_name: {type: String, trim: true},
	data_resource_id: {type: Number},
	data_resource_name: {type: String, trim: true},
	rights: {type: String, trim: true},
	institution_code_id: {type: Number},
	institution_code: {type: String, trim: true},
	collection_code_id: {type: Number},
	collection_code: {type: String, trim: true},
	catalogue_number_id: {type: Number},
	catalogue_number: {type: String, trim: true},
	citation: {type: String, trim: true},
	created: {type: Date},
	modified: {type: Date},
	kingdom_concept_id: {type: Number},
	phylum_concept_id: {type: Number},
	class_concept_id: {type: Number},
	order_concept_id: {type: Number},
	family_concept_id: {type: Number},
	genus_concept_id: {type: Number},
	species_concept_id: {type: Number},
	iso_country_code: {type: String, trim: true},
	iso_department_code: {type: String, trim: true},
	year: {type: Number},
	month: {type: Number},
	occurrence_date: {type: Date},
	altitude_metres: {type: Number},
	depth_centimetres: {type: Number}
}, { collection: 'geooccurrences' })

mongoose.model('GeoOccurrence', GeoOccurrenceSchema)