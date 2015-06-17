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
			"taxon_name_author":  {
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
			"location" : {
				"type" : "geo_point",
				"lat_lon": true,
				"validate": true,
				"geohash": true,
				"geohash_prefix": true,
				"geohash_precision": 6
			},
			"cell_id": {"type" : "integer"},
			"centi_cell_id": {"type" : "integer"},
			"pointfive_cell_id": {"type" : "integer"},
			"pointtwo_cell_id": {"type" : "integer"},
			"mod360_cell_id": {"type" : "integer"},
			"geospatial_issue": {"type" : "integer"},
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
			"altitude_meters": {"type" : "integer"},
			"depth_centimeters": {"type" : "integer"},
			"taxonomic_issue": {"type" : "integer"},
			"other_issue": {"type" : "integer"},
			"deleted": {
				"type": "date",
				"format": "YYYY-MM-dd HH:mm:ss"
			},
			"modified": {
				"type": "date",
				"format": "YYYY-MM-dd HH:mm:ss"
			},
			"protected_area" :  {
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
			"zonification" :  {
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
			"dry_forest": {"type" : "integer"},
			"iso_country_code_calculated" :  {
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
			"iso_department_code_calculated" :  {
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
			"paramo_sector" :  {
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
			"paramo_district" :  {
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
			"country_name_calculated" :  {
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
			},
			"taxonomy": {
				"type": "object",
				"properties": {
					"id": {"type" : "integer"},
					"phylum_id": {"type" : "integer"},
					"phylum_name" :  {
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
					"phylum_author" :  {
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
					"kingdom_id": {"type" : "integer"},
					"kingdom_name" :  {
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
					"kingdom_author" :  {
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
					"class_id": {"type" : "integer"},
					"class_name" :  {
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
					"class_author" :  {
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
					"order_id": {"type" : "integer"},
					"order_name" :  {
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
					"order_author" :  {
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
					"family_id": {"type" : "integer"},
					"family_name" :  {
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
					"family_author" :  {
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
					"genus_id": {"type" : "integer"},
					"genus_name" :  {
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
					"genus_author" :  {
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
					"species_id": {"type" : "integer"},
					"species_name" :  {
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
					"species_author" :  {
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
					}
				}
			},
			"provider": {
				"type": "object",
				"properties": {
					"id": {"type" : "integer"},
					"name" :  {
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
					"description" :  {
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
					"address" :  {
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
					"city" :  {
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
					"website_url" :  {
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
					"logo_url" :  {
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
					"email" :  {
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
					"telephone" :  {
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
					"uuid" :  {
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
					"created": {
						"type": "date",
						"format": "YYYY-MM-dd HH:mm:ss"
					},
					"modified": {
						"type": "date",
						"format": "YYYY-MM-dd HH:mm:ss"
					},
					"deleted": {
						"type": "date",
						"format": "YYYY-MM-dd HH:mm:ss"
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
					"gbif_approver" :  {
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
					"type" :  {
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
					}
				}
			},
			"resource": {
				"type": "object",
				"properties": {
					"id": {"type" : "integer"},
					"name" :  {
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
					"display_name" :  {
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
					"description" :  {
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
					"rights" :  {
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
					"citation" :  {
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
					"logo_url" :  {
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
					"created": {
						"type": "date",
						"format": "YYYY-MM-dd HH:mm:ss"
					},
					"modified": {
						"type": "date",
						"format": "YYYY-MM-dd HH:mm:ss"
					},
					"deleted": {
						"type": "date",
						"format": "YYYY-MM-dd HH:mm:ss"
					},
					"website_url" :  {
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
					"gbif_registry_uuid" :  {
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
					}
				}
			},
			"institution": {
				"type": "object",
				"properties": {
					"id": {"type" : "integer"},
					"code" :  {
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
					}
				}
			},
			"collection": {
				"type": "object",
				"properties": {
					"id": {"type" : "integer"},
					"code" :  {
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
					}
				}
			},
			"catalogue": {
				"type": "object",
				"properties": {
					"id": {"type" : "integer"},
					"number" :  {
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
					}
				}
			},
			"basis_of_record": {
				"type": "object",
				"properties": {
					"id": {"type" : "integer"},
					"name" :  {
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
					"name_spanish" :  {
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
		"type": "occurrences",
		"bulk": {
			"concurrent_requests": 1
		}
	}
}'
