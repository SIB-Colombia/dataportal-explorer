var occurrencesES = require("../../models/elasticsearch/occurrencesModel");
var _ = require('underscore');

// Get single occurrence data
exports.searchOccurrence = function(req, res) {
	occurrences = occurrencesES.getOccurrence(req.params._id);
	occurrences.exec(function(err, data){
		res.jsonp(JSON.parse(data));
	});
};

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

// Resume Common Name data JSON response
exports.searchResumeCommonName = function(req, res) {
	occurrences = occurrencesES.getOccurrencesResumeName("*", "common");
	occurrences.exec(function(err, data){
		res.jsonp(JSON.parse(data));
	});
};

exports.searchResumeCommonNameByName = function(req, res) {
	occurrences = occurrencesES.getOccurrencesResumeName(req.params._name, "common");
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
	occurrences = occurrencesES.getOccurrencesResumeName("*", "country");
	occurrences.exec(function(err, data){
		res.jsonp(JSON.parse(data));
	});
};

exports.searchResumeCountriesByName = function(req, res) {
	occurrences = occurrencesES.getOccurrencesResumeName(req.params._name, "country");
	occurrences.exec(function(err, data){
		res.jsonp(JSON.parse(data));
	});
};

// Resume departments data JSON response
exports.searchResumeDepartments = function(req, res) {
	occurrences = occurrencesES.getOccurrencesResumeName("*", "department");
	occurrences.exec(function(err, data){
		res.jsonp(JSON.parse(data));
	});
};

exports.searchResumeDepartmentsByName = function(req, res) {
	occurrences = occurrencesES.getOccurrencesResumeName(req.params._name, "department");
	occurrences.exec(function(err, data){
		res.jsonp(JSON.parse(data));
	});
};

// Resume counties data JSON response
exports.searchResumeCounties = function(req, res) {
	occurrences = occurrencesES.getOccurrencesResumeName("*", "county");
	occurrences.exec(function(err, data){
		res.jsonp(JSON.parse(data));
	});
};

exports.searchResumeCountiesByName = function(req, res) {
	occurrences = occurrencesES.getOccurrencesResumeName(req.params._name, "county");
	occurrences.exec(function(err, data){
		res.jsonp(JSON.parse(data));
	});
};

// Resume paramos data JSON response
exports.searchResumeParamos = function(req, res) {
	occurrences = occurrencesES.getOccurrencesResumeName("*", "paramo");
	occurrences.exec(function(err, data){
		res.jsonp(JSON.parse(data));
	});
};

exports.searchResumeParamosByName = function(req, res) {
	occurrences = occurrencesES.getOccurrencesResumeName(req.params._name, "paramo");
	occurrences.exec(function(err, data){
		res.jsonp(JSON.parse(data));
	});
};

// Resume marine zones data JSON response
exports.searchResumeMarineZones = function(req, res) {
	occurrences = occurrencesES.getOccurrencesResumeName("*", "marineZone");
	occurrences.exec(function(err, data){
		res.jsonp(JSON.parse(data));
	});
};

exports.searchResumeMarineZonesByName = function(req, res) {
	occurrences = occurrencesES.getOccurrencesResumeName(req.params._name, "marineZone");
	occurrences.exec(function(err, data){
		res.jsonp(JSON.parse(data));
	});
};

// Search help text JSON response
exports.searchSearchHelpTextByName = function(req, res) {
	occurrences = occurrencesES.getSearchText(req.params._name);
	occurrences.exec(function(err, data){
		res.jsonp(JSON.parse(data));
	});
};

// Get all the counties for dropdown list
exports.listCounties = function(req, res) {
	occurrences = occurrencesES.getCounties();
	occurrences.exec(function(err, data){
		res.jsonp(JSON.parse(data));
	});
};

// Get all the paramos for dropdown list
exports.listParamos = function(req, res) {
	occurrences = occurrencesES.getParamos();
	occurrences.exec(function(err, data){
		res.jsonp(JSON.parse(data));
	});
};

// Get all the paramos for dropdown list
exports.listMarineZones = function(req, res) {
	occurrences = occurrencesES.getMarineZones();
	occurrences.exec(function(err, data){
		res.jsonp(JSON.parse(data));
	});
};

