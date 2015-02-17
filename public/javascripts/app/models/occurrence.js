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
		this.rights = data.rights || null;
		this.citation = data.citation || null;
		this.data_provider_id = ((typeof data.provider !== "undefined") ? data.provider.id : null);
		this.data_provider_name = ((typeof data.provider !== "undefined") ? data.provider.name : null);
		this.data_resource_id = ((typeof data.resource !== "undefined") ? data.resource.id : null);
		this.data_resource_name = ((typeof data.resource !== "undefined") ? data.resource.name : null);
		this.institution_code_id = ((typeof data.institution !== "undefined") ? data.institution.id : null);
		this.institution_code = ((typeof data.institution !== "undefined") ? data.institution.code : null);
		this.collection_code_id = ((typeof data.collection !== "undefined") ? data.collection.id : null);
		this.collection_code = ((typeof data.collection !== "undefined") ? data.collection.code : null);
		this.catalogue_number_id = ((typeof data.catalogue !== "undefined") ? data.catalogue.id : null);
		this.catalogue_number = data.catalogue.number || null;
		this.created = data.created || null;
		this.occurrence_date = data.occurrence_date || null;
		this.iso_country_code = data.iso_country_code || null;
		this.iso_department_code = data.iso_department_code || null;
		this.iso_county_code = data.iso_county_code || null;
		this.country_name = data.country_name || null;
		this.department_name = data.department_name || null;
		this.county_name = data.county_name || null;
		this.altitude_meters = data.altitude_meters || null;
		this.depth_centimeters = data.depth_centimeters || null;
		this.kingdom = ((typeof data.taxonomy !== "undefined") ? data.taxonomy.kingdom_name : null);
		this.kingdom_concept_id = ((typeof data.taxonomy !== "undefined") ? data.taxonomy.kingdom_id : null);
		this.phylum = ((typeof data.taxonomy !== "undefined") ? data.taxonomy.phylum_name : null);
		this.phylum_concept_id = ((typeof data.taxonomy !== "undefined") ? data.taxonomy.phylum_id : null);
		this.taxonClass = ((typeof data.taxonomy !== "undefined") ? data.taxonomy.class_name : null);
		this.class_concept_id = ((typeof data.taxonomy !== "undefined") ? data.taxonomy.class_id : null);
		this.order_rank = ((typeof data.taxonomy !== "undefined") ? data.taxonomy.order_name : null);
		this.order_concept_id = ((typeof data.taxonomy !== "undefined") ? data.taxonomy.order_id : null);
		this.family = ((typeof data.taxonomy !== "undefined") ? data.taxonomy.family_name : null);
		this.family_concept_id = ((typeof data.taxonomy !== "undefined") ? data.taxonomy.family_id : null);
		this.genus = ((typeof data.taxonomy !== "undefined") ? data.taxonomy.genus_name : null);
		this.genus_concept_id = ((typeof data.taxonomy !== "undefined") ? data.taxonomy.genus_id : null);
		this.species = ((typeof data.taxonomy !== "undefined") ? data.taxonomy.species_name : null);
		this.species_concept_id = ((typeof data.taxonomy !== "undefined") ? data.taxonomy.species_id : null);
		this.basis_of_record_name_spanish = data.basis_of_record.name_spanish || null;

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
