var moment = require('moment');
var _ = require('underscore');

exports.getOccurrencesResumeName = function(name, type) {
	qryObj = {
		"fields": [],
		"facets": {
			"canonical": {
				"terms": {
					"field": "canonical.untouched",
					"size" : 10
				}
			},
			"kingdom": {
				"terms": {
					"field": "kingdom_group.untouched",
					"size" : 10
				}
			},
			"phylum": {
				"terms": {
					"field": "phylum_group.untouched",
					"size" : 10
				}
			},
			"taxonClass": {
				"terms": {
					"field": "taxonClass_group.untouched",
					"size" : 10
				}
			},
			"order_rank": {
				"terms": {
					"field": "order_rank_group.untouched",
					"size" : 10
				}
			},
			"family": {
				"terms": {
					"field": "family_group.untouched",
					"size" : 10
				}
			},
			"genus": {
				"terms": {
					"field": "genus_group.untouched",
					"size" : 10
				}
			},
			"species": {
				"terms": {
					"field": "species_group.untouched",
					"size" : 10
				}
			},
			"department_name": {
				"terms": {
					"field": "department_name.untouched",
					"size" : 10
				}
			},
			"iso_department_code": {
				"terms": {
					"field": "iso_department_code.untouched",
					"size" : 10
				}
			},
			"country_name": {
				"terms": {
					"field": "country_name.untouched",
					"size" : 10
				}
			},
			"iso_country_code": {
				"terms": {
					"field": "iso_country_code.untouched",
					"size" : 10
				}
			},
			"data_provider_name": {
				"terms": {
					"field": "data_provider_name.untouched",
					"size" : 10
				}
			},
			"data_provider_id": {
				"terms": {
					"field": "data_provider_id",
					"size" : 10
				}
			},
			"data_resource_name": {
				"terms": {
					"field": "data_resource_name.untouched",
					"size" : 10
				}
			},
			"data_resource_id": {
				"terms": {
					"field": "data_resource_id",
					"size" : 10
				}
			},
			"institution_code": {
				"terms": {
					"field": "institution_code.untouched",
					"size" : 10
				}
			},
			"institution_code_id": {
				"terms": {
					"field": "institution_code_id",
					"size" : 10
				}
			},
			"collection_code": {
				"terms": {
					"field": "collection_code.untouched",
					"size" : 10
				}
			},
			"collection_code_id": {
				"terms": {
					"field": "collection_code_id",
					"size" : 10
				}
			}
		}
	};

	qryObj["query"] = {};
	qryObj["query"]["filtered"] = {};
	qryObj["query"]["filtered"]["query"] = {};
	qryObj["query"]["filtered"]["query"]["wildcard"] = {};
	if(type == "scientific") {
		qryObj["query"]["filtered"]["query"]["wildcard"]["canonical.exactWords"] = "*"+ name.toLowerCase() +"*";
	} else if(type == "kingdom") {
		qryObj["query"]["filtered"]["query"]["wildcard"]["kingdom.exactWords"] = "*"+ name.toLowerCase() +"*";
	} else if(type == "phylum") {
		qryObj["query"]["filtered"]["query"]["wildcard"]["phylum.exactWords"] = "*"+ name.toLowerCase() +"*";
	} else if(type == "class") {
		qryObj["query"]["filtered"]["query"]["wildcard"]["taxonClass.exactWords"] = "*"+ name.toLowerCase() +"*";
	} else if(type == "order") {
		qryObj["query"]["filtered"]["query"]["wildcard"]["order_rank.exactWords"] = "*"+ name.toLowerCase() +"*";
	} else if(type == "family") {
		qryObj["query"]["filtered"]["query"]["wildcard"]["family.exactWords"] = "*"+ name.toLowerCase() +"*";
	} else if(type == "genus") {
		qryObj["query"]["filtered"]["query"]["wildcard"]["genus.exactWords"] = "*"+ name.toLowerCase() +"*";
	} else if(type == "species") {
		qryObj["query"]["filtered"]["query"]["wildcard"]["species.exactWords"] = "*"+ name.toLowerCase() +"*";
	} else if(type == "providers") {
		qryObj["query"]["filtered"]["query"]["wildcard"]["data_provider_name.exactWords"] = "*"+ name.toLowerCase() +"*";
	} else if(type == "resources") {
		qryObj["query"]["filtered"]["query"]["wildcard"]["data_resource_name.exactWords"] = "*"+ name.toLowerCase() +"*";
	} else if(type == "institutionCode") {
		qryObj["query"]["filtered"]["query"]["wildcard"]["institution_code.exactWords"] = "*"+ name.toLowerCase() +"*";
	} else if(type == "collectionCode") {
		qryObj["query"]["filtered"]["query"]["wildcard"]["collection_code.exactWords"] = "*"+ name.toLowerCase() +"*";
	} else if(type == "country") {
		qryObj["query"]["filtered"]["query"]["wildcard"]["iso_country_code.exactWords"] = "*"+ name.toLowerCase() +"*";
	} else if(type == "department") {
		qryObj["query"]["filtered"]["query"]["wildcard"]["iso_department_code.exactWords"] = "*"+ name.toLowerCase() +"*";
	}

	mySearchCall = elasticSearchClient.search('sibexplorer', 'occurrences', qryObj);
	return mySearchCall;
};

exports.getSearchText = function(subjectID) {
	qryObj = {
		"fields": ["text"],
		"query" : {
			"filtered": {
				"filter": {
					"term": {subjectID: subjectID}
				}
			}
		}
	};

	mySearchCall = elasticSearchClient.search('sibexplorer', 'help_search_text', qryObj);
	return mySearchCall;
};

exports.getOccurrences = function() {
	qryObj = {
		"fields": ["id", "canonical", "data_resource_name", "institution_code", "collection_code", "catalogue_number", "occurrence_date", "modified", "location", "country_name", "department_name", "basis_of_record_name_spanish"],
		"from": 0,
		"size" : 20,
		"sort": [ { "canonical.untouched": "asc" } ],
		"query" : {
			"match_all" : {}
		}
	};

	mySearchCall = elasticSearchClient.search('sibexplorer', 'occurrences', qryObj);
	return mySearchCall;
};

exports.getDistributionsOneDegree = function() {
	qryObj = {
		"fields": ["cell_id", "location_cell", "count"],
		"size": 10000000,
		"query": {
			"filtered" : {
				"query" : {
					"match_all" : {}
				},
				"filter": {
					"term": {"type": "0"}
				}
            }
        },
        "facets": {
			"stats": {
				"statistical": {
					"field": "count"
				}
			}
		}
	};

	mySearchCall = elasticSearchClient.search('sibexplorer', 'cell_density', qryObj);
	return mySearchCall;
};

exports.getDistributionsCentiDegree = function() {
	qryObj = {
		"fields": ["cell_id", "centi_cell_id", "location_centi_cell", "count"],
		"size": 10000000,
		"query": {
			"filtered" : {
				"query" : {
					"match_all" : {}
				},
				"filter": {
					"term": {"type": "0"}
				}
            }
        },
        "facets": {
			"stats": {
				"statistical": {
					"field": "count"
				}
			}
		}
	};

	mySearchCall = elasticSearchClient.search('sibexplorer', 'centi_cell_density', qryObj);
	return mySearchCall;
};

exports.getDistributionsPointFiveDegree = function() {
	qryObj = {
		"fields": ["cell_id", "pointfive_cell_id", "location_pointfive_cell", "count"],
		"size": 10000000,
		"query": {
			"filtered" : {
				"query" : {
					"match_all" : {}
				},
				"filter": {
					"term": {"type": "0"}
				}
            }
        },
        "facets": {
			"stats": {
				"statistical": {
					"field": "count"
				}
			}
		}
	};

	mySearchCall = elasticSearchClient.search('sibexplorer', 'pointfive_cell_density', qryObj);
	return mySearchCall;
};

exports.getDistributionsPointTwoDegree = function() {
	qryObj = {
		"fields": ["cell_id", "pointtwo_cell_id", "location_pointtwo_cell", "count"],
		"size": 10000000,
		"query": {
			"filtered" : {
				"query" : {
					"match_all" : {}
				},
				"filter": {
					"term": {"type": "0"}
				}
            }
        },
        "facets": {
			"stats": {
				"statistical": {
					"field": "count"
				}
			}
		}
	};

	mySearchCall = elasticSearchClient.search('sibexplorer', 'pointtwo_cell_density', qryObj);
	return mySearchCall;
};

// Returns cell stats for one degree
exports.getDistributionStatsOneDegree = function(cellid) {
	qryObj = {
		"fields": ["id"],
		"size": 0,
		"query": {
			"filtered" : {
				"query" : {
					"match_all" : {}
				}
			}
		},
		"facets": {
			"canonical": {
				"terms": {
					"field": "canonical.untouched",
					"size" : 10
				}
			},
			"kingdom": {
				"terms": {
					"field": "kingdom_group.untouched",
					"size" : 10
				}
			},
			"phylum": {
				"terms": {
					"field": "phylum_group.untouched",
					"size" : 10
				}
			},
			"taxonClass": {
				"terms": {
					"field": "taxonClass_group.untouched",
					"size" : 10
				}
			},
			"order_rank": {
				"terms": {
					"field": "order_rank_group.untouched",
					"size" : 10
				}
			},
			"family": {
				"terms": {
					"field": "family_group.untouched",
					"size" : 10
				}
			},
			"genus": {
				"terms": {
					"field": "genus_group.untouched",
					"size" : 10
				}
			},
			"species": {
				"terms": {
					"field": "species_group.untouched",
					"size" : 10
				}
			},
			"data_provider_name": {
				"terms": {
					"field": "data_provider_name.untouched",
					"size" : 10
				}
			},
			"data_provider_id": {
				"terms": {
					"field": "data_provider_id",
					"size" : 10
				}
			},
			"data_resource_name": {
				"terms": {
					"field": "data_resource_name.untouched",
					"size" : 10
				}
			},
			"data_resource_id": {
				"terms": {
					"field": "data_resource_id",
					"size" : 10
				}
			}
		}
	};
	qryObj["query"]["filtered"]["filter"] = {};
	qryObj["query"]["filtered"]["filter"]["term"] = {};
	qryObj["query"]["filtered"]["filter"]["term"]["cell_id"] = cellid;


	mySearchCall = elasticSearchClient.search('sibexplorer', 'occurrences', qryObj);
	return mySearchCall;
};

