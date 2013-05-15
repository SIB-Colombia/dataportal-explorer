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

// Resume Canonical Name data JSON response
exports.searchResumeScientificName = function(req, res) {
	CanonicalGroup.find().sort('-occurrences').select('canonical occurrences').limit(20).exec(function (err, resume) {
		if(err)
			res.send("Error getting resume scientific name data.")
		res.json(resume)
	})
}

exports.searchResumeScientificNameByName = function(req, res) {
	CanonicalGroup.find({canonical: new RegExp(req.params._name, "i")}).sort('-occurrences').select('canonical occurrences').limit(20).exec(function (err, resume) {
		if(err)
			res.send("Error getting resume scientific name data.")
		res.json(resume)
	})
}

// Resume kingdom data JSON response
exports.searchResumeKingdomName = function(req, res) {
	KingdomGroup.find().sort('-occurrences').select('kingdom occurrences').limit(20).exec(function (err, resume) {
		if(err)
			res.send("Error getting resume kingdom name data.")
		res.json(resume)
	})
}

exports.searchResumeKingdomNameByName = function(req, res) {
	KingdomGroup.find({kingdom: new RegExp(req.params._name, "i")}).sort('-occurrences').select('kingdom occurrences').limit(20).exec(function (err, resume) {
		if(err)
			res.send("Error getting resume kingdom name data.")
		res.json(resume)
	})
}

// Resume phylum data JSON response
exports.searchResumePhylumName = function(req, res) {
	PhylumGroup.find().sort('-occurrences').select('phylum occurrences').limit(20).exec(function (err, resume) {
		if(err)
			res.send("Error getting resume phylum name data.")
		res.json(resume)
	})
}

exports.searchResumePhylumNameByName = function(req, res) {
	PhylumGroup.find({phylum: new RegExp(req.params._name, "i")}).sort('-occurrences').select('phylum occurrences').limit(20).exec(function (err, resume) {
		if(err)
			res.send("Error getting resume phylum name data.")
		res.json(resume)
	})
}

// Resume class data JSON response
exports.searchResumeClassName = function(req, res) {
	ClassGroup.find().sort('-occurrences').select('nameClass occurrences').limit(20).exec(function (err, resume) {
		if(err)
			res.send("Error getting resume class name data.")
		res.json(resume)
	})
}

exports.searchResumeClassNameByName = function(req, res) {
	ClassGroup.find({nameClass: new RegExp(req.params._name, "i")}).sort('-occurrences').select('nameClass occurrences').limit(20).exec(function (err, resume) {
		if(err)
			res.send("Error getting resume class name data.")
		res.json(resume)
	})
}

// Resume order data JSON response
exports.searchResumeOrderName = function(req, res) {
	OrderRankGroup.find().sort('-occurrences').select('order_rank occurrences').limit(20).exec(function (err, resume) {
		if(err)
			res.send("Error getting resume order rank name data.")
		res.json(resume)
	})
}

exports.searchResumeOrderNameByName = function(req, res) {
	OrderRankGroup.find({order_rank: new RegExp(req.params._name, "i")}).sort('-occurrences').select('order_rank occurrences').limit(20).exec(function (err, resume) {
		if(err)
			res.send("Error getting resume order rank name data.")
		res.json(resume)
	})
}

// Resume family data JSON response
exports.searchResumeFamilyName = function(req, res) {
	FamilyGroup.find().sort('-occurrences').select('family occurrences').limit(20).exec(function (err, resume) {
		if(err)
			res.send("Error getting resume family name data.")
		res.json(resume)
	})
}

exports.searchResumeFamilyNameByName = function(req, res) {
	FamilyGroup.find({family: new RegExp(req.params._name, "i")}).sort('-occurrences').select('family occurrences').limit(20).exec(function (err, resume) {
		if(err)
			res.send("Error getting resume family name data.")
		res.json(resume)
	})
}

// Resume genus data JSON response
exports.searchResumeGenusName = function(req, res) {
	GenusGroup.find().sort('-occurrences').select('genus occurrences').limit(20).exec(function (err, resume) {
		if(err)
			res.send("Error getting resume genus name data.")
		res.json(resume)
	})
}

