var fs = require('fs');
ElasticSearchClient = require('elasticsearchclient');

module.exports = function(environment) {
	var connectionString = {
		development: {
			elasticSearchServer: {
				hosts: [{
					host: 'localhost',
					port: 9200,
					secure: false
				}]
			}
		},
		production: {
			elasticSearchServer: {
				hosts: [{
					host: 'localhost',
					port: 9200,
					secure: false
				}]
			}
		}
	};

	// Elasticsearch client connection
	elasticSearchClient = new ElasticSearchClient(connectionString[environment].elasticSearchServer);

};
