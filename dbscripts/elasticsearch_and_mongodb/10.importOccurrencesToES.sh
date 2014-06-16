curl -XPUT 'http://localhost:9200/sibexplorer'

curl -XPUT 'http://localhost:9200/sibexplorer/occurrences/_mapping' -d '
{
	"occurrences" :  {
		"properties": {
			"id": {
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
			"created": {
				"type": "date",
				"format": "YYYY-MM-dd HH:mm:ss"
			},
			"modified": {
				"type": "date",
				"format": "YYYY-MM-dd HH:mm:ss"
			},
			"year": {
				"type": "date",
				"format": "YYYY"
			},
			"month": {
				"type": "date",
				"format": "MM"
			},
			"occurrence_date": {
				"type": "date",
				"format": "YYYY-MM-dd"
			},
			"altitude_metres": {"type" : "integer"},
			"depth_centimetres": {"type" : "integer"},
			"data_provider_id": {"type" : "integer"},
			"data_resource_id": {"type" : "integer"},
			"institution_code_id": {"type" : "integer"},
			"collection_code_id": {"type" : "integer"},
			"catalogue_number_id": {"type" : "integer"},
			"kingdom_concept_id": {"type" : "integer"},
			"phylum_concept_id": {"type" : "integer"},
			"class_concept_id": {"type" : "integer"},
			"order_concept_id": {"type" : "integer"},
			"family_concept_id": {"type" : "integer"},
			"genus_concept_id": {"type" : "integer"},
			"species_concept_id": {"type" : "integer"},
			"basis_or_record_id": {"type" : "integer"},
			"cell_id": {"type" : "integer"},
			"centi_cell_id": {"type" : "integer"},
			"pointfive_cell_id": {"type" : "integer"},
			"pointtwo_cell_id": {"type" : "integer"},
			"mod360_cell_id": {"type" : "integer"},
			"canonical":  {
				"type": "string",
				"index": "analyzed",
				"fields": {
					"untouched" : {
						"type": "string",
						"index": "not_analyzed"
					},
					"exactWords": {
						"type": "string",
						"analyzer": "string_lowercase"
					},
					"spanish": {
						"type": "string",
						"analyzer": "spanish_analyzer"
					}
				}
			},
			"nombre_comun":  {
				"type": "string",
				"index": "analyzed",
				"fields": {
					"untouched": {
						"type": "string",
						"index": "not_analyzed"
					},
					"exactWords": {
						"type": "string",
						"analyzer": "string_lowercase"
					},
					"spanish": {
						"type": "string",
						"analyzer": "spanish_analyzer"
					}
				}
			},
			"data_provider_name" :  {
				"type": "string",
				"index": "analyzed",
				"fields": {
					"untouched": {
						"type": "string",
						"index": "not_analyzed"
					},
					"exactWords": {
						"type": "string",
						"analyzer": "string_lowercase"
					},
					"spanish": {
						"type": "string",
						"analyzer": "spanish_analyzer"
					}
				}
			},
			"data_resource_name" :  {
				"type": "string",
				"index": "analyzed",
				"fields" : {
					"untouched": {
						"type": "string",
						"index": "not_analyzed"
					},
					"exactWords": {
						"type": "string",
						"analyzer": "string_lowercase"
					},
					"spanish": {
						"type": "string",
						"analyzer": "spanish_analyzer"
					}
				}
			},
			"institution_code" :  {
				"type": "string",
				"index": "analyzed",
				"fields" : {
					"untouched": {
						"type": "string",
						"index": "not_analyzed"
					},
					"exactWords": {
						"type": "string",
						"analyzer": "string_lowercase"
					},
					"spanish": {
						"type": "string",
						"analyzer": "spanish_analyzer"
					}
				}
			},
			"collection_code" :  {
				"type": "string",
				"index": "analyzed",
				"fields" : {
					"untouched": {
						"type": "string",
						"index": "not_analyzed"
					},
					"exactWords": {
						"type": "string",
						"analyzer": "string_lowercase"
					},
					"spanish": {
						"type": "string",
						"analyzer": "spanish_analyzer"
					}
				}
			},
			"catalogue_number" :  {
				"type": "string",
				"index": "analyzed",
				"fields" : {
					"untouched": {
						"type": "string",
						"index": "not_analyzed"
					},
					"exactWords": {
						"type": "string",
						"analyzer": "string_lowercase"
					},
					"spanish": {
						"type": "string",
						"analyzer": "spanish_analyzer"
					}
				}
			},
			"iso_country_code" :  {
				"type": "string",
				"index": "analyzed",
				"fields" : {
					"untouched": {
						"type": "string",
						"index": "not_analyzed"
					},
					"exactWords": {
						"type": "string",
						"analyzer": "string_lowercase"
					},
					"spanish": {
						"type": "string",
						"analyzer": "spanish_analyzer"
					}
				}
			},
			"iso_department_code" :  {
				"type": "string",
				"index": "analyzed",
				"fields" : {
					"untouched": {
						"type": "string",
						"index": "not_analyzed"
					},
					"exactWords": {
						"type": "string",
						"analyzer": "string_lowercase"
					},
					"spanish": {
						"type": "string",
						"analyzer": "spanish_analyzer"
					}
				}
			},
			"iso_county_code" :  {
				"type": "string",
				"index": "analyzed",
				"fields" : {
					"untouched": {
						"type": "string",
						"index": "not_analyzed"
					},
					"exactWords": {
						"type": "string",
						"analyzer": "string_lowercase"
					},
					"spanish": {
						"type": "string",
						"analyzer": "spanish_analyzer"
					}
				}
			},
			"paramo_code" :  {
				"type": "string",
				"index": "analyzed",
				"fields" : {
					"untouched": {
						"type": "string",
						"index": "not_analyzed"
					},
					"exactWords": {
						"type": "string",
						"analyzer": "string_lowercase"
					},
					"spanish": {
						"type": "string",
						"analyzer": "spanish_analyzer"
					}
				}
			},
			"marine_zone_code" :  {
				"type": "string",
				"index": "analyzed",
				"fields" : {
					"untouched": {
						"type": "string",
						"index": "not_analyzed"
					},
					"exactWords": {
						"type": "string",
						"analyzer": "string_lowercase"
					},
					"spanish": {
						"type": "string",
						"analyzer": "spanish_analyzer"
					}
				}
			},
			"kingdom" :  {
				"type": "string",
				"index": "analyzed",
				"fields" : {
					"untouched": {
						"type": "string",
						"index": "not_analyzed"
					},
					"exactWords": {
						"type": "string",
						"analyzer": "string_lowercase"
					},
					"spanish": {
						"type": "string",
						"analyzer": "spanish_analyzer"
					}
				}
			},
			"phylum" :  {
				"type": "string",
				"index": "analyzed",
				"fields" : {
					"untouched": {
						"type": "string",
						"index": "not_analyzed"
					},
					"exactWords": {
						"type": "string",
						"analyzer": "string_lowercase"
					},
					"spanish": {
						"type": "string",
						"analyzer": "spanish_analyzer"
					}
				}
			},
			"taxonClass" :  {
				"type": "string",
				"index": "analyzed",
				"fields" : {
					"untouched": {
						"type": "string",
						"index": "not_analyzed"
					},
					"exactWords": {
						"type": "string",
						"analyzer": "string_lowercase"
					},
					"spanish": {
						"type": "string",
						"analyzer": "spanish_analyzer"
					}
				}
			},
			"order_rank" :  {
				"type": "string",
				"index": "analyzed",
				"fields" : {
					"untouched": {
						"type": "string",
						"index": "not_analyzed"
					},
					"exactWords": {
						"type": "string",
						"analyzer": "string_lowercase"
					},
					"spanish": {
						"type": "string",
						"analyzer": "spanish_analyzer"
					}
				}
			},
			"family" :  {
				"type": "string",
				"index": "analyzed",
				"fields" : {
					"untouched": {
						"type": "string",
						"index": "not_analyzed"
					},
					"exactWords": {
						"type": "string",
						"analyzer": "string_lowercase"
					},
					"spanish": {
						"type": "string",
						"analyzer": "spanish_analyzer"
					}
				}
			},
			"genus" :  {
				"type": "string",
				"index": "analyzed",
				"fields" : {
					"untouched": {
						"type": "string",
						"index": "not_analyzed"
					},
					"exactWords": {
						"type": "string",
						"analyzer": "string_lowercase"
					},
					"spanish": {
						"type": "string",
						"analyzer": "spanish_analyzer"
					}
				}
			},
			"species" :  {
				"type": "string",
				"index": "analyzed",
				"fields" : {
					"untouched": {
						"type": "string",
						"index": "not_analyzed"
					},
					"exactWords": {
						"type": "string",
						"analyzer": "string_lowercase"
					},
					"spanish": {
						"type": "string",
						"analyzer": "spanish_analyzer"
					}
				}
			},
			"kingdom_group" :  {
				"type": "string",
				"index": "analyzed",
				"fields" : {
					"untouched": {
						"type": "string",
						"index": "not_analyzed"
					},
					"exactWords": {
						"type": "string",
						"analyzer": "string_lowercase"
					},
					"spanish": {
						"type": "string",
						"analyzer": "spanish_analyzer"
					}
				}
			},
			"phylum_group" :  {
				"type": "string",
				"index": "analyzed",
				"fields" : {
					"untouched": {
						"type": "string",
						"index": "not_analyzed"
					},
					"exactWords": {
						"type": "string",
						"analyzer": "string_lowercase"
					},
					"spanish": {
						"type": "string",
						"analyzer": "spanish_analyzer"
					}
				}
			},
			"taxonClass_group" :  {
				"type": "string",
				"index": "analyzed",
				"fields" : {
					"untouched": {
						"type": "string",
						"index": "not_analyzed"
					},
					"exactWords": {
						"type": "string",
						"analyzer": "string_lowercase"
					},
					"spanish": {
						"type": "string",
						"analyzer": "spanish_analyzer"
					}
				}
			},
			"order_rank_group" :  {
				"type": "string",
				"index": "analyzed",
				"fields" : {
					"untouched": {
						"type": "string",
						"index": "not_analyzed"
					},
					"exactWords": {
						"type": "string",
						"analyzer": "string_lowercase"
					},
					"spanish": {
						"type": "string",
						"analyzer": "spanish_analyzer"
					}
				}
			},
			"family_group" :  {
				"type": "string",
				"index": "analyzed",
				"fields" : {
					"untouched": {
						"type": "string",
						"index": "not_analyzed"
					},
					"exactWords": {
						"type": "string",
						"analyzer": "string_lowercase"
					},
					"spanish": {
						"type": "string",
						"analyzer": "spanish_analyzer"
					}
				}
			},
			"genus_group" :  {
				"type": "string",
				"index": "analyzed",
				"fields" : {
					"untouched": {
						"type": "string",
						"index": "not_analyzed"
					},
					"exactWords": {
						"type": "string",
						"analyzer": "string_lowercase"
					},
					"spanish": {
						"type": "string",
						"analyzer": "spanish_analyzer"
					}
				}
			},
			"species_group" :  {
				"type": "string",
				"index": "analyzed",
				"fields" : {
					"untouched": {
						"type": "string",
						"index": "not_analyzed"
					},
					"exactWords": {
						"type": "string",
						"analyzer": "string_lowercase"
					},
					"spanish": {
						"type": "string",
						"analyzer": "spanish_analyzer"
					}
				}
			},
			"pointfive_group" :  {
				"type": "string",
				"index": "analyzed",
				"fields" : {
					"untouched": {
						"type": "string",
						"index": "not_analyzed"
					},
					"exactWords": {
						"type": "string",
						"analyzer": "string_lowercase"
					},
					"spanish": {
						"type": "string",
						"analyzer": "spanish_analyzer"
					}
				}
			},
			"pointtwo_group" :  {
				"type": "string",
				"index": "analyzed",
				"fields" : {
					"untouched": {
						"type": "string",
						"index": "not_analyzed"
					},
					"exactWords": {
						"type": "string",
						"analyzer": "string_lowercase"
					},
					"spanish": {
						"type": "string",
						"analyzer": "spanish_analyzer"
					}
				}
			},
			"centi_group" :  {
				"type": "string",
				"index": "analyzed",
				"fields" : {
					"untouched": {
						"type": "string",
						"index": "not_analyzed"
					},
					"exactWords": {
						"type": "string",
						"analyzer": "string_lowercase"
					},
					"spanish": {
						"type": "string",
						"analyzer": "spanish_analyzer"
					}
				}
			},
			"cell_group" :  {
				"type": "string",
				"index": "analyzed",
				"fields" : {
					"untouched": {
						"type": "string",
						"index": "not_analyzed"
					},
					"exactWords": {
						"type": "string",
						"analyzer": "string_lowercase"
					},
					"spanish": {
						"type": "string",
						"analyzer": "spanish_analyzer"
					}
				}
			},
			"county_group" :  {
				"type": "string",
				"index": "analyzed",
				"fields" : {
					"untouched": {
						"type": "string",
						"index": "not_analyzed"
					},
					"exactWords": {
						"type": "string",
						"analyzer": "string_lowercase"
					},
					"spanish": {
						"type": "string",
						"analyzer": "spanish_analyzer"
					}
				}
			},
			"paramo_group" :  {
				"type": "string",
				"index": "analyzed",
				"fields" : {
					"untouched": {
						"type": "string",
						"index": "not_analyzed"
					},
					"exactWords": {
						"type": "string",
						"analyzer": "string_lowercase"
					},
					"spanish": {
						"type": "string",
						"analyzer": "spanish_analyzer"
					}
				}
			},
			"marine_zone_group" :  {
				"type": "string",
				"index": "analyzed",
				"fields" : {
					"untouched": {
						"type": "string",
						"index": "not_analyzed"
					},
					"exactWords": {
						"type": "string",
						"analyzer": "string_lowercase"
					},
					"spanish": {
						"type": "string",
						"analyzer": "spanish_analyzer"
					}
				}
			},
			"country_name" :  {
				"type": "string",
				"index": "analyzed",
				"fields" : {
					"untouched": {
						"type": "string",
						"index": "not_analyzed"
					},
					"exactWords": {
						"type": "string",
						"analyzer": "string_lowercase"
					},
					"spanish": {
						"type": "string",
						"analyzer": "spanish_analyzer"
					}
				}
			},
			"department_name" :  {
				"type": "string",
				"index": "analyzed",
				"fields" : {
					"untouched": {
						"type": "string",
						"index": "not_analyzed"
					},
					"exactWords": {
						"type": "string",
						"analyzer": "string_lowercase"
					},
					"spanish": {
						"type": "string",
						"analyzer": "spanish_analyzer"
					}
				}
			},
			"county_name" :  {
				"type": "string",
				"index": "analyzed",
				"fields" : {
					"untouched": {
						"type": "string",
						"index": "not_analyzed"
					},
					"exactWords": {
						"type": "string",
						"analyzer": "string_lowercase"
					},
					"spanish": {
						"type": "string",
						"analyzer": "spanish_analyzer"
					}
				}
			},
			"paramo_name" : {
				"type": "string",
				"index": "analyzed",
				"fields" : {
					"untouched": {
						"type": "string",
						"index": "not_analyzed"
					},
					"exactWords": {
						"type": "string",
						"analyzer": "string_lowercase"
					},
					"spanish": {
						"type": "string",
						"analyzer": "spanish_analyzer"
					}
				}
			},
			"marine_zone_name" : {
				"type": "string",
				"index": "analyzed",
				"fields" : {
					"untouched": {
						"type": "string",
						"index": "not_analyzed"
					},
					"exactWords": {
						"type": "string",
						"analyzer": "string_lowercase"
					},
					"spanish": {
						"type": "string",
						"analyzer": "spanish_analyzer"
					}
				}
			},
			"basis_of_record_name" :  {
				"type": "string",
				"index": "analyzed",
				"fields" : {
					"untouched": {
						"type": "string",
						"index": "not_analyzed"
					},
					"exactWords": {
						"type": "string",
						"analyzer": "string_lowercase"
					},
					"spanish": {
						"type": "string",
						"analyzer": "spanish_analyzer"
					}
				}
			},
			"basis_of_record_name_spanish" :  {
				"type": "string",
				"index": "analyzed",
				"fields" : {
					"untouched": {
						"type": "string",
						"index": "not_analyzed"
					},
					"exactWords": {
						"type": "string",
						"analyzer": "string_lowercase"
					},
					"spanish": {
						"type": "string",
						"analyzer": "spanish_analyzer"
					}
				}
			},
			"location" : {
				"type" : "geo_point",
				"lat_lon": true,
				"validate": true
			},
			"location_cell" : {
				"type" : "geo_point",
				"lat_lon": true,
				"validate": true
			},
			"location_centi_cell" : {
				"type" : "geo_point",
				"lat_lon": true,
				"validate": true
			},
			"location_pointfive_cell" : {
				"type" : "geo_point",
				"lat_lon": true,
				"validate": true
			},
			"location_pointtwo_cell" : {
				"type" : "geo_point",
				"lat_lon": true,
				"validate": true
			},
			"common_names": {
				"type": "nested",
				"properties": {
					"name": {
						"type": "string",
						"index": "analyzed",
						"fields" : {
							"untouched": {
								"type": "string",
								"index": "not_analyzed"
							},
							"exactWords": {
								"type": "string",
								"analyzer": "string_lowercase"
							},
							"spanish": {
								"type": "string",
								"analyzer": "spanish_analyzer"
							}
						}
					},
					"transliteration": {
						"type": "string",
						"index": "analyzed",
						"fields" : {
							"untouched": {
								"type": "string",
								"index": "not_analyzed"
							},
							"exactWords": {
								"type": "string",
								"analyzer": "string_lowercase"
							}
						}
					},
					"iso_language_code": {
						"type": "string",
						"index": "analyzed",
						"fields" : {
							"untouched": {
								"type": "string",
								"index": "not_analyzed"
							},
							"exactWords": {
								"type": "string",
								"analyzer": "string_lowercase"
							}
						}
					},
					"iso_country_code": {
						"type": "string",
						"index": "analyzed",
						"fields" : {
							"untouched": {
								"type": "string",
								"index": "not_analyzed"
							},
							"exactWords": {
								"type": "string",
								"analyzer": "string_lowercase"
							}
						}
					},
					"language_name": {
						"type": "string",
						"index": "analyzed",
						"fields" : {
							"untouched": {
								"type": "string",
								"index": "not_analyzed"
							},
							"exactWords": {
								"type": "string",
								"analyzer": "string_lowercase"
							}
						}
					}
				}
			}
		}
	}
}'

curl -XPUT 'http://localhost:9200/_river/river-mongodb-occurrences/_meta' -d '{
	"type": "mongodb",
	"mongodb": {
		"db": "sibexplorer_dev",
		"collection": "occurrences"
	},
	"index": {
		"name": "sibexplorer",
		"type": "occurrences"
	}
}'