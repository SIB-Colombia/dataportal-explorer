ElasticSearchClient = require('elasticsearchclient');

var serverOptions = {
	hosts: [{
		host: 'localhost',
		port: 9200,
		secure: false
	}]
};

var elasticSearchClient = new ElasticSearchClient(serverOptions);

exports.getOccurrences = function() {
	qryObj = {
		"fields": ["id", "canonical", "data_resource_name", "institution_code", "collection_code", "catalogue_number", "created", "modified", "location", "iso_country_code"],
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
	qryObj["fields"] = ["id", "canonical", "data_resource_name", "institution_code", "collection_code", "catalogue_number", "created", "modified", "location", "iso_country_code"];
	qryObj["query"] = {"match_all" : {}};
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

	console.log(qryObj);
	mySearchCall = elasticSearchClient.search('sibexplorer', 'occurrences', qryObj);
	return mySearchCall;	
};