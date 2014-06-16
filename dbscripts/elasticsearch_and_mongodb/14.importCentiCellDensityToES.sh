curl -XPUT 'http://localhost:9200/sibexplorer/centi_cell_density/_mapping' -d '
{
	"centi_cell_density" :  {
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
			"centi_cell_id": {
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
				"type" : "geo_point"
			},
			"location_centi_cell" : {
				"type" : "geo_point"
			},
			"count": {
				"type" : "integer"
			}
		}
	}
}'

curl -XPUT 'http://localhost:9200/_river/river-mongodb-centi_cell_density/_meta' -d '{
	"type": "mongodb",
	"mongodb": {
		"db": "sibexplorer_dev",
		"collection": "centi_cell_density"
	},
	"index": {
		"name": "sibexplorer",
		"type": "centi_cell_density"
	}
}'