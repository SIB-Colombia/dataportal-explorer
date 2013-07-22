module.exports = {
	development: {
		db: 'mongodb://localhost/sibexplorer_dev',
		elasticSearchServer: {
			hosts: [{
            	host: 'localhost',
            	port: 9200,
            	secure: false
            }]
		}
	}
}