// Returns cell stats for one degree with search conditions
exports.getDistributionStatsWithSearchOneDegree = function(conditions) {
	var qryObj = {
		"fields": [],
		"query": {
			"filtered": {
				"filter": {
					"term" : {
						"cell_id": conditions.cellid
					}
				},
				"query" : {
					"bool": {
						"must": []
					}
				}
			}
		},
		"facets": {
			"canonical": {
				"terms": {
					"field": "canonical.untouched",
					"size" : 10
				}
			},
			"kingdom": {
				"terms": {
					"field": "kingdom_group.untouched",
					"size" : 10
				}
			},
			"phylum": {
				"terms": {
					"field": "phylum_group.untouched",
					"size" : 10
				}
			},
			"taxonClass": {
				"terms": {
					"field": "taxonClass_group.untouched",
					"size" : 10
				}
			},
			"order_rank": {
				"terms": {
					"field": "order_rank_group.untouched",
					"size" : 10
				}
			},
			"family": {
				"terms": {
					"field": "family_group.untouched",
					"size" : 10
				}
			},
			"genus": {
				"terms": {
					"field": "genus_group.untouched",
					"size" : 10
				}
			},
			"species": {
				"terms": {
					"field": "species_group.untouched",
					"size" : 10
				}
			},
			"data_provider_name": {
				"terms": {
					"field": "data_provider_name.untouched",
					"size" : 10
				}
			},
			"data_provider_id": {
				"terms": {
					"field": "data_provider_id",
					"size" : 10
				}
			},
			"data_resource_name": {
				"terms": {
					"field": "data_resource_name.untouched",
					"size" : 10
				}
			},
			"data_resource_id": {
				"terms": {
					"field": "data_resource_id",
					"size" : 10
				}
			}
		}
	};

	var andCounter = 0;
	var orCounter = 0;

	if(conditions.scientificNames) {
		qryObj["query"]["filtered"]["query"]["bool"]["must"][andCounter] = {};
		qryObj["query"]["filtered"]["query"]["bool"]["must"][andCounter]["bool"] = {};
		qryObj["query"]["filtered"]["query"]["bool"]["must"][andCounter]["bool"]["should"] = [];
		_.each(conditions.scientificNames, function(data) {
			qryObj["query"]["filtered"]["query"]["bool"]["must"][andCounter]["bool"]["should"][orCounter] = {};
			qryObj["query"]["filtered"]["query"]["bool"]["must"][andCounter]["bool"]["should"][orCounter]["wildcard"] = {};
			qryObj["query"]["filtered"]["query"]["bool"]["must"][andCounter]["bool"]["should"][orCounter]["wildcard"]["canonical.exactWords"] = data.textObject.toLowerCase();
			orCounter+=1;
		});
		andCounter+=1;
	}
	if(conditions.taxons) {
		orCounter = 0;
		qryObj["query"]["filtered"]["query"]["bool"]["must"][andCounter] = {};
		qryObj["query"]["filtered"]["query"]["bool"]["must"][andCounter]["bool"] = {};
		qryObj["query"]["filtered"]["query"]["bool"]["must"][andCounter]["bool"]["should"] = [];
		_.each(conditions.taxons, function(data) {
			qryObj["query"]["filtered"]["query"]["bool"]["must"][andCounter]["bool"]["should"][orCounter] = {};
			qryObj["query"]["filtered"]["query"]["bool"]["must"][andCounter]["bool"]["should"][orCounter]["wildcard"] = {};
			if(data.textName == "kingdom")
				qryObj["query"]["filtered"]["query"]["bool"]["must"][andCounter]["bool"]["should"][orCounter]["wildcard"]["kingdom.exactWords"] = data.textObject.toLowerCase();
			if(data.textName == "phylum")
				qryObj["query"]["filtered"]["query"]["bool"]["must"][andCounter]["bool"]["should"][orCounter]["wildcard"]["phylum.exactWords"] = data.textObject.toLowerCase();
			if(data.textName == "class")
				qryObj["query"]["filtered"]["query"]["bool"]["must"][andCounter]["bool"]["should"][orCounter]["wildcard"]["taxonClass.exactWords"] = data.textObject.toLowerCase();
			if(data.textName == "order")
				qryObj["query"]["filtered"]["query"]["bool"]["must"][andCounter]["bool"]["should"][orCounter]["wildcard"]["order_rank.exactWords"] = data.textObject.toLowerCase();
			if(data.textName == "family")
				qryObj["query"]["filtered"]["query"]["bool"]["must"][andCounter]["bool"]["should"][orCounter]["wildcard"]["family.exactWords"] = data.textObject.toLowerCase();
			if(data.textName == "genus")
				qryObj["query"]["filtered"]["query"]["bool"]["must"][andCounter]["bool"]["should"][orCounter]["wildcard"]["genus.exactWords"] = data.textObject.toLowerCase();
			if(data.textName == "species")
				qryObj["query"]["filtered"]["query"]["bool"]["must"][andCounter]["bool"]["should"][orCounter]["wildcard"]["species.exactWords"] = data.textObject.toLowerCase();
			orCounter+=1;
		});
		andCounter+=1;
	}
	if(conditions.countries) {
		orCounter = 0;
		qryObj["query"]["filtered"]["query"]["bool"]["must"][andCounter] = {};
		qryObj["query"]["filtered"]["query"]["bool"]["must"][andCounter]["bool"] = {};
		qryObj["query"]["filtered"]["query"]["bool"]["must"][andCounter]["bool"]["should"] = [];
		_.each(conditions.countries, function(data) {
			qryObj["query"]["filtered"]["query"]["bool"]["must"][andCounter]["bool"]["should"][orCounter] = {};
			qryObj["query"]["filtered"]["query"]["bool"]["must"][andCounter]["bool"]["should"][orCounter]["wildcard"] = {};
			qryObj["query"]["filtered"]["query"]["bool"]["must"][andCounter]["bool"]["should"][orCounter]["wildcard"]["iso_country_code.exactWords"] = data.textObject.toLowerCase();
			orCounter+=1;
		});
		andCounter+=1;
	}
	if(conditions.departments) {
		orCounter = 0;
		qryObj["query"]["filtered"]["query"]["bool"]["must"][andCounter] = {};
		qryObj["query"]["filtered"]["query"]["bool"]["must"][andCounter]["bool"] = {};
		qryObj["query"]["filtered"]["query"]["bool"]["must"][andCounter]["bool"]["should"] = [];
		_.each(conditions.departments, function(data) {
			qryObj["query"]["filtered"]["query"]["bool"]["must"][andCounter]["bool"]["should"][orCounter] = {};
			qryObj["query"]["filtered"]["query"]["bool"]["must"][andCounter]["bool"]["should"][orCounter]["wildcard"] = {};
			qryObj["query"]["filtered"]["query"]["bool"]["must"][andCounter]["bool"]["should"][orCounter]["wildcard"]["iso_department_code.exactWords"] = data.textObject.toLowerCase();
			orCounter+=1;
		});
		andCounter+=1;
	}
	if(conditions.providers) {
		orCounter = 0;
		qryObj["query"]["filtered"]["query"]["bool"]["must"][andCounter] = {};
		qryObj["query"]["filtered"]["query"]["bool"]["must"][andCounter]["bool"] = {};
		qryObj["query"]["filtered"]["query"]["bool"]["must"][andCounter]["bool"]["should"] = [];
		_.each(conditions.providers, function(data) {
			qryObj["query"]["filtered"]["query"]["bool"]["must"][andCounter]["bool"]["should"][orCounter] = {};
			qryObj["query"]["filtered"]["query"]["bool"]["must"][andCounter]["bool"]["should"][orCounter]["wildcard"] = {};
			qryObj["query"]["filtered"]["query"]["bool"]["must"][andCounter]["bool"]["should"][orCounter]["wildcard"]["data_provider_name.exactWords"] = data.textObject.toLowerCase();
			orCounter+=1;
		});
		andCounter+=1;
	}
	if(conditions.resources) {
		orCounter = 0;
		qryObj["query"]["filtered"]["query"]["bool"]["must"][andCounter] = {};
		qryObj["query"]["filtered"]["query"]["bool"]["must"][andCounter]["bool"] = {};
		qryObj["query"]["filtered"]["query"]["bool"]["must"][andCounter]["bool"]["should"] = [];
		_.each(conditions.resources, function(data) {
			qryObj["query"]["filtered"]["query"]["bool"]["must"][andCounter]["bool"]["should"][orCounter] = {};
			qryObj["query"]["filtered"]["query"]["bool"]["must"][andCounter]["bool"]["should"][orCounter]["wildcard"] = {};
			qryObj["query"]["filtered"]["query"]["bool"]["must"][andCounter]["bool"]["should"][orCounter]["wildcard"]["data_resource_name.exactWords"] = data.textObject.toLowerCase();
			orCounter+=1;
		});
		andCounter+=1;
	}
	mySearchCall = elasticSearchClient.search('sibexplorer', 'occurrences', qryObj);
	return mySearchCall;
};

// Returns cell stats for point five degree
exports.getDistributionStatsPointFiveDegree = function(cellid, pointfivecellid) {
	qryObj = {
		"fields": ["id"],
		"size": 0,
		"query": {
			"filtered" : {
				"query" : {
					"match_all" : {}
				}
			}
		},
		"facets": {
			"canonical": {
				"terms": {
					"field": "canonical.untouched",
					"size" : 10
				}
			},
			"kingdom": {
				"terms": {
					"field": "kingdom_group.untouched",
					"size" : 10
				}
			},
			"phylum": {
				"terms": {
					"field": "phylum_group.untouched",
					"size" : 10
				}
			},
			"taxonClass": {
				"terms": {
					"field": "taxonClass_group.untouched",
					"size" : 10
				}
			},
			"order_rank": {
				"terms": {
					"field": "order_rank_group.untouched",
					"size" : 10
				}
			},
			"family": {
				"terms": {
					"field": "family_group.untouched",
					"size" : 10
				}
			},
			"genus": {
				"terms": {
					"field": "genus_group.untouched",
					"size" : 10
				}
			},
			"species": {
				"terms": {
					"field": "species_group.untouched",
					"size" : 10
				}
			},
			"data_provider_name": {
				"terms": {
					"field": "data_provider_name.untouched",
					"size" : 10
				}
			},
			"data_provider_id": {
				"terms": {
					"field": "data_provider_id",
					"size" : 10
				}
			},
			"data_resource_name": {
				"terms": {
					"field": "data_resource_name.untouched",
					"size" : 10
				}
			},
			"data_resource_id": {
				"terms": {
					"field": "data_resource_id",
					"size" : 10
				}
			}
		}
	};
	qryObj["query"]["filtered"]["filter"] = {};
	qryObj["query"]["filtered"]["filter"]["and"] = [];
	qryObj["query"]["filtered"]["filter"]["and"][0] = {};
	qryObj["query"]["filtered"]["filter"]["and"][0]["term"] = {};
	qryObj["query"]["filtered"]["filter"]["and"][0]["term"]["cell_id"] = cellid;

	qryObj["query"]["filtered"]["filter"]["and"][1] = {};
	qryObj["query"]["filtered"]["filter"]["and"][1]["term"] = {};
	qryObj["query"]["filtered"]["filter"]["and"][1]["term"]["pointfive_cell_id"] = pointfivecellid;

	mySearchCall = elasticSearchClient.search('sibexplorer', 'occurrences', qryObj);
	return mySearchCall;
};