exports.searchResumeGenusNameByName = function(req, res) {
	GenusGroup.find({genus: new RegExp(req.params._name, "i")}).sort('-occurrences').select('genus occurrences').limit(20).exec(function (err, resume) {
		if(err)
			res.send("Error getting resume genus name data.")
		res.json(resume)
	})
}

// Resume genus data JSON response
exports.searchResumeSpeciesName = function(req, res) {
	SpeciesGroup.find().sort('-occurrences').select('species occurrences').limit(20).exec(function (err, resume) {
		if(err)
			res.send("Error getting resume species name data.")
		res.json(resume)
	})
}

exports.searchResumeSpeciesNameByName = function(req, res) {
	SpeciesGroup.find({species: new RegExp(req.params._name, "i")}).sort('-occurrences').select('species occurrences').limit(20).exec(function (err, resume) {
		if(err)
			res.send("Error getting resume species name data.")
		res.json(resume)
	})
}

// Resume data providers data JSON response
exports.searchResumeDataProviders = function(req, res) {
	DataProvidersGroup.find().sort('-occurrences').select('providerID providerName occurrences').exec(function (err, resume) {
		if(err)
			res.send("Error getting resume data providers data.")
		res.json(resume)
	})
}

exports.searchResumeDataProvidersByName = function(req, res) {
	DataProvidersGroup.find({providerName: new RegExp(req.params._name, "i")}).sort('-occurrences').select('providerID providerName occurrences').exec(function (err, resume) {
		if(err)
			res.send("Error getting resume data providers data.")
		res.json(resume)
	})
}

// Resume data resources data JSON response
exports.searchResumeDataResources = function(req, res) {
	DataResourcesGroup.find().sort('-occurrences').select('providerID resourceID resourceName occurrences').exec(function (err, resume) {
		if(err)
			res.send("Error getting resume data resources data.")
		res.json(resume)
	})
}

exports.searchResumeDataResourcesByName = function(req, res) {
	DataResourcesGroup.find({resourceName: new RegExp(req.params._name, "i")}).sort('-occurrences').select('providerID resourceID resourceName occurrences').exec(function (err, resume) {
		if(err)
			res.send("Error getting resume data resources data.")
		res.json(resume)
	})
}

// Resume institution codes data JSON response
exports.searchResumeInstitutionCodes = function(req, res) {
	InstitutionCodeGroup.find().sort('-occurrences').select('institutionCode institutionCodeID occurrences').limit(20).exec(function (err, resume) {
		if(err)
			res.send("Error getting resume institution codes data.")
		res.json(resume)
	})
}

exports.searchResumeInstitutionCodesByName = function(req, res) {
	InstitutionCodeGroup.find({institutionCode: new RegExp(req.params._name, "i")}).sort('-occurrences').select('institutionCode institutionCodeID occurrences').limit(20).exec(function (err, resume) {
		if(err)
			res.send("Error getting resume institution codes data.")
		res.json(resume)
	})
}

// Resume collection codes data JSON response
exports.searchResumeCollectionCodes = function(req, res) {
	CollectionCodeGroup.find().sort('-occurrences').select('collectionCode collectionCodeID occurrences').limit(20).exec(function (err, resume) {
		if(err)
			res.send("Error getting resume collection codes data.")
		res.json(resume)
	})
}

exports.searchResumeCollectionCodesByName = function(req, res) {
	CollectionCodeGroup.find({collectionCode: new RegExp(req.params._name, "i")}).sort('-occurrences').select('collectionCode collectionCodeID occurrences').limit(20).exec(function (err, resume) {
		if(err)
			res.send("Error getting resume collection codes data.")
		res.json(resume)
	})
}

// Resume countries data JSON response
exports.searchResumeCountries = function(req, res) {
	CountriesGroup.find().sort('-occurrences').select('countryName isoCountryCode occurrences').limit(20).exec(function (err, resume) {
		if(err)
			res.send("Error getting resume countries data.")
		res.json(resume)
	})
}

exports.searchResumeCountriesByName = function(req, res) {
	CountriesGroup.find({isoCountryCode: new RegExp(req.params._name, "i")}).sort('-occurrences').select('countryName isoCountryCode occurrences').limit(20).exec(function (err, resume) {
		if(err)
			res.send("Error getting resume countries data.")
		res.json(resume)
	})
}

