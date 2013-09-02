var mongoose = require('mongoose')
  , CanonicalGroup = mongoose.model('CanonicalGroup')
  , KingdomGroup = mongoose.model('KingdomGroup')
  , PhylumGroup = mongoose.model('PhylumGroup')
  , ClassGroup = mongoose.model('ClassGroup')
  , OrderRankGroup = mongoose.model('OrderRankGroup')
  , FamilyGroup = mongoose.model('FamilyGroup')
  , GenusGroup = mongoose.model('GenusGroup')
  , SpeciesGroup = mongoose.model('SpeciesGroup')
  , DataProvidersGroup = mongoose.model('DataProvidersGroup')
  , DataResourcesGroup = mongoose.model('DataResourcesGroup')
  , DataResourcesGroup = mongoose.model('DataResourcesGroup')
  , InstitutionCodeGroup = mongoose.model('InstitutionCodeGroup')
  , CollectionCodeGroup = mongoose.model('CollectionCodeGroup')
  , CountriesGroup = mongoose.model('CountriesGroup')
  , DepartmentsGroup = mongoose.model('DepartmentsGroup')
  , GeoOccurrence = mongoose.model('GeoOccurrence')
  , Occurrence = mongoose.model('Occurrence')
  , HelpSearchText = mongoose.model('HelpSearchText')

var occurrencesES = require("../../models/elasticsearch/occurrencesModel");

// Resume Canonical Name data JSON response
exports.searchResumeScientificName = function(req, res) {
	occurrences = occurrencesES.getOccurrencesResumeName("*", "scientific");
	occurrences.exec(function(err, data){
		res.jsonp(JSON.parse(data));
	});
};

exports.searchResumeScientificNameByName = function(req, res) {
	occurrences = occurrencesES.getOccurrencesResumeName(req.params._name, "scientific");
	occurrences.exec(function(err, data){
		res.jsonp(JSON.parse(data));
	});
};

// Resume kingdom data JSON response
exports.searchResumeKingdomName = function(req, res) {
	occurrences = occurrencesES.getOccurrencesResumeName("*", "kingdom");
	occurrences.exec(function(err, data){
		res.jsonp(JSON.parse(data));
	});
};

exports.searchResumeKingdomNameByName = function(req, res) {
	occurrences = occurrencesES.getOccurrencesResumeName(req.params._name, "kingdom");
	occurrences.exec(function(err, data){
		res.jsonp(JSON.parse(data));
	});
};

// Resume phylum data JSON response
exports.searchResumePhylumName = function(req, res) {
	occurrences = occurrencesES.getOccurrencesResumeName("*", "phylum");
	occurrences.exec(function(err, data){
		res.jsonp(JSON.parse(data));
	});
};

exports.searchResumePhylumNameByName = function(req, res) {
	occurrences = occurrencesES.getOccurrencesResumeName(req.params._name, "phylum");
	occurrences.exec(function(err, data){
		res.jsonp(JSON.parse(data));
	});
};

// Resume class data JSON response
exports.searchResumeClassName = function(req, res) {
	occurrences = occurrencesES.getOccurrencesResumeName("*", "class");
	occurrences.exec(function(err, data){
		res.jsonp(JSON.parse(data));
	});
};

exports.searchResumeClassNameByName = function(req, res) {
	occurrences = occurrencesES.getOccurrencesResumeName(req.params._name, "class");
	occurrences.exec(function(err, data){
		res.jsonp(JSON.parse(data));
	});
};

// Resume order data JSON response
exports.searchResumeOrderName = function(req, res) {
	occurrences = occurrencesES.getOccurrencesResumeName("*", "order");
	occurrences.exec(function(err, data){
		res.jsonp(JSON.parse(data));
	});
};

exports.searchResumeOrderNameByName = function(req, res) {
	occurrences = occurrencesES.getOccurrencesResumeName(req.params._name, "order");
	occurrences.exec(function(err, data){
		res.jsonp(JSON.parse(data));
	});
};

// Resume family data JSON response
exports.searchResumeFamilyName = function(req, res) {
	occurrences = occurrencesES.getOccurrencesResumeName("*", "family");
	occurrences.exec(function(err, data){
		res.jsonp(JSON.parse(data));
	});
};

exports.searchResumeFamilyNameByName = function(req, res) {
	occurrences = occurrencesES.getOccurrencesResumeName(req.params._name, "family");
	occurrences.exec(function(err, data){
		res.jsonp(JSON.parse(data));
	});
};