// Returns cell stats for point five degree with search conditions
exports.getDistributionStatsWithSearchPointFiveDegree = function(conditions) {
	var qryObj = {
		"fields": [],
		"query": {
			"filtered": {
				"filter": {
					"and": [
						{
							"term" : {
								"cell_id": conditions.cellid
							}
						},
						{
							"term" : {
								"pointfive_cell_id": conditions.pointfivecellid
							}
						}
					]
				},
				"query" : {
					"bool": {
						"must": []
					}
				}
			}
		},
		"facets": {
			"canonical": {
				"terms": {
					"field": "canonical.untouched",
					"size" : 10
				}
			},
			"kingdom": {
				"terms": {
					"field": "kingdom_group.untouched",
					"size" : 10
				}
			},
			"phylum": {
				"terms": {
					"field": "phylum_group.untouched",
					"size" : 10
				}
			},
			"taxonClass": {
				"terms": {
					"field": "taxonClass_group.untouched",
					"size" : 10
				}
			},
			"order_rank": {
				"terms": {
					"field": "order_rank_group.untouched",
					"size" : 10
				}
			},
			"family": {
				"terms": {
					"field": "family_group.untouched",
					"size" : 10
				}
			},
			"genus": {
				"terms": {
					"field": "genus_group.untouched",
					"size" : 10
				}
			},
			"species": {
				"terms": {
					"field": "species_group.untouched",
					"size" : 10
				}
			},
			"data_provider_name": {
				"terms": {
					"field": "data_provider_name.untouched",
					"size" : 10
				}
			},
			"data_provider_id": {
				"terms": {
					"field": "data_provider_id",
					"size" : 10
				}
			},
			"data_resource_name": {
				"terms": {
					"field": "data_resource_name.untouched",
					"size" : 10
				}
			},
			"data_resource_id": {
				"terms": {
					"field": "data_resource_id",
					"size" : 10
				}
			}
		}
	};

	var andCounter = 0;
	var orCounter = 0;

	if(conditions.scientificNames) {
		qryObj["query"]["filtered"]["query"]["bool"]["must"][andCounter] = {};
		qryObj["query"]["filtered"]["query"]["bool"]["must"][andCounter]["bool"] = {};
		qryObj["query"]["filtered"]["query"]["bool"]["must"][andCounter]["bool"]["should"] = [];
		_.each(conditions.scientificNames, function(data) {
			qryObj["query"]["filtered"]["query"]["bool"]["must"][andCounter]["bool"]["should"][orCounter] = {};
			qryObj["query"]["filtered"]["query"]["bool"]["must"][andCounter]["bool"]["should"][orCounter]["wildcard"] = {};
			qryObj["query"]["filtered"]["query"]["bool"]["must"][andCounter]["bool"]["should"][orCounter]["wildcard"]["canonical.exactWords"] = data.textObject.toLowerCase();
			orCounter+=1;
		});
		andCounter+=1;
	}
	if(conditions.taxons) {
		orCounter = 0;
		qryObj["query"]["filtered"]["query"]["bool"]["must"][andCounter] = {};
		qryObj["query"]["filtered"]["query"]["bool"]["must"][andCounter]["bool"] = {};
		qryObj["query"]["filtered"]["query"]["bool"]["must"][andCounter]["bool"]["should"] = [];
		_.each(conditions.taxons, function(data) {
			qryObj["query"]["filtered"]["query"]["bool"]["must"][andCounter]["bool"]["should"][orCounter] = {};
			qryObj["query"]["filtered"]["query"]["bool"]["must"][andCounter]["bool"]["should"][orCounter]["wildcard"] = {};
			if(data.textName == "kingdom")
				qryObj["query"]["filtered"]["query"]["bool"]["must"][andCounter]["bool"]["should"][orCounter]["wildcard"]["kingdom.exactWords"] = data.textObject.toLowerCase();
			if(data.textName == "phylum")
				qryObj["query"]["filtered"]["query"]["bool"]["must"][andCounter]["bool"]["should"][orCounter]["wildcard"]["phylum.exactWords"] = data.textObject.toLowerCase();
			if(data.textName == "class")
				qryObj["query"]["filtered"]["query"]["bool"]["must"][andCounter]["bool"]["should"][orCounter]["wildcard"]["taxonClass.exactWords"] = data.textObject.toLowerCase();
			if(data.textName == "order")
				qryObj["query"]["filtered"]["query"]["bool"]["must"][andCounter]["bool"]["should"][orCounter]["wildcard"]["order_rank.exactWords"] = data.textObject.toLowerCase();
			if(data.textName == "family")
				qryObj["query"]["filtered"]["query"]["bool"]["must"][andCounter]["bool"]["should"][orCounter]["wildcard"]["family.exactWords"] = data.textObject.toLowerCase();
			if(data.textName == "genus")
				qryObj["query"]["filtered"]["query"]["bool"]["must"][andCounter]["bool"]["should"][orCounter]["wildcard"]["genus.exactWords"] = data.textObject.toLowerCase();
			if(data.textName == "species")
				qryObj["query"]["filtered"]["query"]["bool"]["must"][andCounter]["bool"]["should"][orCounter]["wildcard"]["species.exactWords"] = data.textObject.toLowerCase();
			orCounter+=1;
		});
		andCounter+=1;
	}
	if(conditions.countries) {
		orCounter = 0;
		qryObj["query"]["filtered"]["query"]["bool"]["must"][andCounter] = {};
		qryObj["query"]["filtered"]["query"]["bool"]["must"][andCounter]["bool"] = {};
		qryObj["query"]["filtered"]["query"]["bool"]["must"][andCounter]["bool"]["should"] = [];
		_.each(conditions.countries, function(data) {
			qryObj["query"]["filtered"]["query"]["bool"]["must"][andCounter]["bool"]["should"][orCounter] = {};
			qryObj["query"]["filtered"]["query"]["bool"]["must"][andCounter]["bool"]["should"][orCounter]["wildcard"] = {};
			qryObj["query"]["filtered"]["query"]["bool"]["must"][andCounter]["bool"]["should"][orCounter]["wildcard"]["iso_country_code.exactWords"] = data.textObject.toLowerCase();
			orCounter+=1;
		});
		andCounter+=1;
	}
	if(conditions.departments) {
		orCounter = 0;
		qryObj["query"]["filtered"]["query"]["bool"]["must"][andCounter] = {};
		qryObj["query"]["filtered"]["query"]["bool"]["must"][andCounter]["bool"] = {};
		qryObj["query"]["filtered"]["query"]["bool"]["must"][andCounter]["bool"]["should"] = [];
		_.each(conditions.departments, function(data) {
			qryObj["query"]["filtered"]["query"]["bool"]["must"][andCounter]["bool"]["should"][orCounter] = {};
			qryObj["query"]["filtered"]["query"]["bool"]["must"][andCounter]["bool"]["should"][orCounter]["wildcard"] = {};
			qryObj["query"]["filtered"]["query"]["bool"]["must"][andCounter]["bool"]["should"][orCounter]["wildcard"]["iso_department_code.exactWords"] = data.textObject.toLowerCase();
			orCounter+=1;
		});
		andCounter+=1;
	}
	if(conditions.providers) {
		orCounter = 0;
		qryObj["query"]["filtered"]["query"]["bool"]["must"][andCounter] = {};
		qryObj["query"]["filtered"]["query"]["bool"]["must"][andCounter]["bool"] = {};
		qryObj["query"]["filtered"]["query"]["bool"]["must"][andCounter]["bool"]["should"] = [];
		_.each(conditions.providers, function(data) {
			qryObj["query"]["filtered"]["query"]["bool"]["must"][andCounter]["bool"]["should"][orCounter] = {};
			qryObj["query"]["filtered"]["query"]["bool"]["must"][andCounter]["bool"]["should"][orCounter]["wildcard"] = {};
			qryObj["query"]["filtered"]["query"]["bool"]["must"][andCounter]["bool"]["should"][orCounter]["wildcard"]["data_provider_name.exactWords"] = data.textObject.toLowerCase();
			orCounter+=1;
		});
		andCounter+=1;
	}
	if(conditions.resources) {
		orCounter = 0;
		qryObj["query"]["filtered"]["query"]["bool"]["must"][andCounter] = {};
		qryObj["query"]["filtered"]["query"]["bool"]["must"][andCounter]["bool"] = {};
		qryObj["query"]["filtered"]["query"]["bool"]["must"][andCounter]["bool"]["should"] = [];
		_.each(conditions.resources, function(data) {
			qryObj["query"]["filtered"]["query"]["bool"]["must"][andCounter]["bool"]["should"][orCounter] = {};
			qryObj["query"]["filtered"]["query"]["bool"]["must"][andCounter]["bool"]["should"][orCounter]["wildcard"] = {};
			qryObj["query"]["filtered"]["query"]["bool"]["must"][andCounter]["bool"]["should"][orCounter]["wildcard"]["data_resource_name.exactWords"] = data.textObject.toLowerCase();
			orCounter+=1;
		});
		andCounter+=1;
	}
	mySearchCall = elasticSearchClient.search('sibexplorer', 'occurrences', qryObj);
	return mySearchCall;
};

// Returns cell stats for point one degree
exports.getDistributionStatsPointOneDegree = function(cellid, centicellid) {
	qryObj = {
		"fields": ["id"],
		"size": 0,
		"query": {
			"filtered" : {
				"query" : {
					"match_all" : {}
				}
			}
		},
		"facets": {
			"canonical": {
				"terms": {
					"field": "canonical.untouched",
					"size" : 10
				}
			},
			"kingdom": {
				"terms": {
					"field": "kingdom_group.untouched",
					"size" : 10
				}
			},
			"phylum": {
				"terms": {
					"field": "phylum_group.untouched",
					"size" : 10
				}
			},
			"taxonClass": {
				"terms": {
					"field": "taxonClass_group.untouched",
					"size" : 10
				}
			},
			"order_rank": {
				"terms": {
					"field": "order_rank_group.untouched",
					"size" : 10
				}
			},
			"family": {
				"terms": {
					"field": "family_group.untouched",
					"size" : 10
				}
			},
			"genus": {
				"terms": {
					"field": "genus_group.untouched",
					"size" : 10
				}
			},
			"species": {
				"terms": {
					"field": "species_group.untouched",
					"size" : 10
				}
			},
			"data_provider_name": {
				"terms": {
					"field": "data_provider_name.untouched",
					"size" : 10
				}
			},
			"data_provider_id": {
				"terms": {
					"field": "data_provider_id",
					"size" : 10
				}
			},
			"data_resource_name": {
				"terms": {
					"field": "data_resource_name.untouched",
					"size" : 10
				}
			},
			"data_resource_id": {
				"terms": {
					"field": "data_resource_id",
					"size" : 10
				}
			}
		}
	};
	qryObj["query"]["filtered"]["filter"] = {};
	qryObj["query"]["filtered"]["filter"]["and"] = [];
	qryObj["query"]["filtered"]["filter"]["and"][0] = {};
	qryObj["query"]["filtered"]["filter"]["and"][0]["term"] = {};
	qryObj["query"]["filtered"]["filter"]["and"][0]["term"]["cell_id"] = cellid;

	qryObj["query"]["filtered"]["filter"]["and"][1] = {};
	qryObj["query"]["filtered"]["filter"]["and"][1]["term"] = {};
	qryObj["query"]["filtered"]["filter"]["and"][1]["term"]["centi_cell_id"] = centicellid;

	mySearchCall = elasticSearchClient.search('sibexplorer', 'occurrences', qryObj);
	return mySearchCall;
};

// Returns cell stats for point one degree with search conditions
exports.getDistributionStatsWithSearchPointOneDegree = function(conditions) {
	var qryObj = {
		"fields": [],
		"query": {
			"filtered": {
				"filter": {
					"and": [
						{
							"term" : {
								"cell_id": conditions.cellid
							}
						},
						{
							"term" : {
								"centi_cell_id": conditions.pointonecellid
							}
						}
					]
				},
				"query" : {
					"bool": {
						"must": []
					}
				}
			}
		},
		"facets": {
			"canonical": {
				"terms": {
					"field": "canonical.untouched",
					"size" : 10
				}
			},
			"kingdom": {
				"terms": {
					"field": "kingdom_group.untouched",
					"size" : 10
				}
			},
			"phylum": {
				"terms": {
					"field": "phylum_group.untouched",
					"size" : 10
				}
			},
			"taxonClass": {
				"terms": {
					"field": "taxonClass_group.untouched",
					"size" : 10
				}
			},
			"order_rank": {
				"terms": {
					"field": "order_rank_group.untouched",
					"size" : 10
				}
			},
			"family": {
				"terms": {
					"field": "family_group.untouched",
					"size" : 10
				}
			},
			"genus": {
				"terms": {
					"field": "genus_group.untouched",
					"size" : 10
				}
			},
			"species": {
				"terms": {
					"field": "species_group.untouched",
					"size" : 10
				}
			},
			"data_provider_name": {
				"terms": {
					"field": "data_provider_name.untouched",
					"size" : 10
				}
			},
			"data_provider_id": {
				"terms": {
					"field": "data_provider_id",
					"size" : 10
				}
			},
			"data_resource_name": {
				"terms": {
					"field": "data_resource_name.untouched",
					"size" : 10
				}
			},
			"data_resource_id": {
				"terms": {
					"field": "data_resource_id",
					"size" : 10
				}
			}
		}
	};

	var andCounter = 0;
	var orCounter = 0;

	if(conditions.scientificNames) {
		qryObj["query"]["filtered"]["query"]["bool"]["must"][andCounter] = {};
		qryObj["query"]["filtered"]["query"]["bool"]["must"][andCounter]["bool"] = {};
		qryObj["query"]["filtered"]["query"]["bool"]["must"][andCounter]["bool"]["should"] = [];
		_.each(conditions.scientificNames, function(data) {
			qryObj["query"]["filtered"]["query"]["bool"]["must"][andCounter]["bool"]["should"][orCounter] = {};
			qryObj["query"]["filtered"]["query"]["bool"]["must"][andCounter]["bool"]["should"][orCounter]["wildcard"] = {};
			qryObj["query"]["filtered"]["query"]["bool"]["must"][andCounter]["bool"]["should"][orCounter]["wildcard"]["canonical.exactWords"] = data.textObject.toLowerCase();
			orCounter+=1;
		});
		andCounter+=1;
	}
	if(conditions.taxons) {
		orCounter = 0;
		qryObj["query"]["filtered"]["query"]["bool"]["must"][andCounter] = {};
		qryObj["query"]["filtered"]["query"]["bool"]["must"][andCounter]["bool"] = {};
		qryObj["query"]["filtered"]["query"]["bool"]["must"][andCounter]["bool"]["should"] = [];
		_.each(conditions.taxons, function(data) {
			qryObj["query"]["filtered"]["query"]["bool"]["must"][andCounter]["bool"]["should"][orCounter] = {};
			qryObj["query"]["filtered"]["query"]["bool"]["must"][andCounter]["bool"]["should"][orCounter]["wildcard"] = {};
			if(data.textName == "kingdom")
				qryObj["query"]["filtered"]["query"]["bool"]["must"][andCounter]["bool"]["should"][orCounter]["wildcard"]["kingdom.exactWords"] = data.textObject.toLowerCase();
			if(data.textName == "phylum")
				qryObj["query"]["filtered"]["query"]["bool"]["must"][andCounter]["bool"]["should"][orCounter]["wildcard"]["phylum.exactWords"] = data.textObject.toLowerCase();
			if(data.textName == "class")
				qryObj["query"]["filtered"]["query"]["bool"]["must"][andCounter]["bool"]["should"][orCounter]["wildcard"]["taxonClass.exactWords"] = data.textObject.toLowerCase();
			if(data.textName == "order")
				qryObj["query"]["filtered"]["query"]["bool"]["must"][andCounter]["bool"]["should"][orCounter]["wildcard"]["order_rank.exactWords"] = data.textObject.toLowerCase();
			if(data.textName == "family")
				qryObj["query"]["filtered"]["query"]["bool"]["must"][andCounter]["bool"]["should"][orCounter]["wildcard"]["family.exactWords"] = data.textObject.toLowerCase();
			if(data.textName == "genus")
				qryObj["query"]["filtered"]["query"]["bool"]["must"][andCounter]["bool"]["should"][orCounter]["wildcard"]["genus.exactWords"] = data.textObject.toLowerCase();
			if(data.textName == "species")
				qryObj["query"]["filtered"]["query"]["bool"]["must"][andCounter]["bool"]["should"][orCounter]["wildcard"]["species.exactWords"] = data.textObject.toLowerCase();
			orCounter+=1;
		});
		andCounter+=1;
	}
	if(conditions.countries) {
		orCounter = 0;
		qryObj["query"]["filtered"]["query"]["bool"]["must"][andCounter] = {};
		qryObj["query"]["filtered"]["query"]["bool"]["must"][andCounter]["bool"] = {};
		qryObj["query"]["filtered"]["query"]["bool"]["must"][andCounter]["bool"]["should"] = [];
		_.each(conditions.countries, function(data) {
			qryObj["query"]["filtered"]["query"]["bool"]["must"][andCounter]["bool"]["should"][orCounter] = {};
			qryObj["query"]["filtered"]["query"]["bool"]["must"][andCounter]["bool"]["should"][orCounter]["wildcard"] = {};
			qryObj["query"]["filtered"]["query"]["bool"]["must"][andCounter]["bool"]["should"][orCounter]["wildcard"]["iso_country_code.exactWords"] = data.textObject.toLowerCase();
			orCounter+=1;
		});
		andCounter+=1;
	}
	if(conditions.departments) {
		orCounter = 0;
		qryObj["query"]["filtered"]["query"]["bool"]["must"][andCounter] = {};
		qryObj["query"]["filtered"]["query"]["bool"]["must"][andCounter]["bool"] = {};
		qryObj["query"]["filtered"]["query"]["bool"]["must"][andCounter]["bool"]["should"] = [];
		_.each(conditions.departments, function(data) {
			qryObj["query"]["filtered"]["query"]["bool"]["must"][andCounter]["bool"]["should"][orCounter] = {};
			qryObj["query"]["filtered"]["query"]["bool"]["must"][andCounter]["bool"]["should"][orCounter]["wildcard"] = {};
			qryObj["query"]["filtered"]["query"]["bool"]["must"][andCounter]["bool"]["should"][orCounter]["wildcard"]["iso_department_code.exactWords"] = data.textObject.toLowerCase();
			orCounter+=1;
		});
		andCounter+=1;
	}
	if(conditions.providers) {
		orCounter = 0;
		qryObj["query"]["filtered"]["query"]["bool"]["must"][andCounter] = {};
		qryObj["query"]["filtered"]["query"]["bool"]["must"][andCounter]["bool"] = {};
		qryObj["query"]["filtered"]["query"]["bool"]["must"][andCounter]["bool"]["should"] = [];
		_.each(conditions.providers, function(data) {
			qryObj["query"]["filtered"]["query"]["bool"]["must"][andCounter]["bool"]["should"][orCounter] = {};
			qryObj["query"]["filtered"]["query"]["bool"]["must"][andCounter]["bool"]["should"][orCounter]["wildcard"] = {};
			qryObj["query"]["filtered"]["query"]["bool"]["must"][andCounter]["bool"]["should"][orCounter]["wildcard"]["data_provider_name.exactWords"] = data.textObject.toLowerCase();
			orCounter+=1;
		});
		andCounter+=1;
	}
	if(conditions.resources) {
		orCounter = 0;
		qryObj["query"]["filtered"]["query"]["bool"]["must"][andCounter] = {};
		qryObj["query"]["filtered"]["query"]["bool"]["must"][andCounter]["bool"] = {};
		qryObj["query"]["filtered"]["query"]["bool"]["must"][andCounter]["bool"]["should"] = [];
		_.each(conditions.resources, function(data) {
			qryObj["query"]["filtered"]["query"]["bool"]["must"][andCounter]["bool"]["should"][orCounter] = {};
			qryObj["query"]["filtered"]["query"]["bool"]["must"][andCounter]["bool"]["should"][orCounter]["wildcard"] = {};
			qryObj["query"]["filtered"]["query"]["bool"]["must"][andCounter]["bool"]["should"][orCounter]["wildcard"]["data_resource_name.exactWords"] = data.textObject.toLowerCase();
			orCounter+=1;
		});
		andCounter+=1;
	}
	mySearchCall = elasticSearchClient.search('sibexplorer', 'occurrences', qryObj);
	return mySearchCall;
};

