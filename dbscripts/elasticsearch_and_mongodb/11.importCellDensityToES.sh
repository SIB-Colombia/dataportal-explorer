# Mapping for geo_distance, geo_bbox, geo_distance_range, geo_polygon and geo_shape support
curl -XPUT 'http://localhost:9200/sibexplorer/_mapping/cell_density' -d '
{
	"cell_density" :  {
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
			"location_cell" : {
				"type" : "geo_point",
				"lat_lon": true,
				"validate": true
			},
			"count": {
				"type" : "integer"
			}
		}
	}
}'

curl -XPUT 'http://localhost:9200/_river/river-mongodb-cell_density/_meta' -d '{
	"type": "mongodb",
	"mongodb": {
		"db": "sibexplorer_dev",
		"collection": "cell_density"
	},
	"index": {
		"name": "sibexplorer",
		"type": "cell_density"
	}
}'