// Resume genus data JSON response
exports.searchResumeGenusName = function(req, res) {
	occurrences = occurrencesES.getOccurrencesResumeName("*", "genus");
	occurrences.exec(function(err, data){
		res.jsonp(JSON.parse(data));
	});
};

exports.searchResumeGenusNameByName = function(req, res) {
	occurrences = occurrencesES.getOccurrencesResumeName(req.params._name, "genus");
	occurrences.exec(function(err, data){
		res.jsonp(JSON.parse(data));
	});
};

// Resume genus data JSON response
exports.searchResumeSpeciesName = function(req, res) {
	occurrences = occurrencesES.getOccurrencesResumeName("*", "species");
	occurrences.exec(function(err, data){
		res.jsonp(JSON.parse(data));
	});
};

exports.searchResumeSpeciesNameByName = function(req, res) {
	occurrences = occurrencesES.getOccurrencesResumeName(req.params._name, "species");
	occurrences.exec(function(err, data){
		res.jsonp(JSON.parse(data));
	});
};

// Resume data providers data JSON response
exports.searchResumeDataProviders = function(req, res) {
	occurrences = occurrencesES.getOccurrencesResumeName("*", "providers");
	occurrences.exec(function(err, data){
		res.jsonp(JSON.parse(data));
	});
};

exports.searchResumeDataProvidersByName = function(req, res) {
	occurrences = occurrencesES.getOccurrencesResumeName(req.params._name, "providers");
	occurrences.exec(function(err, data){
		res.jsonp(JSON.parse(data));
	});
};

// Resume data resources data JSON response
exports.searchResumeDataResources = function(req, res) {
	occurrences = occurrencesES.getOccurrencesResumeName("*", "resources");
	occurrences.exec(function(err, data){
		res.jsonp(JSON.parse(data));
	});
};

exports.searchResumeDataResourcesByName = function(req, res) {
	occurrences = occurrencesES.getOccurrencesResumeName(req.params._name, "resources");
	occurrences.exec(function(err, data){
		res.jsonp(JSON.parse(data));
	});
};

// Resume institution codes data JSON response
exports.searchResumeInstitutionCodes = function(req, res) {
	occurrences = occurrencesES.getOccurrencesResumeName("*", "institutionCode");
	occurrences.exec(function(err, data){
		res.jsonp(JSON.parse(data));
	});
};

exports.searchResumeInstitutionCodesByName = function(req, res) {
	occurrences = occurrencesES.getOccurrencesResumeName(req.params._name, "institutionCode");
	occurrences.exec(function(err, data){
		res.jsonp(JSON.parse(data));
	});
};

// Resume collection codes data JSON response
exports.searchResumeCollectionCodes = function(req, res) {
	occurrences = occurrencesES.getOccurrencesResumeName("*", "collectionCode");
	occurrences.exec(function(err, data){
		res.jsonp(JSON.parse(data));
	});
};

exports.searchResumeCollectionCodesByName = function(req, res) {
	occurrences = occurrencesES.getOccurrencesResumeName(req.params._name, "collectionCode");
	occurrences.exec(function(err, data){
		res.jsonp(JSON.parse(data));
	});
};

// Resume countries data JSON response
exports.searchResumeCountries = function(req, res) {
	CountriesGroup.find().sort('-occurrences').select('countryName isoCountryCode occurrences').limit(20).exec(function (err, resume) {
		if(err)
			res.send("Error getting resume countries data.");
		res.json(resume);
	});
};

exports.searchResumeCountriesByName = function(req, res) {
	CountriesGroup.find({isoCountryCode: new RegExp(req.params._name, "i")}).sort('-occurrences').select('countryName isoCountryCode occurrences').limit(20).exec(function (err, resume) {
		if(err)
			res.send("Error getting resume countries data.");
		res.json(resume);
	});
};

// Resume departments data JSON response
exports.searchResumeDepartments = function(req, res) {
	DepartmentsGroup.find().sort('-occurrences').select('departmentName isoDepartmentCode occurrences').limit(20).exec(function (err, resume) {
		if(err)
			res.send("Error getting resume departments data.");
		res.json(resume);
	});
};

exports.searchResumeDepartmentsByName = function(req, res) {
	DepartmentsGroup.find({isoDepartmentCode: new RegExp(req.params._name, "i")}).sort('-occurrences').select('departmentName isoDepartmentCode occurrences').limit(20).exec(function (err, resume) {
		if(err)
			res.send("Error getting resume departments data.");
		res.json(resume);
	});
};