// Returns cell stats for point two degree
exports.getDistributionStatsPointTwoDegree = function(cellid, pointtwocellid) {
	qryObj = {
		"fields": ["id"],
		"size": 0,
		"query": {
			"filtered" : {
				"query" : {
					"match_all" : {}
				}
			}
		},
		"facets": {
			"canonical": {
				"terms": {
					"field": "canonical.untouched",
					"size" : 10
				}
			},
			"kingdom": {
				"terms": {
					"field": "kingdom_group.untouched",
					"size" : 10
				}
			},
			"phylum": {
				"terms": {
					"field": "phylum_group.untouched",
					"size" : 10
				}
			},
			"taxonClass": {
				"terms": {
					"field": "taxonClass_group.untouched",
					"size" : 10
				}
			},
			"order_rank": {
				"terms": {
					"field": "order_rank_group.untouched",
					"size" : 10
				}
			},
			"family": {
				"terms": {
					"field": "family_group.untouched",
					"size" : 10
				}
			},
			"genus": {
				"terms": {
					"field": "genus_group.untouched",
					"size" : 10
				}
			},
			"species": {
				"terms": {
					"field": "species_group.untouched",
					"size" : 10
				}
			},
			"data_provider_name": {
				"terms": {
					"field": "data_provider_name.untouched",
					"size" : 10
				}
			},
			"data_provider_id": {
				"terms": {
					"field": "data_provider_id",
					"size" : 10
				}
			},
			"data_resource_name": {
				"terms": {
					"field": "data_resource_name.untouched",
					"size" : 10
				}
			},
			"data_resource_id": {
				"terms": {
					"field": "data_resource_id",
					"size" : 10
				}
			}
		}
	};
	qryObj["query"]["filtered"]["filter"] = {};
	qryObj["query"]["filtered"]["filter"]["and"] = [];
	qryObj["query"]["filtered"]["filter"]["and"][0] = {};
	qryObj["query"]["filtered"]["filter"]["and"][0]["term"] = {};
	qryObj["query"]["filtered"]["filter"]["and"][0]["term"]["cell_id"] = cellid;

	qryObj["query"]["filtered"]["filter"]["and"][1] = {};
	qryObj["query"]["filtered"]["filter"]["and"][1]["term"] = {};
	qryObj["query"]["filtered"]["filter"]["and"][1]["term"]["pointtwo_cell_id"] = pointtwocellid;

	mySearchCall = elasticSearchClient.search('sibexplorer', 'occurrences', qryObj);
	return mySearchCall;
};

// Returns cell stats for point two degree with query conditions
exports.getDistributionStatsWithSearchPointTwoDegree = function(conditions) {
	var qryObj = {
		"fields": [],
		"query": {
			"filtered": {
				"filter": {
					"and": [
						{
							"term" : {
								"cell_id": conditions.cellid
							}
						},
						{
							"term" : {
								"pointtwo_cell_id": conditions.pointtwocellid
							}
						}
					]
				},
				"query" : {
					"bool": {
						"must": []
					}
				}
			}
		},
		"facets": {
			"canonical": {
				"terms": {
					"field": "canonical.untouched",
					"size" : 10
				}
			},
			"kingdom": {
				"terms": {
					"field": "kingdom_group.untouched",
					"size" : 10
				}
			},
			"phylum": {
				"terms": {
					"field": "phylum_group.untouched",
					"size" : 10
				}
			},
			"taxonClass": {
				"terms": {
					"field": "taxonClass_group.untouched",
					"size" : 10
				}
			},
			"order_rank": {
				"terms": {
					"field": "order_rank_group.untouched",
					"size" : 10
				}
			},
			"family": {
				"terms": {
					"field": "family_group.untouched",
					"size" : 10
				}
			},
			"genus": {
				"terms": {
					"field": "genus_group.untouched",
					"size" : 10
				}
			},
			"species": {
				"terms": {
					"field": "species_group.untouched",
					"size" : 10
				}
			},
			"data_provider_name": {
				"terms": {
					"field": "data_provider_name.untouched",
					"size" : 10
				}
			},
			"data_provider_id": {
				"terms": {
					"field": "data_provider_id",
					"size" : 10
				}
			},
			"data_resource_name": {
				"terms": {
					"field": "data_resource_name.untouched",
					"size" : 10
				}
			},
			"data_resource_id": {
				"terms": {
					"field": "data_resource_id",
					"size" : 10
				}
			}
		}
	};

	var andCounter = 0;
	var orCounter = 0;

	if(conditions.scientificNames) {
		qryObj["query"]["filtered"]["query"]["bool"]["must"][andCounter] = {};
		qryObj["query"]["filtered"]["query"]["bool"]["must"][andCounter]["bool"] = {};
		qryObj["query"]["filtered"]["query"]["bool"]["must"][andCounter]["bool"]["should"] = [];
		_.each(conditions.scientificNames, function(data) {
			qryObj["query"]["filtered"]["query"]["bool"]["must"][andCounter]["bool"]["should"][orCounter] = {};
			qryObj["query"]["filtered"]["query"]["bool"]["must"][andCounter]["bool"]["should"][orCounter]["wildcard"] = {};
			qryObj["query"]["filtered"]["query"]["bool"]["must"][andCounter]["bool"]["should"][orCounter]["wildcard"]["canonical.exactWords"] = data.textObject.toLowerCase();
			orCounter+=1;
		});
		andCounter+=1;
	}
	if(conditions.taxons) {
		orCounter = 0;
		qryObj["query"]["filtered"]["query"]["bool"]["must"][andCounter] = {};
		qryObj["query"]["filtered"]["query"]["bool"]["must"][andCounter]["bool"] = {};
		qryObj["query"]["filtered"]["query"]["bool"]["must"][andCounter]["bool"]["should"] = [];
		_.each(conditions.taxons, function(data) {
			qryObj["query"]["filtered"]["query"]["bool"]["must"][andCounter]["bool"]["should"][orCounter] = {};
			qryObj["query"]["filtered"]["query"]["bool"]["must"][andCounter]["bool"]["should"][orCounter]["wildcard"] = {};
			if(data.textName == "kingdom")
				qryObj["query"]["filtered"]["query"]["bool"]["must"][andCounter]["bool"]["should"][orCounter]["wildcard"]["kingdom.exactWords"] = data.textObject.toLowerCase();
			if(data.textName == "phylum")
				qryObj["query"]["filtered"]["query"]["bool"]["must"][andCounter]["bool"]["should"][orCounter]["wildcard"]["phylum.exactWords"] = data.textObject.toLowerCase();
			if(data.textName == "class")
				qryObj["query"]["filtered"]["query"]["bool"]["must"][andCounter]["bool"]["should"][orCounter]["wildcard"]["taxonClass.exactWords"] = data.textObject.toLowerCase();
			if(data.textName == "order")
				qryObj["query"]["filtered"]["query"]["bool"]["must"][andCounter]["bool"]["should"][orCounter]["wildcard"]["order_rank.exactWords"] = data.textObject.toLowerCase();
			if(data.textName == "family")
				qryObj["query"]["filtered"]["query"]["bool"]["must"][andCounter]["bool"]["should"][orCounter]["wildcard"]["family.exactWords"] = data.textObject.toLowerCase();
			if(data.textName == "genus")
				qryObj["query"]["filtered"]["query"]["bool"]["must"][andCounter]["bool"]["should"][orCounter]["wildcard"]["genus.exactWords"] = data.textObject.toLowerCase();
			if(data.textName == "species")
				qryObj["query"]["filtered"]["query"]["bool"]["must"][andCounter]["bool"]["should"][orCounter]["wildcard"]["species.exactWords"] = data.textObject.toLowerCase();
			orCounter+=1;
		});
		andCounter+=1;
	}
	if(conditions.countries) {
		orCounter = 0;
		qryObj["query"]["filtered"]["query"]["bool"]["must"][andCounter] = {};
		qryObj["query"]["filtered"]["query"]["bool"]["must"][andCounter]["bool"] = {};
		qryObj["query"]["filtered"]["query"]["bool"]["must"][andCounter]["bool"]["should"] = [];
		_.each(conditions.countries, function(data) {
			qryObj["query"]["filtered"]["query"]["bool"]["must"][andCounter]["bool"]["should"][orCounter] = {};
			qryObj["query"]["filtered"]["query"]["bool"]["must"][andCounter]["bool"]["should"][orCounter]["wildcard"] = {};
			qryObj["query"]["filtered"]["query"]["bool"]["must"][andCounter]["bool"]["should"][orCounter]["wildcard"]["iso_country_code.exactWords"] = data.textObject.toLowerCase();
			orCounter+=1;
		});
		andCounter+=1;
	}
	if(conditions.departments) {
		orCounter = 0;
		qryObj["query"]["filtered"]["query"]["bool"]["must"][andCounter] = {};
		qryObj["query"]["filtered"]["query"]["bool"]["must"][andCounter]["bool"] = {};
		qryObj["query"]["filtered"]["query"]["bool"]["must"][andCounter]["bool"]["should"] = [];
		_.each(conditions.departments, function(data) {
			qryObj["query"]["filtered"]["query"]["bool"]["must"][andCounter]["bool"]["should"][orCounter] = {};
			qryObj["query"]["filtered"]["query"]["bool"]["must"][andCounter]["bool"]["should"][orCounter]["wildcard"] = {};
			qryObj["query"]["filtered"]["query"]["bool"]["must"][andCounter]["bool"]["should"][orCounter]["wildcard"]["iso_department_code.exactWords"] = data.textObject.toLowerCase();
			orCounter+=1;
		});
		andCounter+=1;
	}
	if(conditions.providers) {
		orCounter = 0;
		qryObj["query"]["filtered"]["query"]["bool"]["must"][andCounter] = {};
		qryObj["query"]["filtered"]["query"]["bool"]["must"][andCounter]["bool"] = {};
		qryObj["query"]["filtered"]["query"]["bool"]["must"][andCounter]["bool"]["should"] = [];
		_.each(conditions.providers, function(data) {
			qryObj["query"]["filtered"]["query"]["bool"]["must"][andCounter]["bool"]["should"][orCounter] = {};
			qryObj["query"]["filtered"]["query"]["bool"]["must"][andCounter]["bool"]["should"][orCounter]["wildcard"] = {};
			qryObj["query"]["filtered"]["query"]["bool"]["must"][andCounter]["bool"]["should"][orCounter]["wildcard"]["data_provider_name.exactWords"] = data.textObject.toLowerCase();
			orCounter+=1;
		});
		andCounter+=1;
	}
	if(conditions.resources) {
		orCounter = 0;
		qryObj["query"]["filtered"]["query"]["bool"]["must"][andCounter] = {};
		qryObj["query"]["filtered"]["query"]["bool"]["must"][andCounter]["bool"] = {};
		qryObj["query"]["filtered"]["query"]["bool"]["must"][andCounter]["bool"]["should"] = [];
		_.each(conditions.resources, function(data) {
			qryObj["query"]["filtered"]["query"]["bool"]["must"][andCounter]["bool"]["should"][orCounter] = {};
			qryObj["query"]["filtered"]["query"]["bool"]["must"][andCounter]["bool"]["should"][orCounter]["wildcard"] = {};
			qryObj["query"]["filtered"]["query"]["bool"]["must"][andCounter]["bool"]["should"][orCounter]["wildcard"]["data_resource_name.exactWords"] = data.textObject.toLowerCase();
			orCounter+=1;
		});
		andCounter+=1;
	}
	mySearchCall = elasticSearchClient.search('sibexplorer', 'occurrences', qryObj);
	return mySearchCall;
};

