var moment = require('moment');

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

// Returns cell stats for one degree
exports.getStatsOccurrencesOneDegree = function(cellid) {
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
					"field": "kingdom.untouched",
					"size" : 10
				}
			},
			"phylum": {
				"terms": {
					"field": "phylum.untouched",
					"size" : 10
				}
			},
			"taxonClass": {
				"terms": {
					"field": "taxonClass.untouched",
					"size" : 10
				}
			},
			"order_rank": {
				"terms": {
					"field": "order_rank.untouched",
					"size" : 10
				}
			},
			"family": {
				"terms": {
					"field": "family.untouched",
					"size" : 10
				}
			},
			"genus": {
				"terms": {
					"field": "genus.untouched",
					"size" : 10
				}
			},
			"data_provider_name": {
				"terms": {
					"field": "data_provider_name.untouched",
					"size" : 10
				}
			},
			"data_resource_name": {
				"terms": {
					"field": "data_resource_name.untouched",
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
				console.log("Must interno");
				console.log(logic[counter]["bool"]["must"]);
				console.log("Should interno");
				console.log(logic[counter]["bool"]["should"]);
			} else {
				// External condition of single logic operator
				console.log(conditions.filter.filters[counter].operator);
				
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
		console.log("Must");
		console.log(qryObj["query"]["filtered"]["query"]["bool"]["must"]);
		console.log("Should");
		console.log(qryObj["query"]["filtered"]["query"]["bool"]["should"]);
		if(haveQuery == false) {
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

	console.log(qryObj);
	mySearchCall = elasticSearchClient.search('sibexplorer', 'occurrences', qryObj);
	return mySearchCall;	
};