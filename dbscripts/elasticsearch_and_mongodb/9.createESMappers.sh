curl -XPUT 'http://localhost:9200/sibexplorer'

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
                "type" : "geo_point",
                "fielddata" : {
                    "format" : "compressed",
                    "precision" : "1cm"
                }
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
                "type" : "geo_point",
                "fielddata" : {
                    "format" : "compressed",
                    "precision" : "1cm"
                }
            },
            "location_centi_cell" : {
                "type" : "geo_point",
                "fielddata" : {
                    "format" : "compressed",
                    "precision" : "1cm"
                }
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
                "type" : "geo_point",
                "fielddata" : {
                    "format" : "compressed",
                    "precision" : "1cm"
                }
            },
            "location_pointfive_cell" : {
                "type" : "geo_point",
                "fielddata" : {
                    "format" : "compressed",
                    "precision" : "1cm"
                }
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
          },
          "spanish": {
            "type": "string",
            "analyzer": "spanish_analyzer"
          }
        }
      },
      "nombre_comun" :  {
        "type": "multi_field",
        "fields" : {
          "nombre_comun": {
            "type": "string"
          },
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
          },
          "spanish": {
            "type": "string",
            "analyzer": "spanish_analyzer"
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
          },
          "spanish": {
            "type": "string",
            "analyzer": "spanish_analyzer"
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
          },
          "spanish": {
            "type": "string",
            "analyzer": "spanish_analyzer"
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
          },
          "spanish": {
            "type": "string",
            "analyzer": "spanish_analyzer"
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
          },
          "spanish": {
            "type": "string",
            "analyzer": "spanish_analyzer"
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
          },
          "spanish": {
            "type": "string",
            "analyzer": "spanish_analyzer"
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
          },
          "spanish": {
            "type": "string",
            "analyzer": "spanish_analyzer"
          }
        }
      },
      "iso_county_code" :  {
        "type": "multi_field",
        "fields" : {
          "iso_county_code": {
            "type": "string"
          },
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
        "type": "multi_field",
        "fields" : {
          "paramo_code": {
            "type": "string"
          },
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
        "type": "multi_field",
        "fields" : {
          "marine_zone_code": {
            "type": "string"
          },
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
          },
          "spanish": {
            "type": "string",
            "analyzer": "spanish_analyzer"
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
          },
          "spanish": {
            "type": "string",
            "analyzer": "spanish_analyzer"
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
          },
          "spanish": {
            "type": "string",
            "analyzer": "spanish_analyzer"
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
          },
          "spanish": {
            "type": "string",
            "analyzer": "spanish_analyzer"
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
          },
          "spanish": {
            "type": "string",
            "analyzer": "spanish_analyzer"
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
          },
          "spanish": {
            "type": "string",
            "analyzer": "spanish_analyzer"
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
          },
          "spanish": {
            "type": "string",
            "analyzer": "spanish_analyzer"
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
          },
          "spanish": {
            "type": "string",
            "analyzer": "spanish_analyzer"
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
          },
          "spanish": {
            "type": "string",
            "analyzer": "spanish_analyzer"
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
          },
          "spanish": {
            "type": "string",
            "analyzer": "spanish_analyzer"
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
          },
          "spanish": {
            "type": "string",
            "analyzer": "spanish_analyzer"
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
          },
          "spanish": {
            "type": "string",
            "analyzer": "spanish_analyzer"
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
          },
          "spanish": {
            "type": "string",
            "analyzer": "spanish_analyzer"
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
          },
          "spanish": {
            "type": "string",
            "analyzer": "spanish_analyzer"
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
          },
          "spanish": {
            "type": "string",
            "analyzer": "spanish_analyzer"
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
          },
          "spanish": {
            "type": "string",
            "analyzer": "spanish_analyzer"
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
          },
          "spanish": {
            "type": "string",
            "analyzer": "spanish_analyzer"
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
          },
          "spanish": {
            "type": "string",
            "analyzer": "spanish_analyzer"
          }
        }
      },
      "county_group" :  {
        "type": "multi_field",
        "fields" : {
          "county_group": {
            "type": "string"
          },
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
        "type": "multi_field",
        "fields" : {
          "paramo_group": {
            "type": "string"
          },
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
        "type": "multi_field",
        "fields" : {
          "marine_zone_group": {
            "type": "string"
          },
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
          },
          "spanish": {
            "type": "string",
            "analyzer": "spanish_analyzer"
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
          },
          "spanish": {
            "type": "string",
            "analyzer": "spanish_analyzer"
          }
        }
      },
      "county_name" :  {
        "type": "multi_field",
        "fields" : {
          "county_name": {
            "type": "string"
          },
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
        "type": "multi_field",
        "fields" : {
          "paramo_name": {
            "type": "string"
          },
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
        "type": "multi_field",
        "fields" : {
          "marine_zone_name": {
            "type": "string"
          },
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
          },
          "spanish": {
            "type": "string",
            "analyzer": "spanish_analyzer"
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
          },
          "spanish": {
            "type": "string",
            "analyzer": "spanish_analyzer"
          }
        }
      },
      "location" : {
        "type" : "geo_point",
        "lat_lon": true
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
      },
      "common_names": {
        "type": "nested",
        "properties": {
          "name": {
            "type": "multi_field",
            "fields" : {
              "name": {
                "type": "string"
              },
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
            "type": "multi_field",
            "fields" : {
              "transliteration": {
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
          "iso_language_code": {
            "type": "multi_field",
            "fields" : {
              "iso_language_code": {
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
          "iso_country_code": {
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
          "language_name": {
            "type": "multi_field",
            "fields" : {
              "language_name": {
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