exports.getDistributionWithFilter = function(conditions) {
	var qryObj = {
		"fields": [],
		"query": {
			"filtered": {
				"filter": {
					"exists" : {
						"field": "cell_id"
					}
				},
				"query" : {
					"bool": {
						"must": []
					}
				}
			}
		},
		"facets": {
			"cellgroup": {
				"terms": {
					"field": "cell_group.untouched",
					"size" : 100000000
				}
			},
			"pointfivegroup": {
				"terms": {
					"field": "pointfive_group.untouched",
					"size" : 100000000
				}
			},
			"pointtwogroup": {
				"terms": {
					"field": "pointtwo_group.untouched",
					"size" : 100000000
				}
			},
			"centigroup": {
				"terms": {
					"field": "centi_group.untouched",
					"size" : 100000000
				}
			}
		}
	};

	var andCounter = 0;
	var orCounter = 0;

	if(conditions.scientificNames) {
		qryObj["query"]["filtered"]["query"]["bool"]["must"][andCounter] = {};
		qryObj["query"]["filtered"]["query"]["bool"]["must"][andCounter]["bool"] = {};
		qryObj["query"]["filtered"]["query"]["bool"]["must"][andCounter]["bool"]["should"] = [];
		_.each(conditions.scientificNames, function(data) {
			qryObj["query"]["filtered"]["query"]["bool"]["must"][andCounter]["bool"]["should"][orCounter] = {};
			qryObj["query"]["filtered"]["query"]["bool"]["must"][andCounter]["bool"]["should"][orCounter]["wildcard"] = {};
			qryObj["query"]["filtered"]["query"]["bool"]["must"][andCounter]["bool"]["should"][orCounter]["wildcard"]["canonical.exactWords"] = data.textObject.toLowerCase();
			orCounter+=1;
		});
		andCounter+=1;
	}
	if(conditions.taxons) {
		orCounter = 0;
		qryObj["query"]["filtered"]["query"]["bool"]["must"][andCounter] = {};
		qryObj["query"]["filtered"]["query"]["bool"]["must"][andCounter]["bool"] = {};
		qryObj["query"]["filtered"]["query"]["bool"]["must"][andCounter]["bool"]["should"] = [];
		_.each(conditions.taxons, function(data) {
			qryObj["query"]["filtered"]["query"]["bool"]["must"][andCounter]["bool"]["should"][orCounter] = {};
			qryObj["query"]["filtered"]["query"]["bool"]["must"][andCounter]["bool"]["should"][orCounter]["wildcard"] = {};
			if(data.textName == "kingdom")
				qryObj["query"]["filtered"]["query"]["bool"]["must"][andCounter]["bool"]["should"][orCounter]["wildcard"]["kingdom.exactWords"] = data.textObject.toLowerCase();
			if(data.textName == "phylum")
				qryObj["query"]["filtered"]["query"]["bool"]["must"][andCounter]["bool"]["should"][orCounter]["wildcard"]["phylum.exactWords"] = data.textObject.toLowerCase();
			if(data.textName == "class")
				qryObj["query"]["filtered"]["query"]["bool"]["must"][andCounter]["bool"]["should"][orCounter]["wildcard"]["taxonClass.exactWords"] = data.textObject.toLowerCase();
			if(data.textName == "order")
				qryObj["query"]["filtered"]["query"]["bool"]["must"][andCounter]["bool"]["should"][orCounter]["wildcard"]["order_rank.exactWords"] = data.textObject.toLowerCase();
			if(data.textName == "family")
				qryObj["query"]["filtered"]["query"]["bool"]["must"][andCounter]["bool"]["should"][orCounter]["wildcard"]["family.exactWords"] = data.textObject.toLowerCase();
			if(data.textName == "genus")
				qryObj["query"]["filtered"]["query"]["bool"]["must"][andCounter]["bool"]["should"][orCounter]["wildcard"]["genus.exactWords"] = data.textObject.toLowerCase();
			if(data.textName == "species")
				qryObj["query"]["filtered"]["query"]["bool"]["must"][andCounter]["bool"]["should"][orCounter]["wildcard"]["species.exactWords"] = data.textObject.toLowerCase();
			orCounter+=1;
		});
		andCounter+=1;
	}
	if(conditions.countries) {
		orCounter = 0;
		qryObj["query"]["filtered"]["query"]["bool"]["must"][andCounter] = {};
		qryObj["query"]["filtered"]["query"]["bool"]["must"][andCounter]["bool"] = {};
		qryObj["query"]["filtered"]["query"]["bool"]["must"][andCounter]["bool"]["should"] = [];
		_.each(conditions.countries, function(data) {
			qryObj["query"]["filtered"]["query"]["bool"]["must"][andCounter]["bool"]["should"][orCounter] = {};
			qryObj["query"]["filtered"]["query"]["bool"]["must"][andCounter]["bool"]["should"][orCounter]["wildcard"] = {};
			qryObj["query"]["filtered"]["query"]["bool"]["must"][andCounter]["bool"]["should"][orCounter]["wildcard"]["iso_country_code.exactWords"] = data.textObject.toLowerCase();
			orCounter+=1;
		});
		andCounter+=1;
	}
	if(conditions.departments) {
		orCounter = 0;
		qryObj["query"]["filtered"]["query"]["bool"]["must"][andCounter] = {};
		qryObj["query"]["filtered"]["query"]["bool"]["must"][andCounter]["bool"] = {};
		qryObj["query"]["filtered"]["query"]["bool"]["must"][andCounter]["bool"]["should"] = [];
		_.each(conditions.departments, function(data) {
			qryObj["query"]["filtered"]["query"]["bool"]["must"][andCounter]["bool"]["should"][orCounter] = {};
			qryObj["query"]["filtered"]["query"]["bool"]["must"][andCounter]["bool"]["should"][orCounter]["wildcard"] = {};
			qryObj["query"]["filtered"]["query"]["bool"]["must"][andCounter]["bool"]["should"][orCounter]["wildcard"]["iso_department_code.exactWords"] = data.textObject.toLowerCase();
			orCounter+=1;
		});
		andCounter+=1;
	}
	if(conditions.providers) {
		orCounter = 0;
		qryObj["query"]["filtered"]["query"]["bool"]["must"][andCounter] = {};
		qryObj["query"]["filtered"]["query"]["bool"]["must"][andCounter]["bool"] = {};
		qryObj["query"]["filtered"]["query"]["bool"]["must"][andCounter]["bool"]["should"] = [];
		_.each(conditions.providers, function(data) {
			qryObj["query"]["filtered"]["query"]["bool"]["must"][andCounter]["bool"]["should"][orCounter] = {};
			qryObj["query"]["filtered"]["query"]["bool"]["must"][andCounter]["bool"]["should"][orCounter]["wildcard"] = {};
			qryObj["query"]["filtered"]["query"]["bool"]["must"][andCounter]["bool"]["should"][orCounter]["wildcard"]["data_provider_name.exactWords"] = data.textObject.toLowerCase();
			orCounter+=1;
		});
		andCounter+=1;
	}
	if(conditions.resources) {
		orCounter = 0;
		qryObj["query"]["filtered"]["query"]["bool"]["must"][andCounter] = {};
		qryObj["query"]["filtered"]["query"]["bool"]["must"][andCounter]["bool"] = {};
		qryObj["query"]["filtered"]["query"]["bool"]["must"][andCounter]["bool"]["should"] = [];
		_.each(conditions.resources, function(data) {
			qryObj["query"]["filtered"]["query"]["bool"]["must"][andCounter]["bool"]["should"][orCounter] = {};
			qryObj["query"]["filtered"]["query"]["bool"]["must"][andCounter]["bool"]["should"][orCounter]["wildcard"] = {};
			qryObj["query"]["filtered"]["query"]["bool"]["must"][andCounter]["bool"]["should"][orCounter]["wildcard"]["data_resource_name.exactWords"] = data.textObject.toLowerCase();
			orCounter+=1;
		});
		andCounter+=1;
	}
	mySearchCall = elasticSearchClient.search('sibexplorer', 'occurrences', qryObj);
	return mySearchCall;
};

