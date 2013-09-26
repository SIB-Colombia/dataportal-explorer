define(["knockout"], function(ko) {
	var Occurrence = function(data) {
		this.id = data.id;
		this.canonical = data.canonical;
		this.latitude = data.latitude;
		this.longitude = data.longitude;
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
		this.country_name = data.country_name;
		this.department_name = data.department_name;
		this.altitude_metres = data.altitude_metres;
		this.depth_centimetres = data.depth_centimetres;
		this.kingdom = data.kingdom;
		this.phylum = data.phylum;
		this.taxonClass = data.taxonClass;
		this.order_rank = data.order_rank;
		this.family = data.family;
		this.genus = data.genus;
		this.species = data.species;
		this.basis_of_record_name_spanish = data.basis_of_record_name_spanish;

		this.url = ko.computed(function() {
			return "http://data.sibcolombia.net/occurrences/"+this.id;
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