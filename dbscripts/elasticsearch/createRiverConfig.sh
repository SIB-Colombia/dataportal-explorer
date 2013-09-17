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

curl -XPUT 'http://localhost:9200/_river/river-mongodb-canonical_groups/_meta' -d '{
	"type": "mongodb",
	"mongodb": {
		"db": "sibexplorer_dev",
		"collection": "canonical_groups"
	},
	"index": {
		"name": "sibexplorer",
		"type": "canonical_groups"
	}
}'

curl -XPUT 'http://localhost:9200/_river/river-mongodb-class_groups/_meta' -d '{
	"type": "mongodb",
	"mongodb": {
		"db": "sibexplorer_dev",
		"collection": "class_groups"
	},
	"index": {
		"name": "sibexplorer",
		"type": "class_groups"
	}
}'

curl -XPUT 'http://localhost:9200/_river/river-mongodb-collection_code_groups/_meta' -d '{
	"type": "mongodb",
	"mongodb": {
		"db": "sibexplorer_dev",
		"collection": "collection_code_groups"
	},
	"index": {
		"name": "sibexplorer",
		"type": "collection_code_groups"
	}
}'

curl -XPUT 'http://localhost:9200/_river/river-mongodb-country_groups/_meta' -d '{
	"type": "mongodb",
	"mongodb": {
		"db": "sibexplorer_dev",
		"collection": "country_groups"
	},
	"index": {
		"name": "sibexplorer",
		"type": "country_groups"
	}
}'

curl -XPUT 'http://localhost:9200/_river/river-mongodb-data_provider_groups/_meta' -d '{
	"type": "mongodb",
	"mongodb": {
		"db": "sibexplorer_dev",
		"collection": "data_provider_groups"
	},
	"index": {
		"name": "sibexplorer",
		"type": "data_provider_groups"
	}
}'

curl -XPUT 'http://localhost:9200/_river/river-mongodb-data_resource_groups/_meta' -d '{
	"type": "mongodb",
	"mongodb": {
		"db": "sibexplorer_dev",
		"collection": "data_resource_groups"
	},
	"index": {
		"name": "sibexplorer",
		"type": "data_resource_groups"
	}
}'

curl -XPUT 'http://localhost:9200/_river/river-mongodb-department_groups/_meta' -d '{
	"type": "mongodb",
	"mongodb": {
		"db": "sibexplorer_dev",
		"collection": "department_groups"
	},
	"index": {
		"name": "sibexplorer",
		"type": "department_groups"
	}
}'

curl -XPUT 'http://localhost:9200/_river/river-mongodb-family_groups/_meta' -d '{
	"type": "mongodb",
	"mongodb": {
		"db": "sibexplorer_dev",
		"collection": "family_groups"
	},
	"index": {
		"name": "sibexplorer",
		"type": "family_groups"
	}
}'

curl -XPUT 'http://localhost:9200/_river/river-mongodb-general_stats/_meta' -d '{
	"type": "mongodb",
	"mongodb": {
		"db": "sibexplorer_dev",
		"collection": "general_stats"
	},
	"index": {
		"name": "sibexplorer",
		"type": "general_stats"
	}
}'

curl -XPUT 'http://localhost:9200/_river/river-mongodb-genus_groups/_meta' -d '{
	"type": "mongodb",
	"mongodb": {
		"db": "sibexplorer_dev",
		"collection": "genus_groups"
	},
	"index": {
		"name": "sibexplorer",
		"type": "genus_groups"
	}
}'

curl -XPUT 'http://localhost:9200/_river/river-mongodb-geooccurrences/_meta' -d '{
	"type": "mongodb",
	"mongodb": {
		"db": "sibexplorer_dev",
		"collection": "geooccurrences"
	},
	"index": {
		"name": "sibexplorer",
		"type": "geooccurrences"
	}
}'

curl -XPUT 'http://localhost:9200/_river/river-mongodb-help_search_text/_meta' -d '{
	"type": "mongodb",
	"mongodb": {
		"db": "sibexplorer_dev",
		"collection": "help_search_text"
	},
	"index": {
		"name": "sibexplorer",
		"type": "help_search_text"
	}
}'