exports.getOccurrencesWithFilter = function(conditions) {
	var qryObj = {};
	var condition1 = {}
	  , condition2 = {};
	var logic
	  , logic2;
	var haveQuery = false;
	var countFilter = 0;
	qryObj["fields"] = ["id", "canonical", "data_resource_name", "institution_code", "collection_code", "catalogue_number", "occurrence_date", "modified", "location", "country_name", "department_name", "basis_of_record_name_spanish"];
	
	if((typeof conditions.filter != 'undefined') && (typeof conditions.filter.filters != 'undefined')) {
		qryObj["query"] = {};
		qryObj["query"]["filtered"] = {};
		qryObj["query"]["filtered"]["query"] = {};
		qryObj["query"]["filtered"]["query"]["bool"] = {};
		qryObj["query"]["filtered"]["query"]["bool"]["must"] = [];
		qryObj["query"]["filtered"]["query"]["bool"]["should"] = [];
		if(conditions.filter.logic == 'and') {
			logic = qryObj["query"]["filtered"]["query"]["bool"]["must"];
		} else if(conditions.filter.logic == 'or') {
			logic = qryObj["query"]["filtered"]["query"]["bool"]["should"];
		}
		for (var counter in conditions.filter.filters) {
			if(typeof conditions.filter.filters[counter].filters != 'undefined') {
				// Internal concatenated condition (multiple logic operators)
				logic[counter] = {};
				logic[counter]["bool"] = {};
				logic[counter]["bool"]["must"] = [];
				logic[counter]["bool"]["should"] = [];
				if(conditions.filter.filters[counter].logic == 'and') {
					logic2 = logic[counter]["bool"]["must"];
				} else if(conditions.filter.filters[counter].logic == 'or') {
					logic2 = logic[counter]["bool"]["should"];
				}
				if(conditions.filter.filters[counter].filters[0].operator == 'eq' || conditions.filter.filters[counter].filters[0].operator == 'neq') {
					if(conditions.filter.filters[counter].filters[0].field == 'occurrence_date') {
						var date = moment(conditions.filter.filters[counter].filters[0].value);
						if(typeof qryObj["query"]["filtered"]["filter"] == 'undefined') {
							qryObj["query"]["filtered"]["filter"] = {};
							qryObj["query"]["filtered"]["filter"]["bool"] = {};
							qryObj["query"]["filtered"]["filter"]["bool"]["must"] = [];
							qryObj["query"]["filtered"]["filter"]["bool"]["must_not"] = [];
							qryObj["query"]["filtered"]["filter"]["bool"]["should"] = [];
						}
						if(conditions.filter.filters[counter].filters[0].operator == 'neq') {
							qryObj["query"]["filtered"]["filter"]["bool"]["must_not"][countFilter] = {};
							qryObj["query"]["filtered"]["filter"]["bool"]["must_not"][countFilter]["numeric_range"] = {};
							qryObj["query"]["filtered"]["filter"]["bool"]["must_not"][countFilter]["numeric_range"]["occurrence_date"] = {};
							qryObj["query"]["filtered"]["filter"]["bool"]["must_not"][countFilter]["numeric_range"]["occurrence_date"]['gte'] = date.format('YYYY-MM-DD');
							qryObj["query"]["filtered"]["filter"]["bool"]["must_not"][countFilter]["numeric_range"]["occurrence_date"]['lte'] = date.format('YYYY-MM-DD');
							countFilter++;
						} else {
							qryObj["query"]["filtered"]["filter"]["bool"]["must"][countFilter] = {};
							qryObj["query"]["filtered"]["filter"]["bool"]["must"][countFilter]["numeric_range"] = {};
							qryObj["query"]["filtered"]["filter"]["bool"]["must"][countFilter]["numeric_range"]["occurrence_date"] = {};
							qryObj["query"]["filtered"]["filter"]["bool"]["must"][countFilter]["numeric_range"]["occurrence_date"]['gte'] = date.format('YYYY-MM-DD');
							qryObj["query"]["filtered"]["filter"]["bool"]["must"][countFilter]["numeric_range"]["occurrence_date"]['lte'] = date.format('YYYY-MM-DD');
							countFilter++;
						}
					} else {
						haveQuery = true;
						if(conditions.filter.filters[counter].filters[0].operator == 'neq') {
							logic2[0] = {};
							logic2[0]["bool"] = {};
							logic2[0]["bool"]["must_not"] = {};
							logic2[0]["bool"]["must_not"]["term"] = {};
							if(conditions.filter.filters[counter].filters[0].field == 'id') {
								logic2[0]["bool"]["must_not"]["term"][conditions.filter.filters[counter].filters[0].field] = conditions.filter.filters[counter].filters[0].value.toLowerCase();
							} else {
								logic2[0]["bool"]["must_not"]["term"][conditions.filter.filters[counter].filters[0].field+".exactWords"] = conditions.filter.filters[counter].filters[0].value.toLowerCase();
							}
						} else {
							logic2[0] = {};
							logic2[0]["term"] = {};
							if(conditions.filter.filters[counter].filters[0].field == 'id') {
								logic2[0]["term"][conditions.filter.filters[counter].filters[0].field] = conditions.filter.filters[counter].filters[0].value.toLowerCase();
							} else {
								logic2[0]["term"][conditions.filter.filters[counter].filters[0].field+".exactWords"] = conditions.filter.filters[counter].filters[0].value.toLowerCase();
							}
						}
					}
				} else if(conditions.filter.filters[counter].filters[0].operator == 'contains' || conditions.filter.filters[counter].filters[0].operator == 'doesnotcontain') {
					haveQuery = true;
					if(conditions.filter.filters[counter].filters[0].operator == 'doesnotcontain') {
						logic2[0] = {};
						logic2[0]["bool"] = {};
						logic2[0]["bool"]["must_not"] = {};
						logic2[0]["bool"]["must_not"]["wildcard"] = {};
						logic2[0]["bool"]["must_not"]["wildcard"][conditions.filter.filters[counter].filters[0].field+".exactWords"] = "*"+conditions.filter.filters[counter].filters[0].value.toLowerCase()+"*";
					} else {
						logic2[0] = {};
						logic2[0]["wildcard"] = {};
						logic2[0]["wildcard"][conditions.filter.filters[counter].filters[0].field+".exactWords"] = "*"+conditions.filter.filters[counter].filters[0].value.toLowerCase()+"*";
					}
				} else if(conditions.filter.filters[counter].filters[0].operator == 'startswith') {
					haveQuery = true;
					logic2[counter] = {};
					logic2[counter]["wildcard"] = {};
					logic2[counter]["wildcard"][conditions.filter.filters[counter].filters[0].field+".exactWords"] = conditions.filter.filters[counter].filters[0].value.toLowerCase()+"*";
				} else if(conditions.filter.filters[counter].filters[0].operator == 'endswith') {
					haveQuery = true;
					logic2[counter] = {};
					logic2[counter]["wildcard"] = {};
					logic2[counter]["wildcard"][conditions.filter.filters[counter].filters[0].field+".exactWords"] = "*"+conditions.filter.filters[counter].filters[0].value.toLowerCase();
				} else if(conditions.filter.filters[counter].filters[0].operator == 'gt' || conditions.filter.filters[counter].filters[0].operator == 'gte' || conditions.filter.filters[counter].filters[0].operator == 'lt' || conditions.filter.filters[counter].filters[0].operator == 'lte') {
					var date = moment(conditions.filter.filters[counter].filters[0].value);
					if(typeof qryObj["query"]["filtered"]["filter"] == 'undefined') {
						qryObj["query"]["filtered"]["filter"] = {};
						qryObj["query"]["filtered"]["filter"]["bool"] = {};
						qryObj["query"]["filtered"]["filter"]["bool"]["must"] = [];
						qryObj["query"]["filtered"]["filter"]["bool"]["must_not"] = [];
						qryObj["query"]["filtered"]["filter"]["bool"]["should"] = [];
					}
					if(conditions.filter.filters[counter].logic == 'and') {
						qryObj["query"]["filtered"]["filter"]["bool"]["must"][countFilter] = {};
						qryObj["query"]["filtered"]["filter"]["bool"]["must"][countFilter]["numeric_range"] = {};
						qryObj["query"]["filtered"]["filter"]["bool"]["must"][countFilter]["numeric_range"]["occurrence_date"] = {};
						qryObj["query"]["filtered"]["filter"]["bool"]["must"][countFilter]["numeric_range"]["occurrence_date"][conditions.filter.filters[counter].filters[0].operator] = date.format('YYYY-MM-DD');
					} else if(conditions.filter.filters[counter].logic == 'or') {
						qryObj["query"]["filtered"]["filter"]["bool"]["should"][countFilter] = {};
						qryObj["query"]["filtered"]["filter"]["bool"]["should"][countFilter]["numeric_range"] = {};
						qryObj["query"]["filtered"]["filter"]["bool"]["should"][countFilter]["numeric_range"]["occurrence_date"] = {};
						qryObj["query"]["filtered"]["filter"]["bool"]["should"][countFilter]["numeric_range"]["occurrence_date"][conditions.filter.filters[counter].filters[0].operator] = date.format('YYYY-MM-DD');
					}
					countFilter++;
				}
				if(conditions.filter.filters[counter].filters[1].operator == 'eq' || conditions.filter.filters[counter].filters[1].operator == 'neq') {
					if(conditions.filter.filters[counter].filters[1].field == 'occurrence_date') {
						var date = moment(conditions.filter.filters[counter].filters[1].value);
						if(typeof qryObj["query"]["filtered"]["filter"] == 'undefined') {
							qryObj["query"]["filtered"]["filter"] = {};
							qryObj["query"]["filtered"]["filter"]["bool"] = {};
							qryObj["query"]["filtered"]["filter"]["bool"]["must"] = [];
							qryObj["query"]["filtered"]["filter"]["bool"]["must_not"] = [];
							qryObj["query"]["filtered"]["filter"]["bool"]["should"] = [];
						}
						if(conditions.filter.filters[counter].filters[1].operator == 'neq') {
							qryObj["query"]["filtered"]["filter"]["bool"]["must_not"][countFilter] = {};
							qryObj["query"]["filtered"]["filter"]["bool"]["must_not"][countFilter]["numeric_range"] = {};
							qryObj["query"]["filtered"]["filter"]["bool"]["must_not"][countFilter]["numeric_range"]["occurrence_date"] = {};
							qryObj["query"]["filtered"]["filter"]["bool"]["must_not"][countFilter]["numeric_range"]["occurrence_date"]['gte'] = date.format('YYYY-MM-DD');
							qryObj["query"]["filtered"]["filter"]["bool"]["must_not"][countFilter]["numeric_range"]["occurrence_date"]['lte'] = date.format('YYYY-MM-DD');
							countFilter++;
						} else {
							qryObj["query"]["filtered"]["filter"]["bool"]["must"][countFilter] = {};
							qryObj["query"]["filtered"]["filter"]["bool"]["must"][countFilter]["numeric_range"] = {};
							qryObj["query"]["filtered"]["filter"]["bool"]["must"][countFilter]["numeric_range"]["occurrence_date"] = {};
							qryObj["query"]["filtered"]["filter"]["bool"]["must"][countFilter]["numeric_range"]["occurrence_date"]['gte'] = date.format('YYYY-MM-DD');
							qryObj["query"]["filtered"]["filter"]["bool"]["must"][countFilter]["numeric_range"]["occurrence_date"]['lte'] = date.format('YYYY-MM-DD');
							countFilter++;
						}
					} else {
						haveQuery = true;
						if(conditions.filter.filters[counter].filters[1].operator == 'neq') {
							logic2[1] = {};
							logic2[1]["bool"] = {};
							logic2[1]["bool"]["must_not"] = {};
							logic2[1]["bool"]["must_not"]["term"] = {};
							if(conditions.filter.filters[counter].filters[1].field == 'id') {
								logic2[1]["bool"]["must_not"]["term"][conditions.filter.filters[counter].filters[1].field] = conditions.filter.filters[counter].filters[1].value.toLowerCase();
							} else {
								logic2[1]["bool"]["must_not"]["term"][conditions.filter.filters[counter].filters[1].field+".exactWords"] = conditions.filter.filters[counter].filters[1].value.toLowerCase();
							}
						} else {
							logic2[1] = {};
							logic2[1]["term"] = {};
							if(conditions.filter.filters[counter].filters[1].field == 'id') {
								logic2[1]["term"][conditions.filter.filters[counter].filters[1].field] = conditions.filter.filters[counter].filters[1].value.toLowerCase();
							} else {
								logic2[1]["term"][conditions.filter.filters[counter].filters[1].field+".exactWords"] = conditions.filter.filters[counter].filters[1].value.toLowerCase();
							}
						}
					}
				} else if(conditions.filter.filters[counter].filters[1].operator == 'contains' || conditions.filter.filters[counter].filters[1].operator == 'doesnotcontain') {
					haveQuery = true;
					if(conditions.filter.filters[counter].filters[1].operator == 'doesnotcontain') {
						logic2[1] = {};
						logic2[1]["bool"] = {};
						logic2[1]["bool"]["must_not"] = {};
						logic2[1]["bool"]["must_not"]["wildcard"] = {};
						logic2[1]["bool"]["must_not"]["wildcard"][conditions.filter.filters[counter].filters[1].field+".exactWords"] = "*"+conditions.filter.filters[counter].filters[1].value.toLowerCase()+"*";
					} else {
						logic2[1] = {};
						logic2[1]["wildcard"] = {};
						logic2[1]["wildcard"][conditions.filter.filters[counter].filters[1].field+".exactWords"] = "*"+conditions.filter.filters[counter].filters[1].value.toLowerCase()+"*";
					}
				} else if(conditions.filter.filters[counter].filters[1].operator == 'startswith') {
					haveQuery = true;
					logic2[counter] = {};
					logic2[counter]["wildcard"] = {};
					logic2[counter]["wildcard"][conditions.filter.filters[counter].filters[1].field+".exactWords"] = conditions.filter.filters[counter].filters[1].value.toLowerCase()+"*";
				} else if(conditions.filter.filters[counter].filters[1].operator == 'endswith') {
					haveQuery = true;
					logic2[counter] = {};
					logic2[counter]["wildcard"] = {};
					logic2[counter]["wildcard"][conditions.filter.filters[counter].filters[1].field+".exactWords"] = "*"+conditions.filter.filters[counter].filters[1].value.toLowerCase();
				} else if(conditions.filter.filters[counter].filters[1].operator == 'gt' || conditions.filter.filters[counter].filters[1].operator == 'gte' || conditions.filter.filters[counter].filters[1].operator == 'lt' || conditions.filter.filters[counter].filters[1].operator == 'lte') {
					var date = moment(conditions.filter.filters[counter].filters[1].value);
					if(typeof qryObj["query"]["filtered"]["filter"] == 'undefined') {
						qryObj["query"]["filtered"]["filter"] = {};
						qryObj["query"]["filtered"]["filter"]["bool"] = {};
						qryObj["query"]["filtered"]["filter"]["bool"]["must"] = [];
						qryObj["query"]["filtered"]["filter"]["bool"]["must_not"] = [];
						qryObj["query"]["filtered"]["filter"]["bool"]["should"] = [];
					}
					if(conditions.filter.filters[counter].logic == 'and') {
						qryObj["query"]["filtered"]["filter"]["bool"]["must"][countFilter] = {};
						qryObj["query"]["filtered"]["filter"]["bool"]["must"][countFilter]["numeric_range"] = {};
						qryObj["query"]["filtered"]["filter"]["bool"]["must"][countFilter]["numeric_range"]["occurrence_date"] = {};
						qryObj["query"]["filtered"]["filter"]["bool"]["must"][countFilter]["numeric_range"]["occurrence_date"][conditions.filter.filters[counter].filters[1].operator] = date.format('YYYY-MM-DD');
					} else if(conditions.filter.filters[counter].logic == 'or') {
						qryObj["query"]["filtered"]["filter"]["bool"]["should"][countFilter] = {};
						qryObj["query"]["filtered"]["filter"]["bool"]["should"][countFilter]["numeric_range"] = {};
						qryObj["query"]["filtered"]["filter"]["bool"]["should"][countFilter]["numeric_range"]["occurrence_date"] = {};
						qryObj["query"]["filtered"]["filter"]["bool"]["should"][countFilter]["numeric_range"]["occurrence_date"][conditions.filter.filters[counter].filters[1].operator] = date.format('YYYY-MM-DD');
					}
					countFilter++;
				}
				//console.log("Must interno");
				//console.log(logic[counter]["bool"]["must"]);
				//console.log("Should interno");
				//console.log(logic[counter]["bool"]["should"]);
			} else {
				// External condition of single logic operator
				//console.log(conditions.filter.filters[counter].operator);
				
				if(conditions.filter.filters[counter].operator == 'eq' || conditions.filter.filters[counter].operator == 'neq') {
					if(conditions.filter.filters[counter].field == 'occurrence_date') {
						var date = moment(conditions.filter.filters[counter].value);
						if(typeof qryObj["query"]["filtered"]["filter"] == 'undefined') {
							qryObj["query"]["filtered"]["filter"] = {};
							qryObj["query"]["filtered"]["filter"]["bool"] = {};
							qryObj["query"]["filtered"]["filter"]["bool"]["must"] = [];
							qryObj["query"]["filtered"]["filter"]["bool"]["must_not"] = [];
							qryObj["query"]["filtered"]["filter"]["bool"]["should"] = [];
						}
						if(conditions.filter.filters[counter].operator == 'neq') {
							qryObj["query"]["filtered"]["filter"]["bool"]["must_not"][countFilter] = {};
							qryObj["query"]["filtered"]["filter"]["bool"]["must_not"][countFilter]["numeric_range"] = {};
							qryObj["query"]["filtered"]["filter"]["bool"]["must_not"][countFilter]["numeric_range"]["occurrence_date"] = {};
							qryObj["query"]["filtered"]["filter"]["bool"]["must_not"][countFilter]["numeric_range"]["occurrence_date"]['gte'] = date.format('YYYY-MM-DD');
							qryObj["query"]["filtered"]["filter"]["bool"]["must_not"][countFilter]["numeric_range"]["occurrence_date"]['lte'] = date.format('YYYY-MM-DD');
							countFilter++;
						} else {
							qryObj["query"]["filtered"]["filter"]["bool"]["must"][countFilter] = {};
							qryObj["query"]["filtered"]["filter"]["bool"]["must"][countFilter]["numeric_range"] = {};
							qryObj["query"]["filtered"]["filter"]["bool"]["must"][countFilter]["numeric_range"]["occurrence_date"] = {};
							qryObj["query"]["filtered"]["filter"]["bool"]["must"][countFilter]["numeric_range"]["occurrence_date"]['gte'] = date.format('YYYY-MM-DD');
							qryObj["query"]["filtered"]["filter"]["bool"]["must"][countFilter]["numeric_range"]["occurrence_date"]['lte'] = date.format('YYYY-MM-DD');
							countFilter++;
						}
					} else {
						haveQuery = true;
						logic[counter] = {};
						if(conditions.filter.filters[counter].operator == 'neq') {
							logic[counter]["bool"] = {};
							logic[counter]["bool"]["must_not"] = {};
							logic[counter]["bool"]["must_not"]["term"] = {};
							if(conditions.filter.filters[counter].field == 'id') {
								logic[counter]["bool"]["must_not"]["term"][conditions.filter.filters[counter].field] = conditions.filter.filters[counter].value.toLowerCase();
							} else {
								logic[counter]["bool"]["must_not"]["term"][conditions.filter.filters[counter].field+".exactWords"] = conditions.filter.filters[counter].value.toLowerCase();
							}
						} else {
							logic[counter]["term"] = {};
							if(conditions.filter.filters[counter].field == 'id') {
								logic[counter]["term"][conditions.filter.filters[counter].field] = conditions.filter.filters[counter].value.toLowerCase();
							} else {
								logic[counter]["term"][conditions.filter.filters[counter].field+".exactWords"] = conditions.filter.filters[counter].value.toLowerCase();
							}
						}
					}
				} else if(conditions.filter.filters[counter].operator == 'contains' || conditions.filter.filters[counter].operator == 'doesnotcontain') {
					haveQuery = true;
					logic[counter] = {};
					if(conditions.filter.filters[counter].operator == 'doesnotcontain') {
						logic[counter]["bool"] = {};
						logic[counter]["bool"]["must_not"] = {};
						logic[counter]["bool"]["must_not"]["wildcard"] = {};
						logic[counter]["bool"]["must_not"]["wildcard"][conditions.filter.filters[counter].field+".exactWords"] = "*"+conditions.filter.filters[counter].value.toLowerCase()+"*";
					} else {
						logic[counter]["wildcard"] = {};
						logic[counter]["wildcard"][conditions.filter.filters[counter].field+".exactWords"] = "*"+conditions.filter.filters[counter].value.toLowerCase()+"*";
					}
				} else if(conditions.filter.filters[counter].operator == 'startswith') {
					haveQuery = true;
					logic[counter] = {};
					logic[counter]["wildcard"] = {};
					logic[counter]["wildcard"][conditions.filter.filters[counter].field+".exactWords"] = conditions.filter.filters[counter].value.toLowerCase()+"*";
				} else if(conditions.filter.filters[counter].operator == 'endswith') {
					haveQuery = true;
					logic[counter] = {};
					logic[counter]["wildcard"] = {};
					logic[counter]["wildcard"][conditions.filter.filters[counter].field+".exactWords"] = "*"+conditions.filter.filters[counter].value.toLowerCase();
				} else if(conditions.filter.filters[counter].operator == 'gt' || conditions.filter.filters[counter].operator == 'gte' || conditions.filter.filters[counter].operator == 'lt' || conditions.filter.filters[counter].operator == 'lte') {
					var date = moment(conditions.filter.filters[counter].value);
					if(typeof qryObj["query"]["filtered"]["filter"] == 'undefined') {
						qryObj["query"]["filtered"]["filter"] = {};
						qryObj["query"]["filtered"]["filter"]["bool"] = {};
						qryObj["query"]["filtered"]["filter"]["bool"]["must"] = [];
						qryObj["query"]["filtered"]["filter"]["bool"]["must_not"] = [];
						qryObj["query"]["filtered"]["filter"]["bool"]["should"] = [];
					}
					if(conditions.filter.logic == 'and') {
						qryObj["query"]["filtered"]["filter"]["bool"]["must"][countFilter] = {};
						qryObj["query"]["filtered"]["filter"]["bool"]["must"][countFilter]["numeric_range"] = {};
						qryObj["query"]["filtered"]["filter"]["bool"]["must"][countFilter]["numeric_range"]["occurrence_date"] = {};
						qryObj["query"]["filtered"]["filter"]["bool"]["must"][countFilter]["numeric_range"]["occurrence_date"][conditions.filter.filters[counter].operator] = date.format('YYYY-MM-DD');
					} else if(conditions.filter.logic == 'or') {
						qryObj["query"]["filtered"]["filter"]["bool"]["should"][countFilter] = {};
						qryObj["query"]["filtered"]["filter"]["bool"]["should"][countFilter]["numeric_range"] = {};
						qryObj["query"]["filtered"]["filter"]["bool"]["should"][countFilter]["numeric_range"]["occurrence_date"] = {};
						qryObj["query"]["filtered"]["filter"]["bool"]["should"][countFilter]["numeric_range"]["occurrence_date"][conditions.filter.filters[counter].operator] = date.format('YYYY-MM-DD');
					}
					countFilter++;
				}
			}
		}
		//console.log("Must");
		//console.log(qryObj["query"]["filtered"]["query"]["bool"]["must"]);
		//console.log("Should");
		//console.log(qryObj["query"]["filtered"]["query"]["bool"]["should"]);
		if(haveQuery === false) {
			qryObj["query"]["filtered"]["query"]["bool"]["must"][0] = {};
			qryObj["query"]["filtered"]["query"]["bool"]["must"][0]["match_all"] = {};
		}
	}
	/*qryObj["query"] = {
		"constant_score": {
			"filter": {
				"match_all": { }
			}
		}
	};*/
	qryObj["from"] = (conditions.page-1)*conditions.pageSize;
	qryObj["size"] = conditions.pageSize;

	// Sorting
	if(typeof conditions.sort != 'undefined') {
		for (var i in conditions.sort) {
			qryObj["sort"] = [];
			qryObj["sort"][i] = {};
			if(conditions.sort[i].field == "id" || conditions.sort[i].field == "occurrence_date") {
				if(conditions.sort[i].field == "id") {
					qryObj["sort"][i]["id"] = conditions.sort[i].dir;
				} else {
					qryObj["sort"][i][conditions.sort[i].field] = conditions.sort[i].dir;
				}
			} else {
				qryObj["sort"][i][conditions.sort[i].field+".untouched"] = conditions.sort[i].dir;
			}
		}
	} else {
		qryObj["sort"] = [ { "canonical.untouched": "asc" } ];
	}

	//console.log(qryObj);
	mySearchCall = elasticSearchClient.search('sibexplorer', 'occurrences', qryObj);
	return mySearchCall;
};

