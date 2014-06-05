curl -XPUT 'http://localhost:9200/sibexplorer/pointtwo_cell_density/_mapping' -d '
{
	"pointtwo_cell_density" :  {
		"properties": {
			"type": {
				"type": "string",
				"index": "analyzed",
				"fields" : {
					"untouched" : {
						"type": "string",
						"index": "not_analyzed"
					},
					"exactWords": {
						"type": "string",
						"analyzer": "string_lowercase"
					}
				}
			},
			"entity_id": {
				"type": "string",
				"index": "analyzed",
				"fields" : {
					"untouched" : {
						"type": "string",
						"index": "not_analyzed"
					},
					"exactWords": {
						"type": "string",
						"analyzer": "string_lowercase"
					}
				}
			},
			"cell_id": {
				"type": "string",
				"index": "analyzed",
				"fields" : {
					"untouched" : {
						"type": "string",
						"index": "not_analyzed"
					},
					"exactWords": {
						"type": "string",
						"analyzer": "string_lowercase"
					}
				}
			},
			"pointtwo_cell_id": {
				"type": "string",
				"index": "analyzed",
				"fields" : {
					"untouched" : {
						"type": "string",
						"index": "not_analyzed"
					},
					"exactWords": {
						"type": "string",
						"analyzer": "string_lowercase"
					}
				}
			},
			"location_cell" : {
				"type" : "geo_point",
				"fielddata" : {
					"format" : "compressed",
					"precision" : "1cm"
				}
			},
			"location_pointtwo_cell" : {
				"type" : "geo_point",
				"fielddata" : {
					"format" : "compressed",
					"precision" : "1cm"
				}
			},
			"count": {
				"type" : "integer"
			}
		}
	}
}'

curl -XPUT 'http://localhost:9200/_river/river-mongodb-pointtwo_cell_density/_meta' -d '{
	"type": "mongodb",
	"mongodb": {
		"db": "sibexplorer_dev",
		"collection": "pointtwo_cell_density"
	},
	"index": {
		"name": "sibexplorer",
		"type": "pointtwo_cell_density"
	}
}'