curl -XPUT 'http://localhost:9200/_river/river-mongodb-institution_code_groups/_meta' -d '{
	"type": "mongodb",
	"mongodb": {
		"db": "sibexplorer_dev",
		"collection": "institution_code_groups"
	},
	"index": {
		"name": "sibexplorer",
		"type": "institution_code_groups"
	}
}'

curl -XPUT 'http://localhost:9200/_river/river-mongodb-kingdom_groups/_meta' -d '{
	"type": "mongodb",
	"mongodb": {
		"db": "sibexplorer_dev",
		"collection": "kingdom_groups"
	},
	"index": {
		"name": "sibexplorer",
		"type": "kingdom_groups"
	}
}'

curl -XPUT 'http://localhost:9200/_river/river-mongodb-order_rank_groups/_meta' -d '{
	"type": "mongodb",
	"mongodb": {
		"db": "sibexplorer_dev",
		"collection": "order_rank_groups"
	},
	"index": {
		"name": "sibexplorer",
		"type": "order_rank_groups"
	}
}'

curl -XPUT 'http://localhost:9200/_river/river-mongodb-phylum_groups/_meta' -d '{
	"type": "mongodb",
	"mongodb": {
		"db": "sibexplorer_dev",
		"collection": "phylum_groups"
	},
	"index": {
		"name": "sibexplorer",
		"type": "phylum_groups"
	}
}'

