define(function() {
	var urlDataMap = {
		"filterSubject": {
			"0": {
				"name": "scientificName",
				"resumeApiURL": "/rest/occurrences/resume/scientificname/name/",
				"resumeApi15Condition": "scientificName"
			},
			"31": {
				"name": "commonName",
				"resumeApiURL": "/rest/occurrences/resume/commonname/name/"
			},
			"100": {
				"name": "kingdom",
				"resumeApiURL": "/rest/occurrences/resume/kingdom/name/",
				"resumeApi15Condition": "kingdomName"
			},
			"101": {
				"name": "phylum",
				"resumeApiURL": "/rest/occurrences/resume/phylum/name/",
				"resumeApi15Condition": "phylumName"
			},
			"102": {
				"name": "class",
				"resumeApiURL": "/rest/occurrences/resume/class/name/",
				"resumeApi15Condition": "className"
			},
			"103": {
				"name": "order",
				"resumeApiURL": "/rest/occurrences/resume/order/name/",
				"resumeApi15Condition": "orderName"
			},
			"104": {
				"name": "family",
				"resumeApiURL": "/rest/occurrences/resume/family/name/",
				"resumeApi15Condition": "familyName"
			},
			"105": {
				"name": "genus",
				"resumeApiURL": "/rest/occurrences/resume/genus/name/",
				"resumeApi15Condition": "genusName"
			},
			"106": {
				"name": "species",
				"resumeApiURL": "/rest/occurrences/resume/species/name/",
				"resumeApi15Condition": "speciesName"
			},
			"31": {
				"name": "commonNames",
				"resumeApiURL": "/rest/occurrences/resume/commonname/name/"
			},
			"25": {
				"name": "dataProviders",
				"resumeApiURL": "/rest/occurrences/resume/dataproviders/name/",
				"resumeApi15Condition": "providerName"
			},
			"24": {
				"name": "dataResources",
				"resumeApiURL": "/rest/occurrences/resume/dataresources/name/",
				"resumeApi15Condition": "resourceName"
			},
			"12": {
				"name": "institutionCodes",
				"resumeApiURL": "/rest/occurrences/resume/institutioncodes/name/",
				"resumeApi15Condition": "institutionCode"
			},
			"13": {
				"name": "collectionCodes",
				"resumeApiURL": "/rest/occurrences/resume/collectioncodes/name/",
				"resumeApi15Condition": "collectionName"
			},
			"5": {
				"name": "countries",
				"resumeApiURL": "/rest/occurrences/resume/countries/name/",
				"resumeApi15Condition": "countryName"
			},
			"38": {
				"name": "departments",
				"resumeApiURL": "/rest/occurrences/resume/departments/name/",
				"resumeApi15Condition": "departmentName"
			},
			"39": {
				"name": "counties",
				"resumeApiURL": "/rest/occurrences/resume/counties/name/",
				"resumeApi15Condition": "countyName"
			},
			"40": {
				"name": "paramos",
				"resumeApiURL": "/rest/occurrences/resume/paramos/name/"
			},
			"41": {
				"name": "marinezones",
				"resumeApiURL": "/rest/occurrences/resume/marinezones/name/"
			}
		}
	};
	return urlDataMap;
});