// Search help text JSON response
exports.searchSearchHelpTextByName = function(req, res) {
	HelpSearchText.findOne({subjectID: req.params._name}, 'subjectID subjectName text', function (err, resume) {
		if(err)
			res.send("Error getting search text data.");
		res.json(resume);
	});
};

// Search occurrences
exports.searchGeoOccurrences = function(req, res) {
	var data = req.body;
	var scientificNames = [];
	var taxonNames = [];
	var countryIDs = [];
	var departmentIDs = [];
	var providerNames = [];
	var resourceNames = [];
	if(data.scientificNames) {
		for(var i = 0; data.scientificNames.length > i; i++) {
			scientificNames[i] = {canonical: new RegExp(data.scientificNames[i].textObject, "i")};
		}
	} else {
		scientificNames[0] = {};
	}
	if(data.taxons) {
		for(var i = 0; data.taxons.length > i; i++) {
			if(data.taxons[i].textName == "Reino")
				taxonNames[i] = {kingdom: data.taxons[i].textObject};
			if(data.taxons[i].textName == "Filo")
				taxonNames[i] = {phylum: data.taxons[i].textObject};
			if(data.taxons[i].textName == "Clase")
				taxonNames[i] = {taxonClass: data.taxons[i].textObject};
			if(data.taxons[i].textName == "Orden")
				taxonNames[i] = {order_rank: data.taxons[i].textObject};
			if(data.taxons[i].textName == "Familia")
				taxonNames[i] = {family: data.taxons[i].textObject};
			if(data.taxons[i].textName == "Genero")
				taxonNames[i] = {genus: data.taxons[i].textObject};
			if(data.taxons[i].textName == "Especie")
				taxonNames[i] = {species: data.taxons[i].textObject};
		}
	} else {
		taxonNames[0] = {};
	}
	if(data.countries) {
		for(var i = 0; data.countries.length > i; i++) {
			countryIDs[i] = {iso_country_code: data.countries[i].textObject};
		}
	} else {
		countryIDs[0] = {};
	}
	if(data.departments) {
		for(var i = 0; data.departments.length > i; i++) {
			departmentIDs[i] = {iso_department_code: data.departments[i].textObject};
		}
	} else {
		departmentIDs[0] = {};
	}
	if(data.providers) {
		for(var i = 0; data.providers.length > i; i++) {
			providerNames[i] = {data_provider_name: data.providers[i].textObject};
		}
	} else {
		providerNames[0] = {};
	}
	if(data.resources) {
		for(var i = 0; data.resources.length > i; i++) {
			resourceNames[i] = {data_resource_name: data.resources[i].textObject};
		}
	} else {
		resourceNames[0] = {};
	}
	GeoOccurrence.find({$and: [{$or: scientificNames}, {$or: taxonNames}, {$or: countryIDs}, {$or: departmentIDs}, {$or: providerNames}, {$or: resourceNames}]}).select('id canonical num_occurrences latitude longitude').exec(function (err, geooccurrences) {
		if(err)
			res.send("Error getting search geo occurrence data.");
		res.jsonp(geooccurrences);
	});
};

exports.searchDetailsGeoOccurrences = function(req, res) {
	Occurrence.find({canonical: req.query.canonical, latitude: req.query.latitude, longitude: req.query.longitude}).select('id canonical latitude longitude data_provider_id data_provider_name data_resource_id data_resource_name institution_code_id institution_code collection_code_id collection_code catalogue_number_id catalogue_number created occurrence_date iso_country_code iso_department_code altitude_metres depth_centimetres kingdom phylum taxonClass order_rank family genus species').exec(function (err, occurrences) {
		if(err)
			res.send("Error getting search occurrence details data.");
		res.jsonp(occurrences);
	});
};

exports.searchInitialOccurrences = function(req, res) {
	GeoOccurrence.find().select('id canonical num_occurrences latitude longitude').limit(20000).exec(function (err, geooccurrences) {
		if(err)
			res.send("Error getting initial geo occurrence data.");
		res.jsonp(geooccurrences);
	});
};

exports.searchInitialPagedDataOccurrences = function(req, res) {
	//console.log(req.query);
	//console.log(req.query.filter);
	//console.log(req.query.filter.logic);
	occurrences = occurrencesES.getOccurrencesWithFilter(req.query);
	occurrences.exec(function(err, data){
		res.jsonp(JSON.parse(data));
	});
};