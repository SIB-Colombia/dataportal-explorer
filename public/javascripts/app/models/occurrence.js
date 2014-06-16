define(["knockout"], function(ko) {
	var Occurrence = function(data) {
		this.id = data.id;
		this.canonical = data.canonical;
		if(data.location) {
			this.latitude = data.location.lat;
			this.longitude = data.location.lon;
		} else {
			if(data.latitude == 1000 && data.longitude == 1000) {
				this.latitude = "";
				this.longitude = "";
			} else {
				this.latitude = data.latitude;
				this.longitude = data.longitude;
			}
		}
		this.rights = data.rights;
		this.citation = data.citation;
		this.data_provider_id = data.data_provider_id;
		this.data_provider_name = data.data_provider_name;
		this.data_resource_id = data.data_resource_id;
		this.data_resource_name = data.data_resource_name;
		this.institution_code_id = data.institution_code_id;
		this.institution_code = data.institution_code;
		this.collection_code_id = data.collection_code_id;
		this.collection_code = data.collection_code;
		this.catalogue_number_id = data.catalogue_number_id;
		this.catalogue_number = data.catalogue_number;
		this.created = data.created;
		this.occurrence_date = data.occurrence_date;
		this.iso_country_code = data.iso_country_code;
		this.iso_department_code = data.iso_department_code;
		this.iso_county_code = data.iso_county_code;
		this.country_name = data.country_name;
		this.department_name = data.department_name;
		this.county_name = data.county_name;
		this.altitude_meters = data.altitude_metres;
		this.depth_centimeters = data.depth_centimetres;
		this.kingdom = data.kingdom;
		this.kingdom_concept_id = data.kingdom_concept_id;
		this.phylum = data.phylum;
		this.phylum_concept_id = data.phylum_concept_id;
		this.taxonClass = data.taxonClass;
		this.class_concept_id = data.class_concept_id;
		this.order_rank = data.order_rank;
		this.order_concept_id = data.order_concept_id;
		this.family = data.family;
		this.family_concept_id = data.family_concept_id;
		this.genus = data.genus;
		this.genus_concept_id = data.genus_concept_id;
		this.species = data.species;
		this.species_concept_id = data.species_concept_id;
		this.basis_of_record_name_spanish = data.basis_of_record_name_spanish;

		this.url = ko.computed(function() {
			return "http://data.sibcolombia.net/occurrences/"+this.id;
		}, this);

		this.urlDataProvider = ko.computed(function() {
			return "http://data.sibcolombia.net/datasets/provider/"+this.data_provider_id;
		}, this);

		this.urlResourceName = ko.computed(function() {
			return "http://data.sibcolombia.net/datasets/resource/"+this.data_resource_id;
		}, this);

		this.urlCountry = ko.computed(function() {
			return "http://data.sibcolombia.net/countries/"+this.iso_country_code;
		}, this);

		this.urlDepartment = ko.computed(function() {
			return "http://data.sibcolombia.net/departments/"+this.iso_department_code;
		}, this);

		this.urlKingdom = ko.computed(function() {
			return "http://data.sibcolombia.net/species/"+this.kingdom_concept_id;
		}, this);

		this.urlPhylum = ko.computed(function() {
			return "http://data.sibcolombia.net/species/"+this.phylum_concept_id;
		}, this);

		this.urlClass = ko.computed(function() {
			return "http://data.sibcolombia.net/species/"+this.class_concept_id;
		}, this);

		this.urlOrder = ko.computed(function() {
			return "http://data.sibcolombia.net/species/"+this.order_concept_id;
		}, this);

		this.urlFamily = ko.computed(function() {
			return "http://data.sibcolombia.net/species/"+this.family_concept_id;
		}, this);

		this.urlGenus = ko.computed(function() {
			return "http://data.sibcolombia.net/species/"+this.genus_concept_id;
		}, this);

		this.urlSpecie = ko.computed(function() {
			return "http://data.sibcolombia.net/species/"+this.species_concept_id;
		}, this);

		this.fullSpecieName = ko.computed(function() {
			if(this.species)
				return this.genus+" "+this.species;
			return "";
		}, this);

		this.location = ko.computed(function() {
			if(this.latitude)
				return "Lat: "+this.latitude+", Lon: "+this.longitude;
			return "";
		}, this);

		this.canonicalWithURL = ko.computed(function() {
			if(this.canonical)
				return "<a href=\"http://data.sibcolombia.net/occurrences/"+this.id+"\">"+this.canonical+"</a>";
			return "";
		}, this);
	};

	return Occurrence;
});