exports.geoJsonMapPoints = function(parameters) {
	var qryObj = {
		"fields": ["id", "canonical", "location"],
		"sort": [ { "canonical.untouched": "asc" } ],
		"from": 0,
		"size" : 1000,
		"query": {
			"filtered": {
				"filter": [
					{
						"exists" : {
							"field": "cell_id"
						}
					}
				],
				"query" : {
					"bool": {
						"must": []
					}
				}
			}
		}
	};
	qryObj["from"] = parameters.startindex || 0;
	if(parameters.maxresults) {
		if(parameters.maxresults > 1000) {
			qryObj["size"] = 1000;
		} else {
			qryObj["size"] = parameters.maxresults;
		}
	} else {
		qryObj["size"] = parameters.maxresults || 1000;
	}

	var andCounter = 0;
	var currentFilter = 1;

	if(parameters.originisocountrycode) {
		qryObj["query"]["filtered"]["query"]["bool"]["must"][andCounter] = {};
		qryObj["query"]["filtered"]["query"]["bool"]["must"][andCounter]["wildcard"] = {};
		qryObj["query"]["filtered"]["query"]["bool"]["must"][andCounter]["wildcard"]["iso_country_code.exactWords"] = parameters.originisocountrycode.toLowerCase();
		andCounter+=1;
	}

	if(parameters.scientificname) {
		qryObj["query"]["filtered"]["query"]["bool"]["must"][andCounter] = {};
		qryObj["query"]["filtered"]["query"]["bool"]["must"][andCounter]["wildcard"] = {};
		qryObj["query"]["filtered"]["query"]["bool"]["must"][andCounter]["wildcard"]["canonical.exactWords"] = parameters.scientificname.toLowerCase();
		andCounter+=1;
	}

	if(parameters.dataproviderkey) {
		qryObj["query"]["filtered"]["query"]["bool"]["must"][andCounter] = {};
		qryObj["query"]["filtered"]["query"]["bool"]["must"][andCounter]["term"] = {};
		qryObj["query"]["filtered"]["query"]["bool"]["must"][andCounter]["term"]["data_provider_id"] = parameters.dataproviderkey.toLowerCase();
		andCounter+=1;
	}

	if(parameters.datasourcekey) {
		qryObj["query"]["filtered"]["query"]["bool"]["must"][andCounter] = {};
		qryObj["query"]["filtered"]["query"]["bool"]["must"][andCounter]["term"] = {};
		qryObj["query"]["filtered"]["query"]["bool"]["must"][andCounter]["term"]["data_resource_id"] = parameters.datasourcekey.toLowerCase();
		andCounter+=1;
	}

	if(parameters.institutioncode) {
		qryObj["query"]["filtered"]["query"]["bool"]["must"][andCounter] = {};
		qryObj["query"]["filtered"]["query"]["bool"]["must"][andCounter]["wildcard"] = {};
		qryObj["query"]["filtered"]["query"]["bool"]["must"][andCounter]["wildcard"]["institution_code.exactWords"] = parameters.institutioncode.toLowerCase();
		andCounter+=1;
	}

	if(parameters.catalognumber) {
		qryObj["query"]["filtered"]["query"]["bool"]["must"][andCounter] = {};
		qryObj["query"]["filtered"]["query"]["bool"]["must"][andCounter]["wildcard"] = {};
		qryObj["query"]["filtered"]["query"]["bool"]["must"][andCounter]["wildcard"]["catalogue_number.exactWords"] = parameters.catalognumber.toLowerCase();
		andCounter+=1;
	}

	if(parameters.originisodepartmentcode) {
		qryObj["query"]["filtered"]["query"]["bool"]["must"][andCounter] = {};
		qryObj["query"]["filtered"]["query"]["bool"]["must"][andCounter]["wildcard"] = {};
		qryObj["query"]["filtered"]["query"]["bool"]["must"][andCounter]["wildcard"]["iso_department_code.exactWords"] = parameters.originisodepartmentcode.toLowerCase();
		andCounter+=1;
	}

	if(parameters.taxonconceptkey) {
		qryObj["query"]["filtered"]["query"]["bool"]["must"][andCounter] = {};
		qryObj["query"]["filtered"]["query"]["bool"]["must"][andCounter]["bool"] = {};
		qryObj["query"]["filtered"]["query"]["bool"]["must"][andCounter]["bool"]["should"] = [];
		qryObj["query"]["filtered"]["query"]["bool"]["must"][andCounter]["bool"]["should"][0] = {};
		qryObj["query"]["filtered"]["query"]["bool"]["must"][andCounter]["bool"]["should"][0]["term"] = {};
		qryObj["query"]["filtered"]["query"]["bool"]["must"][andCounter]["bool"]["should"][0]["term"]["kingdom_concept_id"] = parameters.taxonconceptkey.toLowerCase();
		qryObj["query"]["filtered"]["query"]["bool"]["must"][andCounter]["bool"]["should"][1] = {};
		qryObj["query"]["filtered"]["query"]["bool"]["must"][andCounter]["bool"]["should"][1]["term"] = {};
		qryObj["query"]["filtered"]["query"]["bool"]["must"][andCounter]["bool"]["should"][1]["term"]["phylum_concept_id"] = parameters.taxonconceptkey.toLowerCase();
		qryObj["query"]["filtered"]["query"]["bool"]["must"][andCounter]["bool"]["should"][2] = {};
		qryObj["query"]["filtered"]["query"]["bool"]["must"][andCounter]["bool"]["should"][2]["term"] = {};
		qryObj["query"]["filtered"]["query"]["bool"]["must"][andCounter]["bool"]["should"][2]["term"]["class_concept_id"] = parameters.taxonconceptkey.toLowerCase();
		qryObj["query"]["filtered"]["query"]["bool"]["must"][andCounter]["bool"]["should"][3] = {};
		qryObj["query"]["filtered"]["query"]["bool"]["must"][andCounter]["bool"]["should"][3]["term"] = {};
		qryObj["query"]["filtered"]["query"]["bool"]["must"][andCounter]["bool"]["should"][3]["term"]["order_concept_id"] = parameters.taxonconceptkey.toLowerCase();
		qryObj["query"]["filtered"]["query"]["bool"]["must"][andCounter]["bool"]["should"][4] = {};
		qryObj["query"]["filtered"]["query"]["bool"]["must"][andCounter]["bool"]["should"][4]["term"] = {};
		qryObj["query"]["filtered"]["query"]["bool"]["must"][andCounter]["bool"]["should"][4]["term"]["family_concept_id"] = parameters.taxonconceptkey.toLowerCase();
		qryObj["query"]["filtered"]["query"]["bool"]["must"][andCounter]["bool"]["should"][5] = {};
		qryObj["query"]["filtered"]["query"]["bool"]["must"][andCounter]["bool"]["should"][5]["term"] = {};
		qryObj["query"]["filtered"]["query"]["bool"]["must"][andCounter]["bool"]["should"][5]["term"]["genus_concept_id"] = parameters.taxonconceptkey.toLowerCase();
		qryObj["query"]["filtered"]["query"]["bool"]["must"][andCounter]["bool"]["should"][6] = {};
		qryObj["query"]["filtered"]["query"]["bool"]["must"][andCounter]["bool"]["should"][6]["term"] = {};
		qryObj["query"]["filtered"]["query"]["bool"]["must"][andCounter]["bool"]["should"][6]["term"]["species_concept_id"] = parameters.taxonconceptkey.toLowerCase();
		andCounter+=1;
	}

	if(parameters.cellid) {
		qryObj["query"]["filtered"]["query"]["bool"]["must"][andCounter] = {};
		qryObj["query"]["filtered"]["query"]["bool"]["must"][andCounter]["term"] = {};
		qryObj["query"]["filtered"]["query"]["bool"]["must"][andCounter]["term"]["cell_id"] = parameters.cellid.toLowerCase();
		andCounter+=1;
	}

	if(parameters.centicellid) {
		qryObj["query"]["filtered"]["query"]["bool"]["must"][andCounter] = {};
		qryObj["query"]["filtered"]["query"]["bool"]["must"][andCounter]["term"] = {};
		qryObj["query"]["filtered"]["query"]["bool"]["must"][andCounter]["term"]["centi_cell_id"] = parameters.centicellid.toLowerCase();
		andCounter+=1;
	}

	if(parameters.pointfivecellid) {
		qryObj["query"]["filtered"]["query"]["bool"]["must"][andCounter] = {};
		qryObj["query"]["filtered"]["query"]["bool"]["must"][andCounter]["term"] = {};
		qryObj["query"]["filtered"]["query"]["bool"]["must"][andCounter]["term"]["pointfive_cell_id"] = parameters.pointfivecellid.toLowerCase();
		andCounter+=1;
	}

	if(parameters.pointtwocellid) {
		qryObj["query"]["filtered"]["query"]["bool"]["must"][andCounter] = {};
		qryObj["query"]["filtered"]["query"]["bool"]["must"][andCounter]["term"] = {};
		qryObj["query"]["filtered"]["query"]["bool"]["must"][andCounter]["term"]["pointtwo_cell_id"] = parameters.pointtwocellid.toLowerCase();
		andCounter+=1;
	}

	if(parameters.minlatitude || parameters.maxlatitude || parameters.minlongitude || parameters.maxlongitude) {
		qryObj["query"]["filtered"]["filter"][currentFilter] = {};
		qryObj["query"]["filtered"]["filter"][currentFilter]["geo_bounding_box"] = {};
		qryObj["query"]["filtered"]["filter"][currentFilter]["geo_bounding_box"]["location"] = {};
		qryObj["query"]["filtered"]["filter"][currentFilter]["geo_bounding_box"]["location"]["top_left"] = {};
		if(parameters.maxlatitude) {
			qryObj["query"]["filtered"]["filter"][currentFilter]["geo_bounding_box"]["location"]["top_left"]["lat"] = parameters.maxlatitude;
		} else {
			qryObj["query"]["filtered"]["filter"][currentFilter]["geo_bounding_box"]["location"]["top_left"]["lat"] = 90;
		}
		if(parameters.minlongitude) {
			qryObj["query"]["filtered"]["filter"][currentFilter]["geo_bounding_box"]["location"]["top_left"]["lon"] = parameters.minlongitude;
		} else {
			qryObj["query"]["filtered"]["filter"][currentFilter]["geo_bounding_box"]["location"]["top_left"]["lon"] = -180;
		}
		qryObj["query"]["filtered"]["filter"][currentFilter]["geo_bounding_box"]["location"]["bottom_right"] = {};
		if(parameters.minlatitude) {
			qryObj["query"]["filtered"]["filter"][currentFilter]["geo_bounding_box"]["location"]["bottom_right"]["lat"] = parameters.minlatitude;
		} else {
			qryObj["query"]["filtered"]["filter"][currentFilter]["geo_bounding_box"]["location"]["bottom_right"]["lat"] = -90;
		}
		if(parameters.maxlongitude) {
			qryObj["query"]["filtered"]["filter"][currentFilter]["geo_bounding_box"]["location"]["bottom_right"]["lon"] = parameters.maxlongitude;
		} else {
			qryObj["query"]["filtered"]["filter"][currentFilter]["geo_bounding_box"]["location"]["bottom_right"]["lon"] = 179.999;
		}
		currentFilter+=1;
		andCounter+=1;
	}

	if(parameters.mindepth || parameters.maxdepth) {
		qryObj["query"]["filtered"]["filter"][currentFilter] = {};
		qryObj["query"]["filtered"]["filter"][currentFilter]["numeric_range"] = {};
		qryObj["query"]["filtered"]["filter"][currentFilter]["numeric_range"]["altitude_metres"] = {};
		if(parameters.mindepth)
			qryObj["query"]["filtered"]["filter"][currentFilter]["numeric_range"]["altitude_metres"]["gte"] = parameters.mindepth;
		if(parameters.maxdepth)
			qryObj["query"]["filtered"]["filter"][currentFilter]["numeric_range"]["altitude_metres"]["lte"] = parameters.maxdepth;
		currentFilter+=1;
		andCounter+=1;
	}

	if(parameters.startdate || parameters.enddate) {
		qryObj["query"]["filtered"]["filter"][currentFilter] = {};
		qryObj["query"]["filtered"]["filter"][currentFilter]["numeric_range"] = {};
		qryObj["query"]["filtered"]["filter"][currentFilter]["numeric_range"]["created"] = {};
		if(parameters.startdate)
			qryObj["query"]["filtered"]["filter"][currentFilter]["numeric_range"]["created"]["gte"] = parameters.startdate + " 00:00:00";
		if(parameters.enddate)
			qryObj["query"]["filtered"]["filter"][currentFilter]["numeric_range"]["created"]["lte"] = parameters.enddate + " 00:00:00";
		currentFilter+=1;
		andCounter+=1;
	}

	if(parameters.startyear || parameters.endyear) {
		qryObj["query"]["filtered"]["filter"][currentFilter] = {};
		qryObj["query"]["filtered"]["filter"][currentFilter]["numeric_range"] = {};
		qryObj["query"]["filtered"]["filter"][currentFilter]["numeric_range"]["created"] = {};
		if(parameters.startyear)
			qryObj["query"]["filtered"]["filter"][currentFilter]["numeric_range"]["created"]["gte"] = parameters.startyear + "-01-01 00:00:00";
		if(parameters.endyear)
			qryObj["query"]["filtered"]["filter"][currentFilter]["numeric_range"]["created"]["lte"] = parameters.endyear + "-12-31 00:00:00";
		currentFilter+=1;
		andCounter+=1;
	}

	if(parameters.year) {
		qryObj["query"]["filtered"]["filter"][currentFilter] = {};
		qryObj["query"]["filtered"]["filter"][currentFilter]["numeric_range"] = {};
		qryObj["query"]["filtered"]["filter"][currentFilter]["numeric_range"]["created"] = {};
		qryObj["query"]["filtered"]["filter"][currentFilter]["numeric_range"]["created"]["gte"] = parameters.year + "-01-01 00:00:00";
		qryObj["query"]["filtered"]["filter"][currentFilter]["numeric_range"]["created"]["lte"] = parameters.year + "-12-31 00:00:00";
		currentFilter+=1;
		andCounter+=1;
	}

	if(parameters.modifiedsince) {
		qryObj["query"]["filtered"]["filter"][currentFilter] = {};
		qryObj["query"]["filtered"]["filter"][currentFilter]["numeric_range"] = {};
		qryObj["query"]["filtered"]["filter"][currentFilter]["numeric_range"]["modified"] = {};
		qryObj["query"]["filtered"]["filter"][currentFilter]["numeric_range"]["modified"]["gte"] = parameters.modifiedsince + " 00:00:00";
		currentFilter+=1;
		andCounter+=1;
	}

	mySearchCall = elasticSearchClient.search('sibexplorer', 'occurrences', qryObj);
	return mySearchCall;
};