curl -XPUT 'http://localhost:9200/_river/river-mongodb-species_groups/_meta' -d '{
	"type": "mongodb",
	"mongodb": {
		"db": "sibexplorer_dev",
		"collection": "species_groups"
	},
	"index": {
		"name": "sibexplorer",
		"type": "species_groups"
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

curl -XPUT 'http://localhost:9200/_river/river-mongodb-pointfive_cell_density/_meta' -d '{
    "type": "mongodb",
    "mongodb": {
        "db": "sibexplorer_dev",
        "collection": "pointfive_cell_density"
    },
    "index": {
        "name": "sibexplorer",
        "type": "pointfive_cell_density"
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

# Mapping for geo_distance, geo_bbox, geo_distance_range, geo_polygon and geo_shape support
curl -XPUT 'http://localhost:9200/sibexplorer/cell_density/_mapping' -d '
{
    "cell_density" :  { 
        "properties": {
            "type": {
                "type": "multi_field", 
                    "fields" : { 
                        "type": { 
                            "type": "integer" 
                        },
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
                "type": "multi_field", 
                    "fields" : { 
                        "entity_id": { 
                            "type": "integer" 
                        },
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
                "type": "multi_field", 
                    "fields" : { 
                        "cell_id": { 
                            "type": "integer" 
                        },
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
            "count": {"type" : "integer"}
        }
    }
}'

curl -XPUT 'http://localhost:9200/sibexplorer/centi_cell_density/_mapping' -d '
{
    "centi_cell_density" :  { 
        "properties": {
            "type": {
                "type": "multi_field", 
                    "fields" : { 
                        "type": { 
                            "type": "integer" 
                        },
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
                "type": "multi_field", 
                    "fields" : { 
                        "entity_id": { 
                            "type": "integer" 
                        },
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
                "type": "multi_field", 
                    "fields" : { 
                        "cell_id": { 
                            "type": "integer" 
                        },
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
                "type": "multi_field", 
                    "fields" : { 
                        "centi_cell_id": { 
                            "type": "integer" 
                        },
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
            "count": {"type" : "integer"}
        }
    }
}'

curl -XPUT 'http://localhost:9200/sibexplorer/pointfive_cell_density/_mapping' -d '
{
    "pointfive_cell_density" :  { 
        "properties": {
            "type": {
                "type": "multi_field", 
                    "fields" : { 
                        "type": { 
                            "type": "integer" 
                        },
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
                "type": "multi_field", 
                    "fields" : { 
                        "entity_id": { 
                            "type": "integer" 
                        },
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
                "type": "multi_field", 
                    "fields" : { 
                        "cell_id": { 
                            "type": "integer" 
                        },
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
            "pointfive_cell_id": {
                "type": "multi_field", 
                    "fields" : { 
                        "centi_cell_id": { 
                            "type": "integer" 
                        },
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
            "location_pointfive_cell" : {
                "type" : "geo_point"
            },
            "count": {"type" : "integer"}
        }
    }
}'

curl -XPUT 'http://localhost:9200/sibexplorer/pointtwo_cell_density/_mapping' -d '
{
    "pointtwo_cell_density" :  { 
        "properties": {
            "type": {
                "type": "multi_field", 
                    "fields" : { 
                        "type": { 
                            "type": "integer" 
                        },
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
                "type": "multi_field", 
                    "fields" : { 
                        "entity_id": { 
                            "type": "integer" 
                        },
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
                "type": "multi_field", 
                    "fields" : { 
                        "cell_id": { 
                            "type": "integer" 
                        },
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
                "type": "multi_field", 
                    "fields" : { 
                        "centi_cell_id": { 
                            "type": "integer" 
                        },
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
            "location_pointtwo_cell" : {
                "type" : "geo_point"
            },
            "count": {"type" : "integer"}
        }
    }
}'

curl -XPUT 'http://localhost:9200/sibexplorer/occurrences/_mapping' -d '
{
    "occurrences" :  { 
        "properties": {
        	"id": {
                "type": "multi_field", 
                    "fields" : { 
                        "id": { 
                            "type": "integer" 
                        },
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
            "canonical" :  {
                "type": "multi_field", 
                    "fields" : { 
                        "canonical": { 
                            "type": "string" 
                        },
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
            "data_provider_name" :  {
                "type": "multi_field", 
                    "fields" : { 
                        "data_provider_name": { 
                            "type": "string" 
                        },
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
            "data_resource_name" :  {
                "type": "multi_field", 
                    "fields" : { 
                        "data_resource_name": { 
                            "type": "string" 
                        },
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
            "institution_code" :  {
                "type": "multi_field", 
                    "fields" : { 
                        "institution_code": { 
                            "type": "string" 
                        },
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
            "collection_code" :  {
                "type": "multi_field", 
                    "fields" : { 
                        "collection_code": { 
                            "type": "string" 
                        },
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
            "catalogue_number" :  {
                "type": "multi_field", 
                    "fields" : { 
                        "catalogue_number": { 
                            "type": "string" 
                        },
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
            "iso_country_code" :  {
                "type": "multi_field", 
                    "fields" : { 
                        "iso_country_code": { 
                            "type": "string" 
                        },
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
            "iso_department_code" :  {
                "type": "multi_field", 
                    "fields" : { 
                        "iso_department_code": { 
                            "type": "string" 
                        },
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
            "kingdom" :  {
                "type": "multi_field", 
                    "fields" : { 
                        "kingdom": { 
                            "type": "string" 
                        },
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
            "phylum" :  {
                "type": "multi_field", 
                    "fields" : { 
                        "phylum": { 
                            "type": "string" 
                        },
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
            "taxonClass" :  {
                "type": "multi_field", 
                    "fields" : { 
                        "taxonClass": { 
                            "type": "string" 
                        },
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
            "order_rank" :  {
                "type": "multi_field", 
                    "fields" : { 
                        "order_rank": { 
                            "type": "string" 
                        },
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
            "family" :  {
                "type": "multi_field", 
                    "fields" : { 
                        "family": { 
                            "type": "string" 
                        },
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
            "genus" :  {
                "type": "multi_field", 
                    "fields" : { 
                        "genus": { 
                            "type": "string" 
                        },
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
            "species" :  {
                "type": "multi_field", 
                    "fields" : { 
                        "species": { 
                            "type": "string" 
                        },
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
            "kingdom_group" :  {
                "type": "multi_field", 
                    "fields" : { 
                        "kingdom_group": { 
                            "type": "string" 
                        },
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
            "phylum_group" :  {
                "type": "multi_field", 
                    "fields" : { 
                        "phylum_group": { 
                            "type": "string" 
                        },
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
            "taxonClass_group" :  {
                "type": "multi_field", 
                    "fields" : { 
                        "taxonClass_group": { 
                            "type": "string" 
                        },
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
            "order_rank_group" :  {
                "type": "multi_field", 
                    "fields" : { 
                        "order_rank_group": { 
                            "type": "string" 
                        },
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
            "family_group" :  {
                "type": "multi_field", 
                    "fields" : { 
                        "family_group": { 
                            "type": "string" 
                        },
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
            "genus_group" :  {
                "type": "multi_field", 
                    "fields" : { 
                        "genus_group": { 
                            "type": "string" 
                        },
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
            "species_group" :  {
                "type": "multi_field", 
                    "fields" : { 
                        "species_group": { 
                            "type": "string" 
                        },
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
            "pointfive_group" :  {
                "type": "multi_field", 
                    "fields" : { 
                        "pointfive_group": { 
                            "type": "string" 
                        },
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
            "pointtwo_group" :  {
                "type": "multi_field", 
                    "fields" : { 
                        "pointtwo_group": { 
                            "type": "string" 
                        },
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
            "centi_group" :  {
                "type": "multi_field", 
                    "fields" : { 
                        "centi_group": { 
                            "type": "string" 
                        },
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
            "cell_group" :  {
                "type": "multi_field", 
                    "fields" : { 
                        "cell_group": { 
                            "type": "string" 
                        },
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
            "country_name" :  {
                "type": "multi_field", 
                    "fields" : { 
                        "country_name": { 
                            "type": "string" 
                        },
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
            "department_name" :  {
                "type": "multi_field", 
                    "fields" : { 
                        "department_name": { 
                            "type": "string" 
                        },
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
            "basis_of_record_name" :  {
                "type": "multi_field", 
                    "fields" : { 
                        "basis_of_record_name": { 
                            "type": "string" 
                        },
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
            "basis_of_record_name_spanish" :  {
                "type": "multi_field", 
                    "fields" : { 
                        "basis_of_record_name_spanish": { 
                            "type": "string" 
                        },
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
            "location" : {
                "type" : "geo_point"
            },
            "location_cell" : {
                "type" : "geo_point"
            },
            "location_centi_cell" : {
                "type" : "geo_point"
            },
            "location_pointfive_cell" : {
                "type" : "geo_point"
            },
            "location_pointtwo_cell" : {
                "type" : "geo_point"
            }
        }
    }
}'

curl -XPUT 'http://localhost:9200/sibexplorer/geooccurrences/_mapping' -d '
{
    "geooccurrences" : {
        "properties" : {
        	"id": {
                "type": "multi_field", 
                    "fields" : { 
                        "id": { 
                            "type": "integer" 
                        },
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
        	"num_occurrences": {"type" : "integer"},
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
            "cell_id": {"type" : "integer"},
            "centi_cell_id": {"type" : "integer"},
            "pointfive_cell_id": {"type" : "integer"},
            "pointtwo_cell_id": {"type" : "integer"},
            "mod360_cell_id": {"type" : "integer"},
            "canonical" :  {
                "type": "multi_field", 
                    "fields" : { 
                        "canonical": { 
                            "type": "string" 
                        },
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
            "data_provider_name" :  {
                "type": "multi_field", 
                    "fields" : { 
                        "data_provider_name": { 
                            "type": "string" 
                        },
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
            "data_resource_name" :  {
                "type": "multi_field", 
                    "fields" : { 
                        "data_resource_name": { 
                            "type": "string" 
                        },
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
            "institution_code" :  {
                "type": "multi_field", 
                    "fields" : { 
                        "institution_code": { 
                            "type": "string" 
                        },
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
            "collection_code" :  {
                "type": "multi_field", 
                    "fields" : { 
                        "collection_code": { 
                            "type": "string" 
                        },
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
            "catalogue_number" :  {
                "type": "multi_field", 
                    "fields" : { 
                        "catalogue_number": { 
                            "type": "string" 
                        },
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
            "iso_country_code" :  {
                "type": "multi_field", 
                    "fields" : { 
                        "iso_country_code": { 
                            "type": "string" 
                        },
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
            "iso_department_code" :  {
                "type": "multi_field", 
                    "fields" : { 
                        "iso_department_code": { 
                            "type": "string" 
                        },
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
            "country_name" :  {
                "type": "multi_field", 
                    "fields" : { 
                        "country_name": { 
                            "type": "string" 
                        },
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
            "department_name" :  {
                "type": "multi_field", 
                    "fields" : { 
                        "department_name": { 
                            "type": "string" 
                        },
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
            "location" : {
                "type" : "geo_point"
            },
            "location_cell" : {
                "type" : "geo_point"
            },
            "location_centi_cell" : {
                "type" : "geo_point"
            },
            "location_pointfive_cell" : {
                "type" : "geo_point"
            },
            "location_pointtwo_cell" : {
                "type" : "geo_point"
            }
        }
    }
}'