// Get all occurrences inside a bounding box
exports.getOccurrencesInBoundingBox = function(req, res) {
	occurrences = occurrencesES.getOccurrencesInBoundingBox(req.params._top, req.params._bottom, req.params._left, req.params._right);
	occurrences.exec(function(err, data){
		res.jsonp(JSON.parse(data));
	});
};

exports.geoJsonMapPoints = function(req, res) {
	occurrences = occurrencesES.geoJsonMapPoints(req.query);
	occurrences.exec(function(err, data){
		var result = JSON.parse(data);

		var response = {};
		if(result.hits) {
			response = {
			"hostUrl": req.protocol + "://" + req.get('host') + req.path,
			"query": req.query,
			"count": 1000,
			"start": 0,
			"totalMatched": result.hits.total,
			"type": "FeatureCollection",
			"features": []
		};

		response["start"] = req.query.startindex || 0;
		if(req.query.maxresults) {
			if(req.query.maxresults > 1000) {
				response["count"] = 1000;
			} else {
				response["count"] = req.query.maxresults;
			}
		} else {
			response["count"] = req.query.maxresults || 1000;
		}
		var currentCanonical = "";
		var currentFeature = -1;
		var currentGeometry = 0;
		_.each(result.hits.hits, function(occurrence) {
			if(occurrence._source.canonical != currentCanonical) {
				// New feature
				// New currentCanonical
				currentCanonical = occurrence._source.canonical;
				currentFeature += 1;
				// A new geometry for a new geature
				currentGeometry = 0;
				response["features"][currentFeature] = {};
				response["features"][currentFeature]["taxonName"] = occurrence._source.canonical;
				response["features"][currentFeature]["type"] = "Feature";
				response["features"][currentFeature]["key"] = occurrence._source.id;
				response["features"][currentFeature]["geometry"] = {};
				response["features"][currentFeature]["geometry"]["type"] = "GeometryCollection";
				response["features"][currentFeature]["geometry"]["geometries"] = [];
				response["features"][currentFeature]["geometry"]["geometries"][currentGeometry] = {};
				response["features"][currentFeature]["geometry"]["geometries"][currentGeometry]["occurrenceID"] = occurrence._source.id;
				response["features"][currentFeature]["geometry"]["geometries"][currentGeometry]["type"] = "Point";
				response["features"][currentFeature]["geometry"]["geometries"][currentGeometry]["coordinates"] = [];
				response["features"][currentFeature]["geometry"]["geometries"][currentGeometry]["coordinates"][0] = occurrence._source.location.lon;
				response["features"][currentFeature]["geometry"]["geometries"][currentGeometry]["coordinates"][1] = occurrence._source.location.lat;
				currentGeometry += 1;
			} else {
				// Existing feature
				response["features"][currentFeature]["geometry"]["geometries"][currentGeometry] = {};
				response["features"][currentFeature]["geometry"]["geometries"][currentGeometry]["occurrenceID"] = occurrence._source.id;
				response["features"][currentFeature]["geometry"]["geometries"][currentGeometry]["type"] = "Point";
				response["features"][currentFeature]["geometry"]["geometries"][currentGeometry]["coordinates"] = [];
				response["features"][currentFeature]["geometry"]["geometries"][currentGeometry]["coordinates"][0] = occurrence._source.location.lon;
				response["features"][currentFeature]["geometry"]["geometries"][currentGeometry]["coordinates"][1] = occurrence._source.location.lat;
				currentGeometry += 1;
			}
		});
		} else {
			response = {
				"hostUrl": req.protocol + "://" + req.get('host') + req.path,
				"query": req.query,
				"count": 0,
				"start": 0,
				"error": "Failed to obtain requested data.",
				"cause": "Invalid request parameter.",
				"features": []
			};
		}

		res.jsonp(response);
	});
};

// Search occurrences
/*exports.searchGeoOccurrences = function(req, res) {
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
};*/

/*exports.searchDetailsGeoOccurrences = function(req, res) {
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
};*/

exports.searchInitialPagedDataOccurrences = function(req, res) {
	occurrences = occurrencesES.getOccurrencesWithFilter(req.query);
	occurrences.exec(function(err, data){
		res.jsonp(JSON.parse(data));
	});
};
