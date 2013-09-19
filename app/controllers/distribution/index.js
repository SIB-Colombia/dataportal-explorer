var mongoose = require('mongoose');
var Occurrence = mongoose.model('Occurrence');
var occurrencesES = require("../../models/elasticsearch/occurrencesModel");
var _ = require('underscore');

exports.listInitialDistributionOneDegree = function(req, res) {
	occurrences = occurrencesES.getDistributionsOneDegree();
	occurrences.exec(function(err, data){
		res.jsonp(JSON.parse(data));
	});
};

exports.listInitialDistributionCentiDegree = function(req, res) {
	occurrences = occurrencesES.getDistributionsCentiDegree();
	occurrences.exec(function(err, data){
		res.jsonp(JSON.parse(data));
	});
};

exports.listInitialDistributionPointFiveDegree = function(req, res) {
	occurrences = occurrencesES.getDistributionsPointFiveDegree();
	occurrences.exec(function(err, data){
		res.jsonp(JSON.parse(data));
	});
};

exports.listInitialDistributionPointTwoDegree = function(req, res) {
	occurrences = occurrencesES.getDistributionsPointTwoDegree();
	occurrences.exec(function(err, data){
		res.jsonp(JSON.parse(data));
	});
};

exports.getDistributionStatsOneDegree = function(req, res) {
	occurrences = occurrencesES.getStatsOccurrencesOneDegree(req.params._cellid);
	occurrences.exec(function(err, data){
		res.jsonp(JSON.parse(data));
	});
};

exports.getDistributionStatsPointOneDegree = function(req, res) {
	occurrences = occurrencesES.getStatsOccurrencesPointOneDegree(req.params._cellid, req.params._centicellid);
	occurrences.exec(function(err, data){
		res.jsonp(JSON.parse(data));
	});
};

exports.getDistributionStatsPointFiveDegree = function(req, res) {
	occurrences = occurrencesES.getStatsOccurrencesPointFiveDegree(req.params._cellid, req.params._pointfivecellid);
	occurrences.exec(function(err, data){
		res.jsonp(JSON.parse(data));
	});
};

exports.getDistributionStatsPointTwoDegree = function(req, res) {
	occurrences = occurrencesES.getStatsOccurrencesPointTwoDegree(req.params._cellid, req.params._pointtwocellid);
	occurrences.exec(function(err, data){
		res.jsonp(JSON.parse(data));
	});
};

exports.searchDistributionOccurrences = function(req, res) {
	var data = req.body;
	occurrences = occurrencesES.getDistributionWithFilter(data);
	occurrences.exec(function(err, data){
		res.jsonp(JSON.parse(data));
	});
};

/*exports.searchGeoDistributionOccurrences = function(req, res) {
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