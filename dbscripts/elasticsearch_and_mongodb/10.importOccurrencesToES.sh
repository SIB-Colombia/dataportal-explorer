curl -XPUT 'http://localhost:9200/sibexplorer/' -d '
{
	"settings": {
		"analysis": {
			"filter": {
				"nGram_filter": {
					"type": "nGram",
					"min_gram": "2",
					"max_gram": "20",
					"token_chars": ["letter", "digit", "punctuation", "symbol"]
				},
				"snowball": {
					"type": "snowball",
					"language": "Spanish"
				},
				"stopwords": {
					"type": "stop",
					"stopwords": "_spanish_"
				},
				"worddelimiter": {
					"type": "word_delimiter"
				},
				"my_shingle_filter": {
					"type": "shingle",
					"min_shingle_size": "2",
					"max_shingle_size": "5",
					"output_unigrams": "false",
					"output_unigrams_if_no_shingles": "false"
				},
				"my_ascii_folding": {
					"type" : "asciifolding",
					"preserve_original": true
				}
			},
			"analyzer": {
				"spanish_ngram_analyzer": {
					"type": "custom",
					"tokenizer": "whitespace",
					"filter": ["lowercase", "stopwords", "my_ascii_folding", "nGram_filter"]
				},
				"spanish_search_analyzer": {
					"type": "custom",
					"tokenizer": "standard",
					"filter": ["lowercase", "stopwords", "my_ascii_folding", "snowball", "worddelimiter"]
				},
				"my_shingle_analyzer": {
					"type": "custom",
					"tokenizer": "standard",
					"filter": ["lowercase", "my_shingle_filter"]
				},
				"string_lowercase": {
					"tokenizer": "keyword",
					"filter": ["lowercase"]
				}
			}
		}
	}
}'

curl -XPUT 'http://localhost:9200/sibexplorer/_mapping/occurrences' -d '
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
			"geospatial_issue": {"type" : "integer"},
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
						"analyzer": "spanish_search_analyzer"
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
						"analyzer": "spanish_search_analyzer"
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
						"analyzer": "spanish_search_analyzer"
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
						"analyzer": "spanish_search_analyzer"
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
						"analyzer": "spanish_search_analyzer"
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
						"analyzer": "spanish_search_analyzer"
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
						"analyzer": "spanish_search_analyzer"
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
						"analyzer": "spanish_search_analyzer"
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
						"analyzer": "spanish_search_analyzer"
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
						"analyzer": "spanish_search_analyzer"
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
						"analyzer": "spanish_search_analyzer"
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
						"analyzer": "spanish_search_analyzer"
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
						"analyzer": "spanish_search_analyzer"
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
						"analyzer": "spanish_search_analyzer"
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
						"analyzer": "spanish_search_analyzer"
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
						"analyzer": "spanish_search_analyzer"
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
						"analyzer": "spanish_search_analyzer"
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
						"analyzer": "spanish_search_analyzer"
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
						"analyzer": "spanish_search_analyzer"
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
						"analyzer": "spanish_search_analyzer"
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
						"analyzer": "spanish_search_analyzer"
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
						"analyzer": "spanish_search_analyzer"
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
						"analyzer": "spanish_search_analyzer"
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
						"analyzer": "spanish_search_analyzer"
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
						"analyzer": "spanish_search_analyzer"
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
						"analyzer": "spanish_search_analyzer"
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
						"analyzer": "spanish_search_analyzer"
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
						"analyzer": "spanish_search_analyzer"
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
						"analyzer": "spanish_search_analyzer"
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
						"analyzer": "spanish_search_analyzer"
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
						"analyzer": "spanish_search_analyzer"
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
						"analyzer": "spanish_search_analyzer"
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
						"analyzer": "spanish_search_analyzer"
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
						"analyzer": "spanish_search_analyzer"
					},
					"shingles": {
						"type": "string",
						"analyzer": "my_shingle_analyzer"
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
						"analyzer": "spanish_search_analyzer"
					},
					"shingles": {
						"type": "string",
						"analyzer": "my_shingle_analyzer"
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
						"analyzer": "spanish_search_analyzer"
					},
					"shingles": {
						"type": "string",
						"analyzer": "my_shingle_analyzer"
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
						"analyzer": "spanish_search_analyzer"
					},
					"shingles": {
						"type": "string",
						"analyzer": "my_shingle_analyzer"
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
						"analyzer": "spanish_search_analyzer"
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
						"analyzer": "spanish_search_analyzer"
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
						"analyzer": "spanish_search_analyzer"
					}
				}
			},
			"locality" :  {
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
						"analyzer": "spanish_search_analyzer"
					},
					"shingles": {
						"type": "string",
						"analyzer": "my_shingle_analyzer"
					}
				}
			},
			"location" : {
				"type" : "geo_point",
				"lat_lon": true,
				"validate": true,
				"geohash": true,
				"geohash_prefix": true,
				"geohash_precision": 8
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
								"analyzer": "spanish_search_analyzer"
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