var fs = require('fs');
mongoose = require('mongoose');
ElasticSearchClient = require('elasticsearchclient');

module.exports = function(environment) {
	var connectionString = {
		development: {
			db: 'mongodb://localhost/sibexplorer_dev',
			elasticSearchServer: {
				hosts: [{
					host: 'localhost',
					port: 9200,
					secure: false
				}]
			}
		},
		production: {
			db: 'mongodb://localhost/sibexplorer_dev',
			elasticSearchServer: {
				hosts: [{
					host: 'localhost',
					port: 9200,
					secure: false
				}]
			}
		}
	};

	// Database mongodb using mongoose ODM connection
	mongoose.connect(connectionString[environment].db);

	// Elasticsearch client connection
	elasticSearchClient = new ElasticSearchClient(connectionString[environment].elasticSearchServer);

	// Bootstrap models
	var models_path = __dirname + '/../../app/models/mongodb';
	fs.readdirSync(models_path).forEach(function (file) {
		require(models_path+'/'+file);
	});
};