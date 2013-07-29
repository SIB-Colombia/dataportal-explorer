exports.getOccurrences = function() {
	qryObj = {
		"fields": ["id", "canonical", "data_resource_name", "institution_code", "collection_code", "catalogue_number", "created", "modified", "location", "country_name", "department_name"],
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

exports.getOccurrencesWithFilter = function(conditions) {
	var qryObj = {};
	var condition1 = {}
	  , condition2 = {};
	var logic
	  , logic2;
	qryObj["fields"] = ["id", "canonical", "data_resource_name", "institution_code", "collection_code", "catalogue_number", "created", "modified", "location", "country_name", "department_name"];
	
	if(typeof conditions.filter != 'undefined' && typeof conditions.filter.filters != 'undefined') {
		qryObj["query"] = {};
		qryObj["query"]["bool"] = {};
		qryObj["query"]["bool"]["must"] = [];
		qryObj["query"]["bool"]["should"] = [];
		if(conditions.filter.logic == 'and') {
			logic = qryObj["query"]["bool"]["must"];
		} else if(conditions.filter.logic == 'or') {
			logic = qryObj["query"]["bool"]["should"];
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
					if(conditions.filter.filters[counter].filters[0].operator == 'neq') {
						logic2[0] = {};
						logic2[0]["bool"] = {};
						logic2[0]["bool"]["must_not"] = {};
						logic2[0]["bool"]["must_not"]["term"] = {};
						logic2[0]["bool"]["must_not"]["term"][conditions.filter.filters[counter].filters[0].field+".exactWords"] = conditions.filter.filters[counter].filters[0].value.toLowerCase();
					} else {
						logic2[0] = {};
						logic2[0]["term"] = {};
						logic2[0]["term"][conditions.filter.filters[counter].filters[0].field+".exactWords"] = conditions.filter.filters[counter].filters[0].value.toLowerCase();
					}
				} else if(conditions.filter.filters[counter].filters[0].operator == 'contains' || conditions.filter.filters[counter].filters[0].operator == 'doesnotcontain') {
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
					logic2[counter] = {};
					logic2[counter]["wildcard"] = {};
					logic2[counter]["wildcard"][conditions.filter.filters[counter].filters[0].field+".exactWords"] = conditions.filter.filters[counter].filters[0].value.toLowerCase()+"*";
				} else if(conditions.filter.filters[counter].filters[0].operator == 'endswith') {
					logic2[counter] = {};
					logic2[counter]["wildcard"] = {};
					logic2[counter]["wildcard"][conditions.filter.filters[counter].filters[0].field+".exactWords"] = "*"+conditions.filter.filters[counter].filters[0].value.toLowerCase();
				}
				if(conditions.filter.filters[counter].filters[1].operator == 'eq' || conditions.filter.filters[counter].filters[1].operator == 'neq') {
					if(conditions.filter.filters[counter].filters[1].operator == 'neq') {
						logic2[1] = {};
						logic2[1]["bool"] = {};
						logic2[1]["bool"]["must_not"] = {};
						logic2[1]["bool"]["must_not"]["term"] = {};
						logic2[1]["bool"]["must_not"]["term"][conditions.filter.filters[counter].filters[1].field+".exactWords"] = conditions.filter.filters[counter].filters[1].value.toLowerCase();
					} else {
						logic2[1] = {};
						logic2[1]["term"] = {};
						logic2[1]["term"][conditions.filter.filters[counter].filters[1].field+".exactWords"] = conditions.filter.filters[counter].filters[1].value.toLowerCase();
					}
				} else if(conditions.filter.filters[counter].filters[1].operator == 'contains' || conditions.filter.filters[counter].filters[1].operator == 'doesnotcontain') {
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
					logic2[counter] = {};
					logic2[counter]["wildcard"] = {};
					logic2[counter]["wildcard"][conditions.filter.filters[counter].filters[1].field+".exactWords"] = conditions.filter.filters[counter].filters[1].value.toLowerCase()+"*";
				} else if(conditions.filter.filters[counter].filters[1].operator == 'endswith') {
					logic2[counter] = {};
					logic2[counter]["wildcard"] = {};
					logic2[counter]["wildcard"][conditions.filter.filters[counter].filters[1].field+".exactWords"] = "*"+conditions.filter.filters[counter].filters[1].value.toLowerCase();
				}
			} else {
				// External condition of single logic operator
				if(conditions.filter.filters[counter].operator == 'eq' || conditions.filter.filters[counter].operator == 'neq') {
					if(conditions.filter.filters[counter].operator == 'neq') {
						logic[counter] = {};
						logic[counter]["bool"] = {};
						logic[counter]["bool"]["must_not"] = {};
						logic[counter]["bool"]["must_not"]["term"] = {};
						logic[counter]["bool"]["must_not"]["term"][conditions.filter.filters[counter].field+".exactWords"] = conditions.filter.filters[counter].value.toLowerCase();
					} else {
						logic[counter] = {};
						logic[counter]["term"] = {};
						logic[counter]["term"][conditions.filter.filters[counter].field+".exactWords"] = conditions.filter.filters[counter].value.toLowerCase();
					}
				} else if(conditions.filter.filters[counter].operator == 'contains' || conditions.filter.filters[counter].operator == 'doesnotcontain') {
					if(conditions.filter.filters[counter].operator == 'doesnotcontain') {
						logic[counter] = {};
						logic[counter]["bool"] = {};
						logic[counter]["bool"]["must_not"] = {};
						logic[counter]["bool"]["must_not"]["wildcard"] = {};
						logic[counter]["bool"]["must_not"]["wildcard"][conditions.filter.filters[counter].field+".exactWords"] = "*"+conditions.filter.filters[counter].value.toLowerCase()+"*";
					} else {
						logic[counter] = {};
						logic[counter]["wildcard"] = {};
						logic[counter]["wildcard"][conditions.filter.filters[counter].field+".exactWords"] = "*"+conditions.filter.filters[counter].value.toLowerCase()+"*";
					}
				} else if(conditions.filter.filters[counter].operator == 'startswith') {
					logic[counter] = {};
					logic[counter]["wildcard"] = {};
					logic[counter]["wildcard"][conditions.filter.filters[counter].field+".exactWords"] = conditions.filter.filters[counter].value.toLowerCase()+"*";
				} else if(conditions.filter.filters[counter].operator == 'endswith') {
					logic[counter] = {};
					logic[counter]["wildcard"] = {};
					logic[counter]["wildcard"][conditions.filter.filters[counter].field+".exactWords"] = "*"+conditions.filter.filters[counter].value.toLowerCase();
				}
			}
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
			if(conditions.sort[i].field == "id" || conditions.sort[i].field == "created") {
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