// Resume departments data JSON response
exports.searchResumeDepartments = function(req, res) {
	DepartmentsGroup.find().sort('-occurrences').select('departmentName isoDepartmentCode occurrences').limit(20).exec(function (err, resume) {
		if(err)
			res.send("Error getting resume departments data.")
		res.json(resume)
	})
}

exports.searchResumeDepartmentsByName = function(req, res) {
	DepartmentsGroup.find({isoDepartmentCode: new RegExp(req.params._name, "i")}).sort('-occurrences').select('departmentName isoDepartmentCode occurrences').limit(20).exec(function (err, resume) {
		if(err)
			res.send("Error getting resume departments data.")
		res.json(resume)
	})
}

// Search help text JSON response
exports.searchSearchHelpTextByName = function(req, res) {
	HelpSearchText.findOne({subjectID: req.params._name}, 'subjectID subjectName text', function (err, resume) {
		if(err)
			res.send("Error getting search text data.")
		res.json(resume)
	})
}

// Search occurrences
exports.searchOccurrences = function(req, res) {
	var data = req.body
	var scientificNames = []
	var taxonNames = []
	var countryIDs = []
	var departmentIDs = []
	var providerNames = []
	var resourceNames = []
	if(data.scientificNames) {
		for(var i = 0; data.scientificNames.length > i; i++) {
			scientificNames[i] = {canonical: new RegExp(data.scientificNames[i].textObject, "i")}
		}
	} else {
		scientificNames[0] = {}
	}
	if(data.taxons) {
		for(var i = 0; data.taxons.length > i; i++) {
			if(data.taxons[i].textName == "Reino")
				taxonNames[i] = {kingdom: data.taxons[i].textObject}
			if(data.taxons[i].textName == "Filo")
				taxonNames[i] = {phylum: data.taxons[i].textObject}
			if(data.taxons[i].textName == "Clase")
				taxonNames[i] = {taxonClass: data.taxons[i].textObject}
			if(data.taxons[i].textName == "Orden")
				taxonNames[i] = {order_rank: data.taxons[i].textObject}
			if(data.taxons[i].textName == "Familia")
				taxonNames[i] = {family: data.taxons[i].textObject}
			if(data.taxons[i].textName == "Genero")
				taxonNames[i] = {genus: data.taxons[i].textObject}
			if(data.taxons[i].textName == "Especie")
				taxonNames[i] = {species: data.taxons[i].textObject}
		}
	} else {
		taxonNames[0] = {}
	}
	if(data.countries) {
		for(var i = 0; data.countries.length > i; i++) {
			countryIDs[i] = {iso_country_code: data.countries[i].textObject}
		}
	} else {
		countryIDs[0] = {}
	}
	if(data.departments) {
		for(var i = 0; data.departments.length > i; i++) {
			departmentIDs[i] = {iso_department_code: data.departments[i].textObject}
		}
	} else {
		departmentIDs[0] = {}
	}
	if(data.providers) {
		for(var i = 0; data.providers.length > i; i++) {
			providerNames[i] = {data_provider_name: data.providers[i].textObject}
		}
	} else {
		providerNames[0] = {}
	}
	if(data.resources) {
		for(var i = 0; data.resources.length > i; i++) {
			resourceNames[i] = {data_resource_name: data.resources[i].textObject}
		}
	} else {
		resourceNames[0] = {}
	}
	GeoOccurrence.find({$and: [{$or: scientificNames}, {$or: taxonNames}, {$or: countryIDs}, {$or: departmentIDs}, {$or: providerNames}, {$or: resourceNames}]}).select('id canonical num_occurrences latitude longitude').exec(function (err, geooccurrences) {
		if(err)
			res.send("Error getting search geo occurrence data.")
		res.jsonp(geooccurrences)
	})
}

exports.searchDetailsOccurrences = function(req, res) {
	Occurrence.find({canonical: req.query.canonical, latitude: req.query.latitude, longitude: req.query.longitude}).select('occurrenceID canonical latitude longitude data_provider_id data_provider_name data_resource_id data_resource_name institution_code_id institution_code collection_code_id collection_code catalogue_number_id catalogue_number created occurrence_date iso_country_code iso_department_code altitude_metres depth_centimetres kingdom phylum occurrenceClass order_rank family genus species').exec(function (err, occurrences) {
		if(err)
			res.send("Error getting search occurrence details data.")
		res.jsonp(occurrences)
	})
}