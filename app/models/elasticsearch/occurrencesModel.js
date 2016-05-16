var moment = require('moment');
var _ = require('underscore');

var databaseSearchMapping = {};
databaseSearchMapping["id"] = "id";
databaseSearchMapping["canonical"] = "canonical.exactWords";
databaseSearchMapping["data_resource_name"] = "resource.name.exactWords";
databaseSearchMapping["institution_code"] = "institution.code.exactWords";
databaseSearchMapping["collection_code"] = "collection.code.exactWords";
databaseSearchMapping["catalogue_number"] = "catalogue.number.exactWords";
databaseSearchMapping["basis_of_record_name_spanish"] = "basis_of_record.name_spanish.exactWords";
databaseSearchMapping["country_name"] = "country_name.exactWords";
databaseSearchMapping["department_name"] = "department_name.exactWords";

var databaseOrderMapping = {};
databaseOrderMapping["id"] = "id";
databaseOrderMapping["occurrence_date"] = "occurrence_date";
databaseOrderMapping["canonical"] = "canonical.untouched";
databaseOrderMapping["data_resource_name"] = "resource.name.untouched";
databaseOrderMapping["institution_code"] = "institution.code.untouched";
databaseOrderMapping["collection_code"] = "collection.code.untouched";
databaseOrderMapping["catalogue_number"] = "catalogue.number.untouched";
databaseOrderMapping["basis_of_record_name_spanish"] = "basis_of_record.name_spanish.untouched";
databaseOrderMapping["country_name"] = "country_name.untouched";
databaseOrderMapping["department_name"] = "department_name.untouched";

exports.getOccurrencesInBoundingBox = function(top, bottom, left, right, conditions) {
	var qryObj = {
		"_source": ["location", "canonical", "id"],
		"size": 1000000,
		"query": {
			"filtered" : {
				"query" : {
					"bool": {
						"must": []
					}
				},
				"filter": {
					"bool": {
						"must": [
							{
								"missing": {
									"field": "deleted"
								}
							},
							{
								"term": {
									"geospatial_issue": 0
								}
							},
							{
								"geo_bounding_box": {
									"location": {
										"top_left" : {
											"lat": top,
											"lon": left
										},
										"bottom_right" : {
											"lat": bottom,
											"lon": right
										}
									}
								}
							}
						]
					}
				}
			}
		}
	};

	var andCounter = 0;
	var orCounter = 0;

	if(conditions.scientificNames) {
		qryObj["query"]["filtered"]["query"]["bool"]["must"][andCounter] = {};
		qryObj["query"]["filtered"]["query"]["bool"]["must"][andCounter]["bool"] = {};
		qryObj["query"]["filtered"]["query"]["bool"]["must"][andCounter]["bool"]["should"] = [];
		_.each(conditions.scientificNames, function(data) {
			qryObj["query"]["filtered"]["query"]["bool"]["must"][andCounter]["bool"]["should"][orCounter] = {};
			qryObj["query"]["filtered"]["query"]["bool"]["must"][andCounter]["bool"]["should"][orCounter]["wildcard"] = {};
			qryObj["query"]["filtered"]["query"]["bool"]["must"][andCounter]["bool"]["should"][orCounter]["wildcard"]["canonical.exactWords"] = data.textObject.toLowerCase();
			orCounter+=1;
		});
		andCounter+=1;
	}
	if(conditions.commonNames) {
		qryObj["query"]["filtered"]["query"]["bool"]["must"][andCounter] = {};
		qryObj["query"]["filtered"]["query"]["bool"]["must"][andCounter]["nested"] = {};
		qryObj["query"]["filtered"]["query"]["bool"]["must"][andCounter]["nested"]["path"] = "common_names";
		qryObj["query"]["filtered"]["query"]["bool"]["must"][andCounter]["nested"]["query"] = {};
		qryObj["query"]["filtered"]["query"]["bool"]["must"][andCounter]["nested"]["query"]["bool"] = {};
		qryObj["query"]["filtered"]["query"]["bool"]["must"][andCounter]["nested"]["query"]["bool"]["should"] = [];
		_.each(conditions.commonNames, function(data) {
			qryObj["query"]["filtered"]["query"]["bool"]["must"][andCounter]["nested"]["query"]["bool"]["should"][orCounter] = {};
			qryObj["query"]["filtered"]["query"]["bool"]["must"][andCounter]["nested"]["query"]["bool"]["should"][orCounter]["wildcard"] = {};
			qryObj["query"]["filtered"]["query"]["bool"]["must"][andCounter]["nested"]["query"]["bool"]["should"][orCounter]["wildcard"]["common_names.name.exactWords"] = data.textObject.toLowerCase();
			orCounter+=1;
		});
		andCounter+=1;
	}
	if(conditions.taxons) {
		orCounter = 0;
		qryObj["query"]["filtered"]["query"]["bool"]["must"][andCounter] = {};
		qryObj["query"]["filtered"]["query"]["bool"]["must"][andCounter]["bool"] = {};
		qryObj["query"]["filtered"]["query"]["bool"]["must"][andCounter]["bool"]["should"] = [];
		_.each(conditions.taxons, function(data) {
			qryObj["query"]["filtered"]["query"]["bool"]["must"][andCounter]["bool"]["should"][orCounter] = {};
			qryObj["query"]["filtered"]["query"]["bool"]["must"][andCounter]["bool"]["should"][orCounter]["wildcard"] = {};
			if(data.textName == "kingdom")
				qryObj["query"]["filtered"]["query"]["bool"]["must"][andCounter]["bool"]["should"][orCounter]["wildcard"]["taxonomy.kingdom_name.exactWords"] = data.textObject.toLowerCase();
			if(data.textName == "phylum")
				qryObj["query"]["filtered"]["query"]["bool"]["must"][andCounter]["bool"]["should"][orCounter]["wildcard"]["taxonomy.phylum_name.exactWords"] = data.textObject.toLowerCase();
			if(data.textName == "class")
				qryObj["query"]["filtered"]["query"]["bool"]["must"][andCounter]["bool"]["should"][orCounter]["wildcard"]["taxonomy.class_name.exactWords"] = data.textObject.toLowerCase();
			if(data.textName == "order")
				qryObj["query"]["filtered"]["query"]["bool"]["must"][andCounter]["bool"]["should"][orCounter]["wildcard"]["taxonomy.order_name.exactWords"] = data.textObject.toLowerCase();
			if(data.textName == "family")
				qryObj["query"]["filtered"]["query"]["bool"]["must"][andCounter]["bool"]["should"][orCounter]["wildcard"]["taxonomy.family_name.exactWords"] = data.textObject.toLowerCase();
			if(data.textName == "genus")
				qryObj["query"]["filtered"]["query"]["bool"]["must"][andCounter]["bool"]["should"][orCounter]["wildcard"]["taxonomy.genus_name.exactWords"] = data.textObject.toLowerCase();
			if(data.textName == "species")
				qryObj["query"]["filtered"]["query"]["bool"]["must"][andCounter]["bool"]["should"][orCounter]["wildcard"]["taxonomy.species_name.exactWords"] = data.textObject.toLowerCase();
			orCounter+=1;
		});
		andCounter+=1;
	}
	if(conditions.countries) {
		orCounter = 0;
		qryObj["query"]["filtered"]["query"]["bool"]["must"][andCounter] = {};
		qryObj["query"]["filtered"]["query"]["bool"]["must"][andCounter]["bool"] = {};
		qryObj["query"]["filtered"]["query"]["bool"]["must"][andCounter]["bool"]["should"] = [];
		_.each(conditions.countries, function(data) {
			qryObj["query"]["filtered"]["query"]["bool"]["must"][andCounter]["bool"]["should"][orCounter] = {};
			qryObj["query"]["filtered"]["query"]["bool"]["must"][andCounter]["bool"]["should"][orCounter]["wildcard"] = {};
			qryObj["query"]["filtered"]["query"]["bool"]["must"][andCounter]["bool"]["should"][orCounter]["wildcard"]["iso_country_code.exactWords"] = data.textObject.toLowerCase();
			orCounter+=1;
		});
		andCounter+=1;
	}
	if(conditions.departments) {
		orCounter = 0;
		qryObj["query"]["filtered"]["query"]["bool"]["must"][andCounter] = {};
		qryObj["query"]["filtered"]["query"]["bool"]["must"][andCounter]["bool"] = {};
		qryObj["query"]["filtered"]["query"]["bool"]["must"][andCounter]["bool"]["should"] = [];
		_.each(conditions.departments, function(data) {
			qryObj["query"]["filtered"]["query"]["bool"]["must"][andCounter]["bool"]["should"][orCounter] = {};
			qryObj["query"]["filtered"]["query"]["bool"]["must"][andCounter]["bool"]["should"][orCounter]["wildcard"] = {};
			qryObj["query"]["filtered"]["query"]["bool"]["must"][andCounter]["bool"]["should"][orCounter]["wildcard"]["iso_department_code.exactWords"] = data.textObject.toLowerCase();
			orCounter+=1;
		});
		andCounter+=1;
	}
	if(conditions.counties) {
		orCounter = 0;
		qryObj["query"]["filtered"]["query"]["bool"]["must"][andCounter] = {};
		qryObj["query"]["filtered"]["query"]["bool"]["must"][andCounter]["bool"] = {};
		qryObj["query"]["filtered"]["query"]["bool"]["must"][andCounter]["bool"]["should"] = [];
		_.each(conditions.counties, function(data) {
			qryObj["query"]["filtered"]["query"]["bool"]["must"][andCounter]["bool"]["should"][orCounter] = {};
			qryObj["query"]["filtered"]["query"]["bool"]["must"][andCounter]["bool"]["should"][orCounter]["wildcard"] = {};
			qryObj["query"]["filtered"]["query"]["bool"]["must"][andCounter]["bool"]["should"][orCounter]["wildcard"]["iso_county_code.exactWords"] = data.textObject.toLowerCase();
			orCounter+=1;
		});
		andCounter+=1;
	}
	if(conditions.paramos) {
		orCounter = 0;
		qryObj["query"]["filtered"]["query"]["bool"]["must"][andCounter] = {};
		qryObj["query"]["filtered"]["query"]["bool"]["must"][andCounter]["bool"] = {};
		qryObj["query"]["filtered"]["query"]["bool"]["must"][andCounter]["bool"]["should"] = [];
		_.each(conditions.paramos, function(data) {
			qryObj["query"]["filtered"]["query"]["bool"]["must"][andCounter]["bool"]["should"][orCounter] = {};
			qryObj["query"]["filtered"]["query"]["bool"]["must"][andCounter]["bool"]["should"][orCounter]["wildcard"] = {};
			qryObj["query"]["filtered"]["query"]["bool"]["must"][andCounter]["bool"]["should"][orCounter]["wildcard"]["paramo_code.exactWords"] = data.textObject.toLowerCase();
			orCounter+=1;
		});
		andCounter+=1;
	}
	if(conditions.marineZones) {
		orCounter = 0;
		qryObj["query"]["filtered"]["query"]["bool"]["must"][andCounter] = {};
		qryObj["query"]["filtered"]["query"]["bool"]["must"][andCounter]["bool"] = {};
		qryObj["query"]["filtered"]["query"]["bool"]["must"][andCounter]["bool"]["should"] = [];
		_.each(conditions.marineZones, function(data) {
			qryObj["query"]["filtered"]["query"]["bool"]["must"][andCounter]["bool"]["should"][orCounter] = {};
			qryObj["query"]["filtered"]["query"]["bool"]["must"][andCounter]["bool"]["should"][orCounter]["wildcard"] = {};
			qryObj["query"]["filtered"]["query"]["bool"]["must"][andCounter]["bool"]["should"][orCounter]["wildcard"]["marine_zone_code.exactWords"] = data.textObject.toLowerCase();
			orCounter+=1;
		});
		andCounter+=1;
	}
	if(conditions.latitudes) {
		orCounter = 0;
		qryObj["query"]["filtered"]["query"]["bool"]["must"][andCounter] = {};
		qryObj["query"]["filtered"]["query"]["bool"]["must"][andCounter]["bool"] = {};
		qryObj["query"]["filtered"]["query"]["bool"]["must"][andCounter]["bool"]["must"] = [];
		_.each(conditions.latitudes, function(data) {
			qryObj["query"]["filtered"]["query"]["bool"]["must"][andCounter]["bool"]["must"][orCounter] = {};
			if(data.predicate == "eq") {
				qryObj["query"]["filtered"]["query"]["bool"]["must"][andCounter]["bool"]["must"][orCounter]["range"] = {};
				qryObj["query"]["filtered"]["query"]["bool"]["must"][andCounter]["bool"]["must"][orCounter]["range"]["location.lat"] = {};
				qryObj["query"]["filtered"]["query"]["bool"]["must"][andCounter]["bool"]["must"][orCounter]["range"]["location.lat"]["gte"] = data.textObject.toLowerCase();
				qryObj["query"]["filtered"]["query"]["bool"]["must"][andCounter]["bool"]["must"][orCounter]["range"]["location.lat"]["lte"] = data.textObject.toLowerCase();
			} else if(data.predicate == "gt") {
				qryObj["query"]["filtered"]["query"]["bool"]["must"][andCounter]["bool"]["must"][orCounter]["range"] = {};
				qryObj["query"]["filtered"]["query"]["bool"]["must"][andCounter]["bool"]["must"][orCounter]["range"]["location.lat"] = {};
				qryObj["query"]["filtered"]["query"]["bool"]["must"][andCounter]["bool"]["must"][orCounter]["range"]["location.lat"]["gt"] = data.textObject.toLowerCase();
			} else if(data.predicate == "lt") {
				qryObj["query"]["filtered"]["query"]["bool"]["must"][andCounter]["bool"]["must"][orCounter]["range"] = {};
				qryObj["query"]["filtered"]["query"]["bool"]["must"][andCounter]["bool"]["must"][orCounter]["range"]["location.lat"] = {};
				qryObj["query"]["filtered"]["query"]["bool"]["must"][andCounter]["bool"]["must"][orCounter]["range"]["location.lat"]["lt"] = data.textObject.toLowerCase();
			}
			orCounter+=1;
		});
		andCounter+=1;
	}
	if(conditions.longitudes) {
		orCounter = 0;
		qryObj["query"]["filtered"]["query"]["bool"]["must"][andCounter] = {};
		qryObj["query"]["filtered"]["query"]["bool"]["must"][andCounter]["bool"] = {};
		qryObj["query"]["filtered"]["query"]["bool"]["must"][andCounter]["bool"]["must"] = [];
		_.each(conditions.longitudes, function(data) {
			qryObj["query"]["filtered"]["query"]["bool"]["must"][andCounter]["bool"]["must"][orCounter] = {};
			if(data.predicate == "eq") {
				qryObj["query"]["filtered"]["query"]["bool"]["must"][andCounter]["bool"]["must"][orCounter]["range"] = {};
				qryObj["query"]["filtered"]["query"]["bool"]["must"][andCounter]["bool"]["must"][orCounter]["range"]["location.lon"] = {};
				qryObj["query"]["filtered"]["query"]["bool"]["must"][andCounter]["bool"]["must"][orCounter]["range"]["location.lon"]["gte"] = data.textObject.toLowerCase();
				qryObj["query"]["filtered"]["query"]["bool"]["must"][andCounter]["bool"]["must"][orCounter]["range"]["location.lon"]["lte"] = data.textObject.toLowerCase();
			} else if(data.predicate == "gt") {
				qryObj["query"]["filtered"]["query"]["bool"]["must"][andCounter]["bool"]["must"][orCounter]["range"] = {};
				qryObj["query"]["filtered"]["query"]["bool"]["must"][andCounter]["bool"]["must"][orCounter]["range"]["location.lon"] = {};
				qryObj["query"]["filtered"]["query"]["bool"]["must"][andCounter]["bool"]["must"][orCounter]["range"]["location.lon"]["gt"] = data.textObject.toLowerCase();
			} else if(data.predicate == "lt") {
				qryObj["query"]["filtered"]["query"]["bool"]["must"][andCounter]["bool"]["must"][orCounter]["range"] = {};
				qryObj["query"]["filtered"]["query"]["bool"]["must"][andCounter]["bool"]["must"][orCounter]["range"]["location.lon"] = {};
				qryObj["query"]["filtered"]["query"]["bool"]["must"][andCounter]["bool"]["must"][orCounter]["range"]["location.lon"]["lt"] = data.textObject.toLowerCase();
			}
			orCounter+=1;
		});
		andCounter+=1;
	}
	if(conditions.altitudes) {
		orCounter = 0;
		qryObj["query"]["filtered"]["query"]["bool"]["must"][andCounter] = {};
		qryObj["query"]["filtered"]["query"]["bool"]["must"][andCounter]["bool"] = {};
		qryObj["query"]["filtered"]["query"]["bool"]["must"][andCounter]["bool"]["must"] = [];
		_.each(conditions.altitudes, function(data) {
			qryObj["query"]["filtered"]["query"]["bool"]["must"][andCounter]["bool"]["must"][orCounter] = {};
			if(data.predicate == "eq") {
				qryObj["query"]["filtered"]["query"]["bool"]["must"][andCounter]["bool"]["must"][orCounter]["range"] = {};
				qryObj["query"]["filtered"]["query"]["bool"]["must"][andCounter]["bool"]["must"][orCounter]["range"]["altitude_meters"] = {};
				qryObj["query"]["filtered"]["query"]["bool"]["must"][andCounter]["bool"]["must"][orCounter]["range"]["altitude_meters"]["gte"] = data.textObject.toLowerCase();
				qryObj["query"]["filtered"]["query"]["bool"]["must"][andCounter]["bool"]["must"][orCounter]["range"]["altitude_metres"]["lte"] = data.textObject.toLowerCase();
			} else if(data.predicate == "gt") {
				qryObj["query"]["filtered"]["query"]["bool"]["must"][andCounter]["bool"]["must"][orCounter]["range"] = {};
				qryObj["query"]["filtered"]["query"]["bool"]["must"][andCounter]["bool"]["must"][orCounter]["range"]["altitude_meters"] = {};
				qryObj["query"]["filtered"]["query"]["bool"]["must"][andCounter]["bool"]["must"][orCounter]["range"]["altitude_meters"]["gt"] = data.textObject.toLowerCase();
			} else if(data.predicate == "lt") {
				qryObj["query"]["filtered"]["query"]["bool"]["must"][andCounter]["bool"]["must"][orCounter]["range"] = {};
				qryObj["query"]["filtered"]["query"]["bool"]["must"][andCounter]["bool"]["must"][orCounter]["range"]["altitude_meters"] = {};
				qryObj["query"]["filtered"]["query"]["bool"]["must"][andCounter]["bool"]["must"][orCounter]["range"]["altitude_meters"]["lt"] = data.textObject.toLowerCase();
			}
			orCounter+=1;
		});
		andCounter+=1;
	}
	if(conditions.deeps) {
		orCounter = 0;
		qryObj["query"]["filtered"]["query"]["bool"]["must"][andCounter] = {};
		qryObj["query"]["filtered"]["query"]["bool"]["must"][andCounter]["bool"] = {};
		qryObj["query"]["filtered"]["query"]["bool"]["must"][andCounter]["bool"]["must"] = [];
		_.each(conditions.deeps, function(data) {
			qryObj["query"]["filtered"]["query"]["bool"]["must"][andCounter]["bool"]["must"][orCounter] = {};
			if(data.predicate == "eq") {
				qryObj["query"]["filtered"]["query"]["bool"]["must"][andCounter]["bool"]["must"][orCounter]["range"] = {};
				qryObj["query"]["filtered"]["query"]["bool"]["must"][andCounter]["bool"]["must"][orCounter]["range"]["depth_centimeters"] = {};
				qryObj["query"]["filtered"]["query"]["bool"]["must"][andCounter]["bool"]["must"][orCounter]["range"]["depth_centimeters"]["gte"] = data.textObject.toLowerCase();
				qryObj["query"]["filtered"]["query"]["bool"]["must"][andCounter]["bool"]["must"][orCounter]["range"]["depth_centimeters"]["lte"] = data.textObject.toLowerCase();
			} else if(data.predicate == "gt") {
				qryObj["query"]["filtered"]["query"]["bool"]["must"][andCounter]["bool"]["must"][orCounter]["range"] = {};
				qryObj["query"]["filtered"]["query"]["bool"]["must"][andCounter]["bool"]["must"][orCounter]["range"]["depth_centimeters"] = {};
				qryObj["query"]["filtered"]["query"]["bool"]["must"][andCounter]["bool"]["must"][orCounter]["range"]["depth_centimeters"]["gt"] = data.textObject.toLowerCase();
			} else if(data.predicate == "lt") {
				qryObj["query"]["filtered"]["query"]["bool"]["must"][andCounter]["bool"]["must"][orCounter]["range"] = {};
				qryObj["query"]["filtered"]["query"]["bool"]["must"][andCounter]["bool"]["must"][orCounter]["range"]["depth_centimeters"] = {};
				qryObj["query"]["filtered"]["query"]["bool"]["must"][andCounter]["bool"]["must"][orCounter]["range"]["depth_centimeters"]["lt"] = data.textObject.toLowerCase();
			}
			orCounter+=1;
		});
		andCounter+=1;
	}
	if(conditions.providers) {
		orCounter = 0;
		qryObj["query"]["filtered"]["query"]["bool"]["must"][andCounter] = {};
		qryObj["query"]["filtered"]["query"]["bool"]["must"][andCounter]["bool"] = {};
		qryObj["query"]["filtered"]["query"]["bool"]["must"][andCounter]["bool"]["should"] = [];
		_.each(conditions.providers, function(data) {
			qryObj["query"]["filtered"]["query"]["bool"]["must"][andCounter]["bool"]["should"][orCounter] = {};
			qryObj["query"]["filtered"]["query"]["bool"]["must"][andCounter]["bool"]["should"][orCounter]["wildcard"] = {};
			qryObj["query"]["filtered"]["query"]["bool"]["must"][andCounter]["bool"]["should"][orCounter]["wildcard"]["provider.name.exactWords"] = data.textObject.toLowerCase();
			orCounter+=1;
		});
		andCounter+=1;
	}
	if(conditions.resources) {
		orCounter = 0;
		qryObj["query"]["filtered"]["query"]["bool"]["must"][andCounter] = {};
		qryObj["query"]["filtered"]["query"]["bool"]["must"][andCounter]["bool"] = {};
		qryObj["query"]["filtered"]["query"]["bool"]["must"][andCounter]["bool"]["should"] = [];
		_.each(conditions.resources, function(data) {
			qryObj["query"]["filtered"]["query"]["bool"]["must"][andCounter]["bool"]["should"][orCounter] = {};
			qryObj["query"]["filtered"]["query"]["bool"]["must"][andCounter]["bool"]["should"][orCounter]["wildcard"] = {};
			qryObj["query"]["filtered"]["query"]["bool"]["must"][andCounter]["bool"]["should"][orCounter]["wildcard"]["resource.name.exactWords"] = data.textObject.toLowerCase();
			orCounter+=1;
		});
		andCounter+=1;
	}
	if(conditions.poligonalCoordinates || conditions.radialCoordinates) {
		if(conditions.poligonalCoordinates) {
			orCounter = 0;
			qryObj["query"]["filtered"]["filter"]["bool"]["must"][3] = {};
			qryObj["query"]["filtered"]["filter"]["bool"]["must"][3]["geo_polygon"] = {};
			qryObj["query"]["filtered"]["filter"]["bool"]["must"][3]["geo_polygon"]["location"] = {};
			qryObj["query"]["filtered"]["filter"]["bool"]["must"][3]["geo_polygon"]["location"]["points"] = [];
			_.each(conditions.poligonalCoordinates, function(data) {
				qryObj["query"]["filtered"]["filter"]["bool"]["must"][3]["geo_polygon"]["location"]["points"][orCounter] = {"lat": data.lat, "lon": data.lng};
				orCounter+=1;
			});
		}
		if(conditions.radialCoordinates) {
			qryObj["query"]["filtered"]["filter"]["bool"]["must"][3] = {};
			qryObj["query"]["filtered"]["filter"]["bool"]["must"][3]["geo_distance"] = {};
			_.each(conditions.radialCoordinates, function(data) {
				qryObj["query"]["filtered"]["filter"]["bool"]["must"][3]["geo_distance"]["distance"] = data.radius + "m";
				qryObj["query"]["filtered"]["filter"]["bool"]["must"][3]["geo_distance"]["location"] = {"lat": data.lat, "lon": data.lng};
			});
		}
	}
	if(qryObj["query"]["filtered"]["query"]["bool"]["must"].length === 0) {
		qryObj["query"]["filtered"]["query"]["bool"]["must"][andCounter] = {};
		qryObj["query"]["filtered"]["query"]["bool"]["must"][andCounter]["match_all"] = {};
		andCounter+=1;
	}
	mySearchCall = elasticSearchClient.search('sibexplorer', 'occurrences', qryObj);
	return mySearchCall;
};

exports.getCounties = function() {
	qryObj = {
		"_source": false,
		"query": {
			"filtered": {
				"filter": {
					"bool": {
						"_cache": true,
						"must": [
							{
								"missing": {
									"field": "deleted"
								}
							},
							{
								"term": {
									"geospatial_issue": 0,
									"_cache": true
								}
							},
							{
								"exists": {
									"field": "iso_county_code"
								}
							}
						]
					}
				}
			}
		},
		"aggs": {
			"county_name": {
				"terms": {
					"field": "county_name.untouched",
					"size": 0,
					"order": {
						"_term": "asc"
					}
				},
				"aggs": {
					"iso_county_code": {
						"terms": {
							"field": "iso_county_code.untouched"
						},
						"aggs": {
							"department_name": {
								"terms": {
									"field": "department_name.untouched"
								}
							}
						}
					}
				}
			}
		}
	};

	mySearchCall = elasticSearchClient.search('sibexplorer', 'occurrences', qryObj);
	return mySearchCall;
};

exports.getParamos = function() {
	qryObj = {
		"_source": false,
		"query": {
			"filtered": {
				"filter": {
					"bool": {
						"_cache": true,
						"must": [
							{
								"missing": {
									"field": "deleted"
								}
							},
							{
								"term": {
									"geospatial_issue": 0,
									"_cache": true
								}
							},
							{
								"exists": {
									"field": "paramo_code"
								}
							}
						]
					}
				}
			}
		},
		"aggs": {
			"paramo_name": {
				"terms": {
					"field": "paramo_name.untouched",
					"size": 0,
					"order": {
						"_term": "asc"
					}
				},
				"aggs": {
					"paramo_code": {
						"terms": {
							"field": "paramo_code.untouched"
						}
					}
				}
			}
		}
	};

	mySearchCall = elasticSearchClient.search('sibexplorer', 'occurrences', qryObj);
	return mySearchCall;
};

exports.getMarineZones = function() {
	qryObj = {
		"_source": false,
		"query": {
			"filtered": {
				"filter": {
					"bool": {
						"_cache": true,
						"must": [
							{
								"missing": {
									"field": "deleted"
								}
							},
							{
								"term": {
									"geospatial_issue": 0,
									"_cache": true
								}
							},
							{
								"exists": {
									"field": "marine_zone_code"
								}
							}
						]
					}
				}
			}
		},
		"aggs": {
			"marine_zone_name": {
				"terms": {
					"field": "marine_zone_name.untouched",
					"size": 0,
					"order": {
						"_term": "asc"
					}
				},
				"aggs": {
					"marine_zone_code": {
						"terms": {
							"field": "marine_zone_code.untouched"
						}
					}
				}
			}
		}
	};

	mySearchCall = elasticSearchClient.search('sibexplorer', 'occurrences', qryObj);
	return mySearchCall;
};

exports.getOccurrencesResumeName = function(name, type) {
	qryObj = {
		"_source": false,
		"query": {
			"filtered" : {
				"filter": {
					"bool": {
						"_cache": true,
						"must": [
							{
								"missing": {
									"field": "deleted"
								}
							},
							{
								"term": {
									"geospatial_issue": 0,
									"_cache": true
								}
							}
						]
					}
				}
			}
		},
		"aggs": {
			"canonical": {
				"terms": {
					"field": "canonical.untouched",
					"size" : 10
				}
			},
			"common_names": {
				"nested" : {
					"path" : "common_names"
				},
				"aggs" : {
					"common": {
						"terms": {
							"field": "common_names.name.untouched",
							"size" : 10
						}
					}
				}
			},
			"kingdom": {
				"terms": {
					"field": "taxonomy.kingdom_name.untouched",
					"size" : 10
				},
				"aggs": {
					"id": {
						"terms": {
							"field": "taxonomy.kingdom_id"
						}
					}
				}
			},
			"phylum": {
				"terms": {
					"field": "taxonomy.phylum_name.untouched",
					"size" : 10
				},
				"aggs": {
					"id": {
						"terms": {
							"field": "taxonomy.phylum_id"
						}
					}
				}
			},
			"class": {
				"terms": {
					"field": "taxonomy.class_name.untouched",
					"size" : 10
				},
				"aggs": {
					"id": {
						"terms": {
							"field": "taxonomy.class_id"
						}
					}
				}
			},
			"order": {
				"terms": {
					"field": "taxonomy.order_name.untouched",
					"size" : 10
				},
				"aggs": {
					"id": {
						"terms": {
							"field": "taxonomy.order_id"
						}
					}
				}
			},
			"family": {
				"terms": {
					"field": "taxonomy.family_name.untouched",
					"size" : 10
				},
				"aggs": {
					"id": {
						"terms": {
							"field": "taxonomy.family_id"
						}
					}
				}
			},
			"genus": {
				"terms": {
					"field": "taxonomy.genus_name.untouched",
					"size" : 10
				},
				"aggs": {
					"id": {
						"terms": {
							"field": "taxonomy.genus_id"
						}
					}
				}
			},
			"species": {
				"terms": {
					"field": "taxonomy.species_name.untouched",
					"size" : 10
				},
				"aggs": {
					"id": {
						"terms": {
							"field": "taxonomy.species_id"
						}
					}
				}
			},
			"iso_department_code": {
				"terms": {
					"field": "iso_department_code.untouched",
					"size" : 10
				},
				"aggs": {
					"department_name": {
						"terms": {
							"field": "department_name.untouched"
						}
					}
				}
			},
			"iso_country_code": {
				"terms": {
					"field": "iso_country_code.untouched",
					"size" : 10
				},
				"aggs": {
					"country_name": {
						"terms": {
							"field": "country_name.untouched"
						}
					}
				}
			},
			"iso_county_code": {
				"terms": {
					"field": "iso_county_code.untouched",
					"size" : 10
				},
				"aggs": {
					"county_name": {
						"terms": {
							"field": "county_name.untouched"
						},
						"aggs": {
							"department_name": {
								"terms": {
									"field": "department_name.untouched"
								}
							}
						}
					}
				}
			},
			"paramo_code": {
				"terms": {
					"field": "paramo_code.untouched",
					"size" : 10
				},
				"aggs": {
					"paramo_name": {
						"terms": {
							"field": "paramo_name.untouched"
						}
					}
				}
			},
			"marine_zone_code": {
				"terms": {
					"field": "marine_zone_code.untouched",
					"size" : 10
				},
				"aggs": {
					"marine_zone_name": {
						"terms": {
							"field": "marine_zone_name.untouched"
						}
					}
				}
			},
			"data_provider_id": {
				"terms": {
					"field": "provider.id",
					"size" : 10
				},
				"aggs": {
					"data_provider_name": {
						"terms": {
							"field": "provider.name.untouched"
						}
					}
				}
			},
			"data_resource_id": {
				"terms": {
					"field": "resource.id",
					"size" : 10
				},
				"aggs": {
					"data_provider_id": {
						"terms": {
							"field": "provider.id"
						},
						"aggs": {
							"data_resource_name": {
								"terms": {
									"field": "resource.name.untouched"
								}
							}
						}
					}
				}
			},
			"institution_code_id": {
				"terms": {
					"field": "institution.id",
					"size" : 10
				},
				"aggs": {
					"institution_code": {
						"terms": {
							"field": "institution.code.untouched"
						}
					}
				}
			},
			"collection_code_id": {
				"terms": {
					"field": "collection.id",
					"size" : 10
				},
				"aggs": {
					"collection_code": {
						"terms": {
							"field": "collection.code.untouched"
						}
					}
				}
			}
		}
	};

	//qryObj["query"] = {};
	if(type == "common") {
		qryObj["query"]["filtered"]["query"] = {};
		qryObj["query"]["filtered"]["query"]["nested"] = {};
		qryObj["query"]["filtered"]["query"]["nested"]["path"] = "common_names";
		qryObj["query"]["filtered"]["query"]["nested"]["query"] = {};
		qryObj["query"]["filtered"]["query"]["nested"]["query"]["wildcard"] = {};
	} else {
		//qryObj["query"]["filtered"] = {};
		qryObj["query"]["filtered"]["query"] = {};
		qryObj["query"]["filtered"]["query"]["wildcard"] = {};
	}
	if(type == "scientific") {
		qryObj["query"]["filtered"]["query"]["wildcard"]["canonical.exactWords"] = "*"+ name.toLowerCase() +"*";
	} else if(type == "common") {
		qryObj["query"]["filtered"]["query"]["nested"]["query"]["wildcard"]["common_names.name.exactWords"] = "*"+ name.toLowerCase() +"*";
	} else if(type == "kingdom") {
		qryObj["query"]["filtered"]["query"]["wildcard"]["taxonomy.kingdom_name.exactWords"] = "*"+ name.toLowerCase() +"*";
	} else if(type == "phylum") {
		qryObj["query"]["filtered"]["query"]["wildcard"]["taxonomy.phylum_name.exactWords"] = "*"+ name.toLowerCase() +"*";
	} else if(type == "class") {
		qryObj["query"]["filtered"]["query"]["wildcard"]["taxonomy.class_name.exactWords"] = "*"+ name.toLowerCase() +"*";
	} else if(type == "order") {
		qryObj["query"]["filtered"]["query"]["wildcard"]["taxonomy.order_name.exactWords"] = "*"+ name.toLowerCase() +"*";
	} else if(type == "family") {
		qryObj["query"]["filtered"]["query"]["wildcard"]["taxonomy.family_name.exactWords"] = "*"+ name.toLowerCase() +"*";
	} else if(type == "genus") {
		qryObj["query"]["filtered"]["query"]["wildcard"]["taxonomy.genus_name.exactWords"] = "*"+ name.toLowerCase() +"*";
	} else if(type == "species") {
		qryObj["query"]["filtered"]["query"]["wildcard"]["taxonomy.species_name.exactWords"] = "*"+ name.toLowerCase() +"*";
	} else if(type == "providers") {
		qryObj["query"]["filtered"]["query"]["wildcard"]["provider.name.exactWords"] = "*"+ name.toLowerCase() +"*";
	} else if(type == "resources") {
		qryObj["query"]["filtered"]["query"]["wildcard"]["resource.name.exactWords"] = "*"+ name.toLowerCase() +"*";
	} else if(type == "institutionCode") {
		qryObj["query"]["filtered"]["query"]["wildcard"]["institution.code.exactWords"] = "*"+ name.toLowerCase() +"*";
	} else if(type == "collectionCode") {
		qryObj["query"]["filtered"]["query"]["wildcard"]["collection.code.exactWords"] = "*"+ name.toLowerCase() +"*";
	} else if(type == "country") {
		qryObj["query"]["filtered"]["query"]["wildcard"]["iso_country_code.exactWords"] = "*"+ name.toLowerCase() +"*";
	} else if(type == "department") {
		qryObj["query"]["filtered"]["query"]["wildcard"]["iso_department_code.exactWords"] = "*"+ name.toLowerCase() +"*";
	} else if(type == "county") {
		qryObj["query"]["filtered"]["query"]["wildcard"]["iso_county_code.exactWords"] = "*"+ name.toLowerCase() +"*";
	} else if(type == "paramo") {
		qryObj["query"]["filtered"]["query"]["wildcard"]["paramo_code.exactWords"] = "*"+ name.toLowerCase() +"*";
	} else if(type == "marineZone") {
		qryObj["query"]["filtered"]["query"]["wildcard"]["marine_zone_code.exactWords"] = "*"+ name.toLowerCase() +"*";
	}

	mySearchCall = elasticSearchClient.search('sibexplorer', 'occurrences', qryObj);
	return mySearchCall;
};

exports.getSearchText = function(subjectID) {
	qryObj = {
		"_source": ["text"],
		"query" : {
			"filtered": {
				"filter": {
					"term": {subjectID: subjectID}
				}
			}
		}
	};

	mySearchCall = elasticSearchClient.search('sibexplorer', 'help_search_text', qryObj);
	return mySearchCall;
};

exports.getOccurrences = function() {
	qryObj = {
		"_source": ["id", "canonical", "data_resource_name", "institution_code", "collection_code", "catalogue_number", "occurrence_date", "modified", "location", "country_name", "department_name", "county_name", "paramo_name", "marine_zone_name", "basis_of_record_name_spanish"],
		"from": 0,
		"size" : 20,
		"sort": [ { "canonical.untouched": "asc" } ],
		"query" : {
			"match_all" : {}
		}
	};

	mySearchCall = elasticSearchClient.search('sibexplorer', 'occurrences', qryObj);
	return mySearchCall;
};

exports.getOccurrence = function(id) {
	qryObj = {
		"_source": ["id", "canonical", "location", "rights", "catalogue.id", "catalogue.number", "iso_country_code", "country_name", "institution.id", "institution.code", "created", "year", "iso_department_code", "department_name", "citation", "resource.id", "resource.name", "marine_zone_name", "modified", "paramo_name", "month", "depth_centimeters", "iso_county_code", "county_name", "altitude_metres", "provider.id", "provider.name", "occurrence_date", "basis_of_record.name_spanish", "common_names", "collection.id", "collection.code", "taxonomy"],
		"query" : {
			"match" : {
				"id.untouched" : id
			}
		}
	};

	mySearchCall = elasticSearchClient.search('sibexplorer', 'occurrences', qryObj);
	return mySearchCall;
};

exports.getDistributionsOneDegree = function() {
	qryObj = {
		"_source": ["cell_id", "location_cell", "count"],
		"size": 10000000,
		"query": {
			"filtered" : {
				"query" : {
					"match_all" : {}
				},
				"filter": {
					"term": {"type": "0"}
				}
			}
		},
		"aggs": {
			"stats": {
				"stats": {
					"field": "count"
				}
			}
		}
	};

	mySearchCall = elasticSearchClient.search('sibexplorer', 'cell_density', qryObj);
	return mySearchCall;
};

exports.getDistributionsCentiDegree = function() {
	qryObj = {
		"_source": ["cell_id", "centi_cell_id", "location_centi_cell", "count"],
		"size": 10000000,
		"query": {
			"filtered" : {
				"query" : {
					"match_all" : {}
				},
				"filter": {
					"term": {"type": "0"}
				}
			}
		},
		"aggs": {
			"stats": {
				"stats": {
					"field": "count"
				}
			}
		}
	};

	mySearchCall = elasticSearchClient.search('sibexplorer', 'centi_cell_density', qryObj);
	return mySearchCall;
};

exports.getDistributionsPointFiveDegree = function() {
	qryObj = {
		"_source": ["cell_id", "pointfive_cell_id", "location_pointfive_cell", "count"],
		"size": 10000000,
		"query": {
			"filtered" : {
				"query" : {
					"match_all" : {}
				},
				"filter": {
					"term": {"type": "0"}
				}
			}
		},
		"aggs": {
			"stats": {
				"stats": {
					"field": "count"
				}
			}
		}
	};

	mySearchCall = elasticSearchClient.search('sibexplorer', 'pointfive_cell_density', qryObj);
	return mySearchCall;
};

exports.getDistributionsPointTwoDegree = function() {
	qryObj = {
		"_source": ["cell_id", "pointtwo_cell_id", "location_pointtwo_cell", "count"],
		"size": 10000000,
		"query": {
			"filtered" : {
				"query" : {
					"match_all" : {}
				},
				"filter": {
					"term": {"type": "0"}
				}
			}
		},
		"aggs": {
			"stats": {
				"stats": {
					"field": "count"
				}
			}
		}
	};

	mySearchCall = elasticSearchClient.search('sibexplorer', 'pointtwo_cell_density', qryObj);
	return mySearchCall;
};

// Returns cell stats
exports.getDistributionStats = function(cellSize, cellId, secondLevelCellId) {
	qryObj = {
		"_source": ["id"],
		"size": 0,
		"query": {
			"filtered" : {
				"query" : {
					"match_all" : {}
				},
				"filter": {
					"bool": {
						"must": [
							{
								"missing": {
									"field": "deleted"
								}
							},
							{
								"term": {
									"geospatial_issue": 0
								}
							}
						]
					}
				}
			}
		},
		"aggs": {
			"canonical": {
				"terms": {
					"field": "canonical.untouched",
					"size" : 10
				}
			},
			"common_names": {
				"nested" : {
					"path" : "common_names"
				},
				"aggs" : {
					"common": {
						"terms": {
							"field": "common_names.name.untouched",
							"size" : 10
						}
					}
				}
			},
			"kingdom": {
				"terms": {
					"field": "taxonomy.kingdom_name.untouched",
					"size" : 10
				},
				"aggs": {
					"id": {
						"terms": {
							"field": "taxonomy.kingdom_id"
						}
					}
				}
			},
			"phylum": {
				"terms": {
					"field": "taxonomy.phylum_name.untouched",
					"size" : 10
				},
				"aggs": {
					"id": {
						"terms": {
							"field": "taxonomy.phylum_id"
						}
					}
				}
			},
			"class": {
				"terms": {
					"field": "taxonomy.class_name.untouched",
					"size" : 10
				},
				"aggs": {
					"id": {
						"terms": {
							"field": "taxonomy.class_id"
						}
					}
				}
			},
			"order": {
				"terms": {
					"field": "taxonomy.order_name.untouched",
					"size" : 10
				},
				"aggs": {
					"id": {
						"terms": {
							"field": "taxonomy.order_id"
						}
					}
				}
			},
			"family": {
				"terms": {
					"field": "taxonomy.family_name.untouched",
					"size" : 10
				},
				"aggs": {
					"id": {
						"terms": {
							"field": "taxonomy.family_id"
						}
					}
				}
			},
			"genus": {
				"terms": {
					"field": "taxonomy.genus_name.untouched",
					"size" : 10
				},
				"aggs": {
					"id": {
						"terms": {
							"field": "taxonomy.genus_id"
						}
					}
				}
			},
			"species": {
				"terms": {
					"field": "taxonomy.species_name.untouched",
					"size" : 10
				},
				"aggs": {
					"id": {
						"terms": {
							"field": "taxonomy.species_id"
						}
					}
				}
			},
			"iso_department_code": {
				"terms": {
					"field": "iso_department_code.untouched",
					"size" : 10
				},
				"aggs": {
					"department_name": {
						"terms": {
							"field": "department_name.untouched"
						}
					}
				}
			},
			"iso_country_code": {
				"terms": {
					"field": "iso_country_code.untouched",
					"size" : 10
				},
				"aggs": {
					"country_name": {
						"terms": {
							"field": "country_name.untouched"
						}
					}
				}
			},
			"iso_county_code": {
				"terms": {
					"field": "iso_county_code.untouched",
					"size" : 10
				},
				"aggs": {
					"county_name": {
						"terms": {
							"field": "county_name.untouched"
						},
						"aggs": {
							"department_name": {
								"terms": {
									"field": "department_name.untouched"
								}
							}
						}
					}
				}
			},
			"paramo_code": {
				"terms": {
					"field": "paramo_code.untouched",
					"size" : 10
				},
				"aggs": {
					"paramo_name": {
						"terms": {
							"field": "paramo_name.untouched"
						}
					}
				}
			},
			"marine_zone_code": {
				"terms": {
					"field": "marine_zone_code.untouched",
					"size" : 10
				},
				"aggs": {
					"marine_zone_name": {
						"terms": {
							"field": "marine_zone_name.untouched"
						}
					}
				}
			},
			"data_provider_id": {
				"terms": {
					"field": "provider.id",
					"size" : 10
				},
				"aggs": {
					"data_provider_name": {
						"terms": {
							"field": "provider.name.untouched"
						}
					}
				}
			},
			"data_resource_id": {
				"terms": {
					"field": "resource.id",
					"size" : 10
				},
				"aggs": {
					"data_provider_id": {
						"terms": {
							"field": "provider.id"
						},
						"aggs": {
							"data_resource_name": {
								"terms": {
									"field": "resource.name.untouched"
								}
							}
						}
					}
				}
			},
			"institution_code_id": {
				"terms": {
					"field": "institution.id",
					"size" : 10
				},
				"aggs": {
					"institution_code": {
						"terms": {
							"field": "institution.code.untouched"
						}
					}
				}
			},
			"collection_code_id": {
				"terms": {
					"field": "collection.id",
					"size" : 10
				},
				"aggs": {
					"collection_code": {
						"terms": {
							"field": "collection.code.untouched"
						}
					}
				}
			}
		}
	};
	qryObj["query"]["filtered"]["filter"]["bool"]["must"][2] = {};
	qryObj["query"]["filtered"]["filter"]["bool"]["must"][2]["term"] = {};
	qryObj["query"]["filtered"]["filter"]["bool"]["must"][2]["term"]["cell_id"] = cellId;

	if(cellSize === "pointfivedegree") {
		qryObj["query"]["filtered"]["filter"]["bool"]["must"][3] = {};
		qryObj["query"]["filtered"]["filter"]["bool"]["must"][3]["term"] = {};
		qryObj["query"]["filtered"]["filter"]["bool"]["must"][3]["term"]["pointfive_cell_id"] = secondLevelCellId;
	} else if(cellSize === "pointtwodegree") {
		qryObj["query"]["filtered"]["filter"]["bool"]["must"][3] = {};
		qryObj["query"]["filtered"]["filter"]["bool"]["must"][3]["term"] = {};
		qryObj["query"]["filtered"]["filter"]["bool"]["must"][3]["term"]["pointtwo_cell_id"] = secondLevelCellId;
	} else if(cellSize === "pointonedegree") {
		qryObj["query"]["filtered"]["filter"]["bool"]["must"][3] = {};
		qryObj["query"]["filtered"]["filter"]["bool"]["must"][3]["term"] = {};
		qryObj["query"]["filtered"]["filter"]["bool"]["must"][3]["term"]["centi_cell_id"] = secondLevelCellId;
	}

	mySearchCall = elasticSearchClient.search('sibexplorer', 'occurrences', qryObj);
	return mySearchCall;
};

// Returns cell stats with search conditions
exports.getDistributionStatsWithSearchCondition = function(cellSize, conditions) {
	var qryObj = {
		"_source": false,
		"query": {
			"filtered" : {
				"query" : {
					"bool": {
						"must": []
					}
				},
				"filter": {
					"bool": {
						"must": [
							{
								"missing": {
									"field": "deleted"
								}
							},
							{
								"term": {
									"geospatial_issue": 0
								}
							},
							{
								"term" : {
									"cell_id": conditions.cellid
								}
							}
						]
					}
				}
			}
		},
		"aggs": {
			"canonical": {
				"terms": {
					"field": "canonical.untouched",
					"size" : 10
				}
			},
			"common_names": {
				"nested" : {
					"path" : "common_names"
				},
				"aggs" : {
					"common": {
						"terms": {
							"field": "common_names.name.untouched",
							"size" : 10
						}
					}
				}
			},
			"kingdom": {
				"terms": {
					"field": "taxonomy.kingdom_name.untouched",
					"size" : 10
				},
				"aggs": {
					"id": {
						"terms": {
							"field": "taxonomy.kingdom_id"
						}
					}
				}
			},
			"phylum": {
				"terms": {
					"field": "taxonomy.phylum_name.untouched",
					"size" : 10
				},
				"aggs": {
					"id": {
						"terms": {
							"field": "taxonomy.phylum_id"
						}
					}
				}
			},
			"class": {
				"terms": {
					"field": "taxonomy.class_name.untouched",
					"size" : 10
				},
				"aggs": {
					"id": {
						"terms": {
							"field": "taxonomy.class_id"
						}
					}
				}
			},
			"order": {
				"terms": {
					"field": "taxonomy.order_name.untouched",
					"size" : 10
				},
				"aggs": {
					"id": {
						"terms": {
							"field": "taxonomy.order_id"
						}
					}
				}
			},
			"family": {
				"terms": {
					"field": "taxonomy.family_name.untouched",
					"size" : 10
				},
				"aggs": {
					"id": {
						"terms": {
							"field": "taxonomy.family_id"
						}
					}
				}
			},
			"genus": {
				"terms": {
					"field": "taxonomy.genus_name.untouched",
					"size" : 10
				},
				"aggs": {
					"id": {
						"terms": {
							"field": "taxonomy.genus_id"
						}
					}
				}
			},
			"species": {
				"terms": {
					"field": "taxonomy.species_name.untouched",
					"size" : 10
				},
				"aggs": {
					"id": {
						"terms": {
							"field": "taxonomy.species_id"
						}
					}
				}
			},
			"iso_department_code": {
				"terms": {
					"field": "iso_department_code.untouched",
					"size" : 10
				},
				"aggs": {
					"department_name": {
						"terms": {
							"field": "department_name.untouched"
						}
					}
				}
			},
			"iso_country_code": {
				"terms": {
					"field": "iso_country_code.untouched",
					"size" : 10
				},
				"aggs": {
					"country_name": {
						"terms": {
							"field": "country_name.untouched"
						}
					}
				}
			},
			"iso_county_code": {
				"terms": {
					"field": "iso_county_code.untouched",
					"size" : 10
				},
				"aggs": {
					"county_name": {
						"terms": {
							"field": "county_name.untouched"
						},
						"aggs": {
							"department_name": {
								"terms": {
									"field": "department_name.untouched"
								}
							}
						}
					}
				}
			},
			"paramo_code": {
				"terms": {
					"field": "paramo_code.untouched",
					"size" : 10
				},
				"aggs": {
					"paramo_name": {
						"terms": {
							"field": "paramo_name.untouched"
						}
					}
				}
			},
			"marine_zone_code": {
				"terms": {
					"field": "marine_zone_code.untouched",
					"size" : 10
				},
				"aggs": {
					"marine_zone_name": {
						"terms": {
							"field": "marine_zone_name.untouched"
						}
					}
				}
			},
			"data_provider_id": {
				"terms": {
					"field": "provider.id",
					"size" : 10
				},
				"aggs": {
					"data_provider_name": {
						"terms": {
							"field": "provider.name.untouched"
						}
					}
				}
			},
			"data_resource_id": {
				"terms": {
					"field": "resource.id",
					"size" : 10
				},
				"aggs": {
					"data_provider_id": {
						"terms": {
							"field": "provider.id"
						},
						"aggs": {
							"data_resource_name": {
								"terms": {
									"field": "resource.name.untouched"
								}
							}
						}
					}
				}
			},
			"institution_code_id": {
				"terms": {
					"field": "institution.id",
					"size" : 10
				},
				"aggs": {
					"institution_code": {
						"terms": {
							"field": "institution.code.untouched"
						}
					}
				}
			},
			"collection_code_id": {
				"terms": {
					"field": "collection.id",
					"size" : 10
				},
				"aggs": {
					"collection_code": {
						"terms": {
							"field": "collection.code.untouched"
						}
					}
				}
			}
		}
	};

	var geoPositionCounter = 3;
	if(cellSize === "pointfivedegree") {
		qryObj["query"]["filtered"]["filter"]["bool"]["must"][3] = {};
		qryObj["query"]["filtered"]["filter"]["bool"]["must"][3]["term"] = {};
		qryObj["query"]["filtered"]["filter"]["bool"]["must"][3]["term"]["pointfive_cell_id"] = conditions.pointfivecellid;
		geoPositionCounter = 4;
	} else if(cellSize === "pointtwodegree") {
		qryObj["query"]["filtered"]["filter"]["bool"]["must"][3] = {};
		qryObj["query"]["filtered"]["filter"]["bool"]["must"][3]["term"] = {};
		qryObj["query"]["filtered"]["filter"]["bool"]["must"][3]["term"]["pointtwo_cell_id"] = conditions.pointtwocellid;
		geoPositionCounter = 4;
	} else if(cellSize === "pointonedegree") {
		qryObj["query"]["filtered"]["filter"]["bool"]["must"][3] = {};
		qryObj["query"]["filtered"]["filter"]["bool"]["must"][3]["term"] = {};
		qryObj["query"]["filtered"]["filter"]["bool"]["must"][3]["term"]["centi_cell_id"] = conditions.pointonecellid;
		geoPositionCounter = 4;
	}

	var andCounter = 0;
	var orCounter = 0;

	if(conditions.scientificNames) {
		qryObj["query"]["filtered"]["query"]["bool"]["must"][andCounter] = {};
		qryObj["query"]["filtered"]["query"]["bool"]["must"][andCounter]["bool"] = {};
		qryObj["query"]["filtered"]["query"]["bool"]["must"][andCounter]["bool"]["should"] = [];
		_.each(conditions.scientificNames, function(data) {
			qryObj["query"]["filtered"]["query"]["bool"]["must"][andCounter]["bool"]["should"][orCounter] = {};
			qryObj["query"]["filtered"]["query"]["bool"]["must"][andCounter]["bool"]["should"][orCounter]["wildcard"] = {};
			qryObj["query"]["filtered"]["query"]["bool"]["must"][andCounter]["bool"]["should"][orCounter]["wildcard"]["canonical.exactWords"] = data.textObject.toLowerCase();
			orCounter+=1;
		});
		andCounter+=1;
	}
	if(conditions.commonNames) {
		qryObj["query"]["filtered"]["query"]["bool"]["must"][andCounter] = {};
		qryObj["query"]["filtered"]["query"]["bool"]["must"][andCounter]["nested"] = {};
		qryObj["query"]["filtered"]["query"]["bool"]["must"][andCounter]["nested"]["path"] = "common_names";
		qryObj["query"]["filtered"]["query"]["bool"]["must"][andCounter]["nested"]["query"] = {};
		qryObj["query"]["filtered"]["query"]["bool"]["must"][andCounter]["nested"]["query"]["bool"] = {};
		qryObj["query"]["filtered"]["query"]["bool"]["must"][andCounter]["nested"]["query"]["bool"]["should"] = [];
		_.each(conditions.commonNames, function(data) {
			qryObj["query"]["filtered"]["query"]["bool"]["must"][andCounter]["nested"]["query"]["bool"]["should"][orCounter] = {};
			qryObj["query"]["filtered"]["query"]["bool"]["must"][andCounter]["nested"]["query"]["bool"]["should"][orCounter]["wildcard"] = {};
			qryObj["query"]["filtered"]["query"]["bool"]["must"][andCounter]["nested"]["query"]["bool"]["should"][orCounter]["wildcard"]["common_names.name.exactWords"] = data.textObject.toLowerCase();
			orCounter+=1;
		});
		andCounter+=1;
	}
	if(conditions.taxons) {
		orCounter = 0;
		qryObj["query"]["filtered"]["query"]["bool"]["must"][andCounter] = {};
		qryObj["query"]["filtered"]["query"]["bool"]["must"][andCounter]["bool"] = {};
		qryObj["query"]["filtered"]["query"]["bool"]["must"][andCounter]["bool"]["should"] = [];
		_.each(conditions.taxons, function(data) {
			qryObj["query"]["filtered"]["query"]["bool"]["must"][andCounter]["bool"]["should"][orCounter] = {};
			qryObj["query"]["filtered"]["query"]["bool"]["must"][andCounter]["bool"]["should"][orCounter]["wildcard"] = {};
			if(data.textName == "kingdom")
				qryObj["query"]["filtered"]["query"]["bool"]["must"][andCounter]["bool"]["should"][orCounter]["wildcard"]["taxonomy.kingdom_name.exactWords"] = data.textObject.toLowerCase();
			if(data.textName == "phylum")
				qryObj["query"]["filtered"]["query"]["bool"]["must"][andCounter]["bool"]["should"][orCounter]["wildcard"]["taxonomy.phylum_name.exactWords"] = data.textObject.toLowerCase();
			if(data.textName == "class")
				qryObj["query"]["filtered"]["query"]["bool"]["must"][andCounter]["bool"]["should"][orCounter]["wildcard"]["taxonomy.class_name.exactWords"] = data.textObject.toLowerCase();
			if(data.textName == "order")
				qryObj["query"]["filtered"]["query"]["bool"]["must"][andCounter]["bool"]["should"][orCounter]["wildcard"]["taxonomy.order_name.exactWords"] = data.textObject.toLowerCase();
			if(data.textName == "family")
				qryObj["query"]["filtered"]["query"]["bool"]["must"][andCounter]["bool"]["should"][orCounter]["wildcard"]["taxonomy.family_name.exactWords"] = data.textObject.toLowerCase();
			if(data.textName == "genus")
				qryObj["query"]["filtered"]["query"]["bool"]["must"][andCounter]["bool"]["should"][orCounter]["wildcard"]["taxonomy.genus_name.exactWords"] = data.textObject.toLowerCase();
			if(data.textName == "species")
				qryObj["query"]["filtered"]["query"]["bool"]["must"][andCounter]["bool"]["should"][orCounter]["wildcard"]["taxonomy.species_name.exactWords"] = data.textObject.toLowerCase();
			orCounter+=1;
		});
		andCounter+=1;
	}
	if(conditions.countries) {
		orCounter = 0;
		qryObj["query"]["filtered"]["query"]["bool"]["must"][andCounter] = {};
		qryObj["query"]["filtered"]["query"]["bool"]["must"][andCounter]["bool"] = {};
		qryObj["query"]["filtered"]["query"]["bool"]["must"][andCounter]["bool"]["should"] = [];
		_.each(conditions.countries, function(data) {
			qryObj["query"]["filtered"]["query"]["bool"]["must"][andCounter]["bool"]["should"][orCounter] = {};
			qryObj["query"]["filtered"]["query"]["bool"]["must"][andCounter]["bool"]["should"][orCounter]["wildcard"] = {};
			qryObj["query"]["filtered"]["query"]["bool"]["must"][andCounter]["bool"]["should"][orCounter]["wildcard"]["iso_country_code.exactWords"] = data.textObject.toLowerCase();
			orCounter+=1;
		});
		andCounter+=1;
	}
	if(conditions.departments) {
		orCounter = 0;
		qryObj["query"]["filtered"]["query"]["bool"]["must"][andCounter] = {};
		qryObj["query"]["filtered"]["query"]["bool"]["must"][andCounter]["bool"] = {};
		qryObj["query"]["filtered"]["query"]["bool"]["must"][andCounter]["bool"]["should"] = [];
		_.each(conditions.departments, function(data) {
			qryObj["query"]["filtered"]["query"]["bool"]["must"][andCounter]["bool"]["should"][orCounter] = {};
			qryObj["query"]["filtered"]["query"]["bool"]["must"][andCounter]["bool"]["should"][orCounter]["wildcard"] = {};
			qryObj["query"]["filtered"]["query"]["bool"]["must"][andCounter]["bool"]["should"][orCounter]["wildcard"]["iso_department_code.exactWords"] = data.textObject.toLowerCase();
			orCounter+=1;
		});
		andCounter+=1;
	}
	if(conditions.counties) {
		orCounter = 0;
		qryObj["query"]["filtered"]["query"]["bool"]["must"][andCounter] = {};
		qryObj["query"]["filtered"]["query"]["bool"]["must"][andCounter]["bool"] = {};
		qryObj["query"]["filtered"]["query"]["bool"]["must"][andCounter]["bool"]["should"] = [];
		_.each(conditions.counties, function(data) {
			qryObj["query"]["filtered"]["query"]["bool"]["must"][andCounter]["bool"]["should"][orCounter] = {};
			qryObj["query"]["filtered"]["query"]["bool"]["must"][andCounter]["bool"]["should"][orCounter]["wildcard"] = {};
			qryObj["query"]["filtered"]["query"]["bool"]["must"][andCounter]["bool"]["should"][orCounter]["wildcard"]["iso_county_code.exactWords"] = data.textObject.toLowerCase();
			orCounter+=1;
		});
		andCounter+=1;
	}
	if(conditions.paramos) {
		orCounter = 0;
		qryObj["query"]["filtered"]["query"]["bool"]["must"][andCounter] = {};
		qryObj["query"]["filtered"]["query"]["bool"]["must"][andCounter]["bool"] = {};
		qryObj["query"]["filtered"]["query"]["bool"]["must"][andCounter]["bool"]["should"] = [];
		_.each(conditions.paramos, function(data) {
			qryObj["query"]["filtered"]["query"]["bool"]["must"][andCounter]["bool"]["should"][orCounter] = {};
			qryObj["query"]["filtered"]["query"]["bool"]["must"][andCounter]["bool"]["should"][orCounter]["wildcard"] = {};
			qryObj["query"]["filtered"]["query"]["bool"]["must"][andCounter]["bool"]["should"][orCounter]["wildcard"]["paramo_code.exactWords"] = data.textObject.toLowerCase();
			orCounter+=1;
		});
		andCounter+=1;
	}
	if(conditions.marineZones) {
		orCounter = 0;
		qryObj["query"]["filtered"]["query"]["bool"]["must"][andCounter] = {};
		qryObj["query"]["filtered"]["query"]["bool"]["must"][andCounter]["bool"] = {};
		qryObj["query"]["filtered"]["query"]["bool"]["must"][andCounter]["bool"]["should"] = [];
		_.each(conditions.marineZones, function(data) {
			qryObj["query"]["filtered"]["query"]["bool"]["must"][andCounter]["bool"]["should"][orCounter] = {};
			qryObj["query"]["filtered"]["query"]["bool"]["must"][andCounter]["bool"]["should"][orCounter]["wildcard"] = {};
			qryObj["query"]["filtered"]["query"]["bool"]["must"][andCounter]["bool"]["should"][orCounter]["wildcard"]["marine_zone_code.exactWords"] = data.textObject.toLowerCase();
			orCounter+=1;
		});
		andCounter+=1;
	}
	if(conditions.latitudes) {
		orCounter = 0;
		qryObj["query"]["filtered"]["query"]["bool"]["must"][andCounter] = {};
		qryObj["query"]["filtered"]["query"]["bool"]["must"][andCounter]["bool"] = {};
		qryObj["query"]["filtered"]["query"]["bool"]["must"][andCounter]["bool"]["must"] = [];
		_.each(conditions.latitudes, function(data) {
			qryObj["query"]["filtered"]["query"]["bool"]["must"][andCounter]["bool"]["must"][orCounter] = {};
			if(data.predicate == "eq") {
				qryObj["query"]["filtered"]["query"]["bool"]["must"][andCounter]["bool"]["must"][orCounter]["range"] = {};
				qryObj["query"]["filtered"]["query"]["bool"]["must"][andCounter]["bool"]["must"][orCounter]["range"]["location.lat"] = {};
				qryObj["query"]["filtered"]["query"]["bool"]["must"][andCounter]["bool"]["must"][orCounter]["range"]["location.lat"]["gte"] = data.textObject.toLowerCase();
				qryObj["query"]["filtered"]["query"]["bool"]["must"][andCounter]["bool"]["must"][orCounter]["range"]["location.lat"]["lte"] = data.textObject.toLowerCase();
			} else if(data.predicate == "gt") {
				qryObj["query"]["filtered"]["query"]["bool"]["must"][andCounter]["bool"]["must"][orCounter]["range"] = {};
				qryObj["query"]["filtered"]["query"]["bool"]["must"][andCounter]["bool"]["must"][orCounter]["range"]["location.lat"] = {};
				qryObj["query"]["filtered"]["query"]["bool"]["must"][andCounter]["bool"]["must"][orCounter]["range"]["location.lat"]["gt"] = data.textObject.toLowerCase();
			} else if(data.predicate == "lt") {
				qryObj["query"]["filtered"]["query"]["bool"]["must"][andCounter]["bool"]["must"][orCounter]["range"] = {};
				qryObj["query"]["filtered"]["query"]["bool"]["must"][andCounter]["bool"]["must"][orCounter]["range"]["location.lat"] = {};
				qryObj["query"]["filtered"]["query"]["bool"]["must"][andCounter]["bool"]["must"][orCounter]["range"]["location.lat"]["lt"] = data.textObject.toLowerCase();
			}
			orCounter+=1;
		});
		andCounter+=1;
	}
	if(conditions.longitudes) {
		orCounter = 0;
		qryObj["query"]["filtered"]["query"]["bool"]["must"][andCounter] = {};
		qryObj["query"]["filtered"]["query"]["bool"]["must"][andCounter]["bool"] = {};
		qryObj["query"]["filtered"]["query"]["bool"]["must"][andCounter]["bool"]["must"] = [];
		_.each(conditions.longitudes, function(data) {
			qryObj["query"]["filtered"]["query"]["bool"]["must"][andCounter]["bool"]["must"][orCounter] = {};
			if(data.predicate == "eq") {
				qryObj["query"]["filtered"]["query"]["bool"]["must"][andCounter]["bool"]["must"][orCounter]["range"] = {};
				qryObj["query"]["filtered"]["query"]["bool"]["must"][andCounter]["bool"]["must"][orCounter]["range"]["location.lon"] = {};
				qryObj["query"]["filtered"]["query"]["bool"]["must"][andCounter]["bool"]["must"][orCounter]["range"]["location.lon"]["gte"] = data.textObject.toLowerCase();
				qryObj["query"]["filtered"]["query"]["bool"]["must"][andCounter]["bool"]["must"][orCounter]["range"]["location.lon"]["lte"] = data.textObject.toLowerCase();
			} else if(data.predicate == "gt") {
				qryObj["query"]["filtered"]["query"]["bool"]["must"][andCounter]["bool"]["must"][orCounter]["range"] = {};
				qryObj["query"]["filtered"]["query"]["bool"]["must"][andCounter]["bool"]["must"][orCounter]["range"]["location.lon"] = {};
				qryObj["query"]["filtered"]["query"]["bool"]["must"][andCounter]["bool"]["must"][orCounter]["range"]["location.lon"]["gt"] = data.textObject.toLowerCase();
			} else if(data.predicate == "lt") {
				qryObj["query"]["filtered"]["query"]["bool"]["must"][andCounter]["bool"]["must"][orCounter]["range"] = {};
				qryObj["query"]["filtered"]["query"]["bool"]["must"][andCounter]["bool"]["must"][orCounter]["range"]["location.lon"] = {};
				qryObj["query"]["filtered"]["query"]["bool"]["must"][andCounter]["bool"]["must"][orCounter]["range"]["location.lon"]["lt"] = data.textObject.toLowerCase();
			}
			orCounter+=1;
		});
		andCounter+=1;
	}
	if(conditions.altitudes) {
		orCounter = 0;
		qryObj["query"]["filtered"]["query"]["bool"]["must"][andCounter] = {};
		qryObj["query"]["filtered"]["query"]["bool"]["must"][andCounter]["bool"] = {};
		qryObj["query"]["filtered"]["query"]["bool"]["must"][andCounter]["bool"]["must"] = [];
		_.each(conditions.altitudes, function(data) {
			qryObj["query"]["filtered"]["query"]["bool"]["must"][andCounter]["bool"]["must"][orCounter] = {};
			if(data.predicate == "eq") {
				qryObj["query"]["filtered"]["query"]["bool"]["must"][andCounter]["bool"]["must"][orCounter]["range"] = {};
				qryObj["query"]["filtered"]["query"]["bool"]["must"][andCounter]["bool"]["must"][orCounter]["range"]["altitude_meters"] = {};
				qryObj["query"]["filtered"]["query"]["bool"]["must"][andCounter]["bool"]["must"][orCounter]["range"]["altitude_meters"]["gte"] = data.textObject.toLowerCase();
				qryObj["query"]["filtered"]["query"]["bool"]["must"][andCounter]["bool"]["must"][orCounter]["range"]["altitude_metres"]["lte"] = data.textObject.toLowerCase();
			} else if(data.predicate == "gt") {
				qryObj["query"]["filtered"]["query"]["bool"]["must"][andCounter]["bool"]["must"][orCounter]["range"] = {};
				qryObj["query"]["filtered"]["query"]["bool"]["must"][andCounter]["bool"]["must"][orCounter]["range"]["altitude_meters"] = {};
				qryObj["query"]["filtered"]["query"]["bool"]["must"][andCounter]["bool"]["must"][orCounter]["range"]["altitude_meters"]["gt"] = data.textObject.toLowerCase();
			} else if(data.predicate == "lt") {
				qryObj["query"]["filtered"]["query"]["bool"]["must"][andCounter]["bool"]["must"][orCounter]["range"] = {};
				qryObj["query"]["filtered"]["query"]["bool"]["must"][andCounter]["bool"]["must"][orCounter]["range"]["altitude_meters"] = {};
				qryObj["query"]["filtered"]["query"]["bool"]["must"][andCounter]["bool"]["must"][orCounter]["range"]["altitude_meters"]["lt"] = data.textObject.toLowerCase();
			}
			orCounter+=1;
		});
		andCounter+=1;
	}
	if(conditions.deeps) {
		orCounter = 0;
		qryObj["query"]["filtered"]["query"]["bool"]["must"][andCounter] = {};
		qryObj["query"]["filtered"]["query"]["bool"]["must"][andCounter]["bool"] = {};
		qryObj["query"]["filtered"]["query"]["bool"]["must"][andCounter]["bool"]["must"] = [];
		_.each(conditions.deeps, function(data) {
			qryObj["query"]["filtered"]["query"]["bool"]["must"][andCounter]["bool"]["must"][orCounter] = {};
			if(data.predicate == "eq") {
				qryObj["query"]["filtered"]["query"]["bool"]["must"][andCounter]["bool"]["must"][orCounter]["range"] = {};
				qryObj["query"]["filtered"]["query"]["bool"]["must"][andCounter]["bool"]["must"][orCounter]["range"]["depth_centimeters"] = {};
				qryObj["query"]["filtered"]["query"]["bool"]["must"][andCounter]["bool"]["must"][orCounter]["range"]["depth_centimeters"]["gte"] = data.textObject.toLowerCase();
				qryObj["query"]["filtered"]["query"]["bool"]["must"][andCounter]["bool"]["must"][orCounter]["range"]["depth_centimeters"]["lte"] = data.textObject.toLowerCase();
			} else if(data.predicate == "gt") {
				qryObj["query"]["filtered"]["query"]["bool"]["must"][andCounter]["bool"]["must"][orCounter]["range"] = {};
				qryObj["query"]["filtered"]["query"]["bool"]["must"][andCounter]["bool"]["must"][orCounter]["range"]["depth_centimeters"] = {};
				qryObj["query"]["filtered"]["query"]["bool"]["must"][andCounter]["bool"]["must"][orCounter]["range"]["depth_centimeters"]["gt"] = data.textObject.toLowerCase();
			} else if(data.predicate == "lt") {
				qryObj["query"]["filtered"]["query"]["bool"]["must"][andCounter]["bool"]["must"][orCounter]["range"] = {};
				qryObj["query"]["filtered"]["query"]["bool"]["must"][andCounter]["bool"]["must"][orCounter]["range"]["depth_centimeters"] = {};
				qryObj["query"]["filtered"]["query"]["bool"]["must"][andCounter]["bool"]["must"][orCounter]["range"]["depth_centimeters"]["lt"] = data.textObject.toLowerCase();
			}
			orCounter+=1;
		});
		andCounter+=1;
	}
	if(conditions.providers) {
		orCounter = 0;
		qryObj["query"]["filtered"]["query"]["bool"]["must"][andCounter] = {};
		qryObj["query"]["filtered"]["query"]["bool"]["must"][andCounter]["bool"] = {};
		qryObj["query"]["filtered"]["query"]["bool"]["must"][andCounter]["bool"]["should"] = [];
		_.each(conditions.providers, function(data) {
			qryObj["query"]["filtered"]["query"]["bool"]["must"][andCounter]["bool"]["should"][orCounter] = {};
			qryObj["query"]["filtered"]["query"]["bool"]["must"][andCounter]["bool"]["should"][orCounter]["wildcard"] = {};
			qryObj["query"]["filtered"]["query"]["bool"]["must"][andCounter]["bool"]["should"][orCounter]["wildcard"]["provider.name.exactWords"] = data.textObject.toLowerCase();
			orCounter+=1;
		});
		andCounter+=1;
	}
	if(conditions.resources) {
		orCounter = 0;
		qryObj["query"]["filtered"]["query"]["bool"]["must"][andCounter] = {};
		qryObj["query"]["filtered"]["query"]["bool"]["must"][andCounter]["bool"] = {};
		qryObj["query"]["filtered"]["query"]["bool"]["must"][andCounter]["bool"]["should"] = [];
		_.each(conditions.resources, function(data) {
			qryObj["query"]["filtered"]["query"]["bool"]["must"][andCounter]["bool"]["should"][orCounter] = {};
			qryObj["query"]["filtered"]["query"]["bool"]["must"][andCounter]["bool"]["should"][orCounter]["wildcard"] = {};
			qryObj["query"]["filtered"]["query"]["bool"]["must"][andCounter]["bool"]["should"][orCounter]["wildcard"]["resource.name.exactWords"] = data.textObject.toLowerCase();
			orCounter+=1;
		});
		andCounter+=1;
	}
	if(conditions.poligonalCoordinates || conditions.radialCoordinates) {
		if(conditions.poligonalCoordinates) {
			orCounter = 0;
			qryObj["query"]["filtered"]["filter"]["bool"]["must"][geoPositionCounter]["geo_polygon"] = {};
			qryObj["query"]["filtered"]["filter"]["bool"]["must"][geoPositionCounter]["geo_polygon"]["location"] = {};
			qryObj["query"]["filtered"]["filter"]["bool"]["must"][geoPositionCounter]["geo_polygon"]["location"]["points"] = [];
			_.each(conditions.poligonalCoordinates, function(data) {
				qryObj["query"]["filtered"]["filter"]["bool"]["must"][geoPositionCounter]["geo_polygon"]["location"]["points"][orCounter] = {"lat": data.lat, "lon": data.lng};
				orCounter+=1;
			});
		}
		if(conditions.radialCoordinates) {
			qryObj["query"]["filtered"]["filter"]["bool"]["must"][geoPositionCounter] = {};
			qryObj["query"]["filtered"]["filter"]["bool"]["must"][geoPositionCounter]["geo_distance"] = {};
			_.each(conditions.radialCoordinates, function(data) {
				qryObj["query"]["filtered"]["filter"]["bool"]["must"][geoPositionCounter]["geo_distance"]["distance"] = data.radius + "m";
				qryObj["query"]["filtered"]["filter"]["bool"]["must"][geoPositionCounter]["geo_distance"]["location"] = {"lat": data.lat, "lon": data.lng};
			});
		}
	}
	if(qryObj["query"]["filtered"]["query"]["bool"]["must"].length === 0) {
		qryObj["query"]["filtered"]["query"]["bool"]["must"][andCounter] = {};
		qryObj["query"]["filtered"]["query"]["bool"]["must"][andCounter]["match_all"] = {};
		andCounter+=1;
	}
	mySearchCall = elasticSearchClient.search('sibexplorer', 'occurrences', qryObj);
	return mySearchCall;
};

exports.getDistributionWithFilter = function(conditions) {
	var qryObj = {
		"_source": false,
		"query": {
			"filtered" : {
				"query" : {
					"bool": {
						"must": []
					}
				},
				"filter": {
					"bool": {
						"must": [
							{
								"missing": {
									"field": "deleted"
								}
							},
							{
								"term": {
									"geospatial_issue": 0
								}
							}
						]
					}
				}
			}
		},
		"aggs": {
			"cellgroup": {
				"terms": {
					"field": "cell_group.untouched",
					"size" : 100000000
				}
			},
			"pointfivegroup": {
				"terms": {
					"field": "pointfive_group.untouched",
					"size" : 100000000
				}
			},
			"pointtwogroup": {
				"terms": {
					"field": "pointtwo_group.untouched",
					"size" : 100000000
				}
			},
			"centigroup": {
				"terms": {
					"field": "centi_group.untouched",
					"size" : 100000000
				}
			}
		}
	};

	var andCounter = 0;
	var orCounter = 0;

	if(conditions.scientificNames) {
		qryObj["query"]["filtered"]["query"]["bool"]["must"][andCounter] = {};
		qryObj["query"]["filtered"]["query"]["bool"]["must"][andCounter]["bool"] = {};
		qryObj["query"]["filtered"]["query"]["bool"]["must"][andCounter]["bool"]["should"] = [];
		_.each(conditions.scientificNames, function(data) {
			qryObj["query"]["filtered"]["query"]["bool"]["must"][andCounter]["bool"]["should"][orCounter] = {};
			qryObj["query"]["filtered"]["query"]["bool"]["must"][andCounter]["bool"]["should"][orCounter]["wildcard"] = {};
			qryObj["query"]["filtered"]["query"]["bool"]["must"][andCounter]["bool"]["should"][orCounter]["wildcard"]["canonical.exactWords"] = data.textObject.toLowerCase();
			orCounter+=1;
		});
		andCounter+=1;
	}
	if(conditions.commonNames) {
		qryObj["query"]["filtered"]["query"]["bool"]["must"][andCounter] = {};
		qryObj["query"]["filtered"]["query"]["bool"]["must"][andCounter]["nested"] = {};
		qryObj["query"]["filtered"]["query"]["bool"]["must"][andCounter]["nested"]["path"] = "common_names";
		qryObj["query"]["filtered"]["query"]["bool"]["must"][andCounter]["nested"]["query"] = {};
		qryObj["query"]["filtered"]["query"]["bool"]["must"][andCounter]["nested"]["query"]["bool"] = {};
		qryObj["query"]["filtered"]["query"]["bool"]["must"][andCounter]["nested"]["query"]["bool"]["should"] = [];
		_.each(conditions.commonNames, function(data) {
			qryObj["query"]["filtered"]["query"]["bool"]["must"][andCounter]["nested"]["query"]["bool"]["should"][orCounter] = {};
			qryObj["query"]["filtered"]["query"]["bool"]["must"][andCounter]["nested"]["query"]["bool"]["should"][orCounter]["wildcard"] = {};
			qryObj["query"]["filtered"]["query"]["bool"]["must"][andCounter]["nested"]["query"]["bool"]["should"][orCounter]["wildcard"]["common_names.name.exactWords"] = data.textObject.toLowerCase();
			orCounter+=1;
		});
		andCounter+=1;
	}
	if(conditions.taxons) {
		orCounter = 0;
		qryObj["query"]["filtered"]["query"]["bool"]["must"][andCounter] = {};
		qryObj["query"]["filtered"]["query"]["bool"]["must"][andCounter]["bool"] = {};
		qryObj["query"]["filtered"]["query"]["bool"]["must"][andCounter]["bool"]["should"] = [];
		_.each(conditions.taxons, function(data) {
			qryObj["query"]["filtered"]["query"]["bool"]["must"][andCounter]["bool"]["should"][orCounter] = {};
			qryObj["query"]["filtered"]["query"]["bool"]["must"][andCounter]["bool"]["should"][orCounter]["wildcard"] = {};
			if(data.textName == "kingdom")
				qryObj["query"]["filtered"]["query"]["bool"]["must"][andCounter]["bool"]["should"][orCounter]["wildcard"]["taxonomy.kingdom_name.exactWords"] = data.textObject.toLowerCase();
			if(data.textName == "phylum")
				qryObj["query"]["filtered"]["query"]["bool"]["must"][andCounter]["bool"]["should"][orCounter]["wildcard"]["taxonomy.phylum_name.exactWords"] = data.textObject.toLowerCase();
			if(data.textName == "class")
				qryObj["query"]["filtered"]["query"]["bool"]["must"][andCounter]["bool"]["should"][orCounter]["wildcard"]["taxonomy.class_name.exactWords"] = data.textObject.toLowerCase();
			if(data.textName == "order")
				qryObj["query"]["filtered"]["query"]["bool"]["must"][andCounter]["bool"]["should"][orCounter]["wildcard"]["taxonomy.order_name.exactWords"] = data.textObject.toLowerCase();
			if(data.textName == "family")
				qryObj["query"]["filtered"]["query"]["bool"]["must"][andCounter]["bool"]["should"][orCounter]["wildcard"]["taxonomy.family_name.exactWords"] = data.textObject.toLowerCase();
			if(data.textName == "genus")
				qryObj["query"]["filtered"]["query"]["bool"]["must"][andCounter]["bool"]["should"][orCounter]["wildcard"]["taxonomy.genus_name.exactWords"] = data.textObject.toLowerCase();
			if(data.textName == "species")
				qryObj["query"]["filtered"]["query"]["bool"]["must"][andCounter]["bool"]["should"][orCounter]["wildcard"]["taxonomy.species_name.exactWords"] = data.textObject.toLowerCase();
			orCounter+=1;
		});
		andCounter+=1;
	}
	if(conditions.countries) {
		orCounter = 0;
		qryObj["query"]["filtered"]["query"]["bool"]["must"][andCounter] = {};
		qryObj["query"]["filtered"]["query"]["bool"]["must"][andCounter]["bool"] = {};
		qryObj["query"]["filtered"]["query"]["bool"]["must"][andCounter]["bool"]["should"] = [];
		_.each(conditions.countries, function(data) {
			qryObj["query"]["filtered"]["query"]["bool"]["must"][andCounter]["bool"]["should"][orCounter] = {};
			qryObj["query"]["filtered"]["query"]["bool"]["must"][andCounter]["bool"]["should"][orCounter]["wildcard"] = {};
			qryObj["query"]["filtered"]["query"]["bool"]["must"][andCounter]["bool"]["should"][orCounter]["wildcard"]["iso_country_code.exactWords"] = data.textObject.toLowerCase();
			orCounter+=1;
		});
		andCounter+=1;
	}
	if(conditions.departments) {
		orCounter = 0;
		qryObj["query"]["filtered"]["query"]["bool"]["must"][andCounter] = {};
		qryObj["query"]["filtered"]["query"]["bool"]["must"][andCounter]["bool"] = {};
		qryObj["query"]["filtered"]["query"]["bool"]["must"][andCounter]["bool"]["should"] = [];
		_.each(conditions.departments, function(data) {
			qryObj["query"]["filtered"]["query"]["bool"]["must"][andCounter]["bool"]["should"][orCounter] = {};
			qryObj["query"]["filtered"]["query"]["bool"]["must"][andCounter]["bool"]["should"][orCounter]["wildcard"] = {};
			qryObj["query"]["filtered"]["query"]["bool"]["must"][andCounter]["bool"]["should"][orCounter]["wildcard"]["iso_department_code.exactWords"] = data.textObject.toLowerCase();
			orCounter+=1;
		});
		andCounter+=1;
	}
	if(conditions.counties) {
		orCounter = 0;
		qryObj["query"]["filtered"]["query"]["bool"]["must"][andCounter] = {};
		qryObj["query"]["filtered"]["query"]["bool"]["must"][andCounter]["bool"] = {};
		qryObj["query"]["filtered"]["query"]["bool"]["must"][andCounter]["bool"]["should"] = [];
		_.each(conditions.counties, function(data) {
			qryObj["query"]["filtered"]["query"]["bool"]["must"][andCounter]["bool"]["should"][orCounter] = {};
			qryObj["query"]["filtered"]["query"]["bool"]["must"][andCounter]["bool"]["should"][orCounter]["wildcard"] = {};
			qryObj["query"]["filtered"]["query"]["bool"]["must"][andCounter]["bool"]["should"][orCounter]["wildcard"]["iso_county_code.exactWords"] = data.textObject.toLowerCase();
			orCounter+=1;
		});
		andCounter+=1;
	}
	if(conditions.paramos) {
		orCounter = 0;
		qryObj["query"]["filtered"]["query"]["bool"]["must"][andCounter] = {};
		qryObj["query"]["filtered"]["query"]["bool"]["must"][andCounter]["bool"] = {};
		qryObj["query"]["filtered"]["query"]["bool"]["must"][andCounter]["bool"]["should"] = [];
		_.each(conditions.paramos, function(data) {
			qryObj["query"]["filtered"]["query"]["bool"]["must"][andCounter]["bool"]["should"][orCounter] = {};
			qryObj["query"]["filtered"]["query"]["bool"]["must"][andCounter]["bool"]["should"][orCounter]["wildcard"] = {};
			qryObj["query"]["filtered"]["query"]["bool"]["must"][andCounter]["bool"]["should"][orCounter]["wildcard"]["paramo_code.exactWords"] = data.textObject.toLowerCase();
			orCounter+=1;
		});
		andCounter+=1;
	}
	if(conditions.marineZones) {
		orCounter = 0;
		qryObj["query"]["filtered"]["query"]["bool"]["must"][andCounter] = {};
		qryObj["query"]["filtered"]["query"]["bool"]["must"][andCounter]["bool"] = {};
		qryObj["query"]["filtered"]["query"]["bool"]["must"][andCounter]["bool"]["should"] = [];
		_.each(conditions.marineZones, function(data) {
			qryObj["query"]["filtered"]["query"]["bool"]["must"][andCounter]["bool"]["should"][orCounter] = {};
			qryObj["query"]["filtered"]["query"]["bool"]["must"][andCounter]["bool"]["should"][orCounter]["wildcard"] = {};
			qryObj["query"]["filtered"]["query"]["bool"]["must"][andCounter]["bool"]["should"][orCounter]["wildcard"]["marine_zone_code.exactWords"] = data.textObject.toLowerCase();
			orCounter+=1;
		});
		andCounter+=1;
	}
	if(conditions.providers) {
		orCounter = 0;
		qryObj["query"]["filtered"]["query"]["bool"]["must"][andCounter] = {};
		qryObj["query"]["filtered"]["query"]["bool"]["must"][andCounter]["bool"] = {};
		qryObj["query"]["filtered"]["query"]["bool"]["must"][andCounter]["bool"]["should"] = [];
		_.each(conditions.providers, function(data) {
			qryObj["query"]["filtered"]["query"]["bool"]["must"][andCounter]["bool"]["should"][orCounter] = {};
			qryObj["query"]["filtered"]["query"]["bool"]["must"][andCounter]["bool"]["should"][orCounter]["wildcard"] = {};
			qryObj["query"]["filtered"]["query"]["bool"]["must"][andCounter]["bool"]["should"][orCounter]["wildcard"]["provider.name.exactWords"] = data.textObject.toLowerCase();
			orCounter+=1;
		});
		andCounter+=1;
	}
	if(conditions.resources) {
		orCounter = 0;
		qryObj["query"]["filtered"]["query"]["bool"]["must"][andCounter] = {};
		qryObj["query"]["filtered"]["query"]["bool"]["must"][andCounter]["bool"] = {};
		qryObj["query"]["filtered"]["query"]["bool"]["must"][andCounter]["bool"]["should"] = [];
		_.each(conditions.resources, function(data) {
			qryObj["query"]["filtered"]["query"]["bool"]["must"][andCounter]["bool"]["should"][orCounter] = {};
			qryObj["query"]["filtered"]["query"]["bool"]["must"][andCounter]["bool"]["should"][orCounter]["wildcard"] = {};

			qryObj["query"]["filtered"]["query"]["bool"]["must"][andCounter]["bool"]["should"][orCounter]["wildcard"]["resource.name.exactWords"] = data.textObject.toLowerCase();
			orCounter+=1;
		});
		andCounter+=1;
	}
	if(conditions.latitudes) {
		orCounter = 0;
		qryObj["query"]["filtered"]["query"]["bool"]["must"][andCounter] = {};
		qryObj["query"]["filtered"]["query"]["bool"]["must"][andCounter]["bool"] = {};
		qryObj["query"]["filtered"]["query"]["bool"]["must"][andCounter]["bool"]["must"] = [];
		_.each(conditions.latitudes, function(data) {
			qryObj["query"]["filtered"]["query"]["bool"]["must"][andCounter]["bool"]["must"][orCounter] = {};
			if(data.predicate == "eq") {
				qryObj["query"]["filtered"]["query"]["bool"]["must"][andCounter]["bool"]["must"][orCounter]["range"] = {};
				qryObj["query"]["filtered"]["query"]["bool"]["must"][andCounter]["bool"]["must"][orCounter]["range"]["location.lat"] = {};
				qryObj["query"]["filtered"]["query"]["bool"]["must"][andCounter]["bool"]["must"][orCounter]["range"]["location.lat"]["gte"] = data.textObject.toLowerCase();
				qryObj["query"]["filtered"]["query"]["bool"]["must"][andCounter]["bool"]["must"][orCounter]["range"]["location.lat"]["lte"] = data.textObject.toLowerCase();
			} else if(data.predicate == "gt") {
				qryObj["query"]["filtered"]["query"]["bool"]["must"][andCounter]["bool"]["must"][orCounter]["range"] = {};
				qryObj["query"]["filtered"]["query"]["bool"]["must"][andCounter]["bool"]["must"][orCounter]["range"]["location.lat"] = {};
				qryObj["query"]["filtered"]["query"]["bool"]["must"][andCounter]["bool"]["must"][orCounter]["range"]["location.lat"]["gt"] = data.textObject.toLowerCase();
			} else if(data.predicate == "lt") {
				qryObj["query"]["filtered"]["query"]["bool"]["must"][andCounter]["bool"]["must"][orCounter]["range"] = {};
				qryObj["query"]["filtered"]["query"]["bool"]["must"][andCounter]["bool"]["must"][orCounter]["range"]["location.lat"] = {};
				qryObj["query"]["filtered"]["query"]["bool"]["must"][andCounter]["bool"]["must"][orCounter]["range"]["location.lat"]["lt"] = data.textObject.toLowerCase();
			}
			orCounter+=1;
		});
		andCounter+=1;
	}
	if(conditions.longitudes) {
		orCounter = 0;
		qryObj["query"]["filtered"]["query"]["bool"]["must"][andCounter] = {};
		qryObj["query"]["filtered"]["query"]["bool"]["must"][andCounter]["bool"] = {};
		qryObj["query"]["filtered"]["query"]["bool"]["must"][andCounter]["bool"]["must"] = [];
		_.each(conditions.longitudes, function(data) {
			qryObj["query"]["filtered"]["query"]["bool"]["must"][andCounter]["bool"]["must"][orCounter] = {};
			if(data.predicate == "eq") {
				qryObj["query"]["filtered"]["query"]["bool"]["must"][andCounter]["bool"]["must"][orCounter]["range"] = {};
				qryObj["query"]["filtered"]["query"]["bool"]["must"][andCounter]["bool"]["must"][orCounter]["range"]["location.lon"] = {};
				qryObj["query"]["filtered"]["query"]["bool"]["must"][andCounter]["bool"]["must"][orCounter]["range"]["location.lon"]["gte"] = data.textObject.toLowerCase();
				qryObj["query"]["filtered"]["query"]["bool"]["must"][andCounter]["bool"]["must"][orCounter]["range"]["location.lon"]["lte"] = data.textObject.toLowerCase();
			} else if(data.predicate == "gt") {
				qryObj["query"]["filtered"]["query"]["bool"]["must"][andCounter]["bool"]["must"][orCounter]["range"] = {};
				qryObj["query"]["filtered"]["query"]["bool"]["must"][andCounter]["bool"]["must"][orCounter]["range"]["location.lon"] = {};
				qryObj["query"]["filtered"]["query"]["bool"]["must"][andCounter]["bool"]["must"][orCounter]["range"]["location.lon"]["gt"] = data.textObject.toLowerCase();
			} else if(data.predicate == "lt") {
				qryObj["query"]["filtered"]["query"]["bool"]["must"][andCounter]["bool"]["must"][orCounter]["range"] = {};
				qryObj["query"]["filtered"]["query"]["bool"]["must"][andCounter]["bool"]["must"][orCounter]["range"]["location.lon"] = {};
				qryObj["query"]["filtered"]["query"]["bool"]["must"][andCounter]["bool"]["must"][orCounter]["range"]["location.lon"]["lt"] = data.textObject.toLowerCase();
			}
			orCounter+=1;
		});
		andCounter+=1;
	}
	if(conditions.altitudes) {
		orCounter = 0;
		qryObj["query"]["filtered"]["query"]["bool"]["must"][andCounter] = {};
		qryObj["query"]["filtered"]["query"]["bool"]["must"][andCounter]["bool"] = {};
		qryObj["query"]["filtered"]["query"]["bool"]["must"][andCounter]["bool"]["must"] = [];
		_.each(conditions.altitudes, function(data) {
			qryObj["query"]["filtered"]["query"]["bool"]["must"][andCounter]["bool"]["must"][orCounter] = {};
			if(data.predicate == "eq") {
				qryObj["query"]["filtered"]["query"]["bool"]["must"][andCounter]["bool"]["must"][orCounter]["range"] = {};
				qryObj["query"]["filtered"]["query"]["bool"]["must"][andCounter]["bool"]["must"][orCounter]["range"]["altitude_meters"] = {};
				qryObj["query"]["filtered"]["query"]["bool"]["must"][andCounter]["bool"]["must"][orCounter]["range"]["altitude_meters"]["gte"] = data.textObject.toLowerCase();
				qryObj["query"]["filtered"]["query"]["bool"]["must"][andCounter]["bool"]["must"][orCounter]["range"]["altitude_meters"]["lte"] = data.textObject.toLowerCase();
			} else if(data.predicate == "gt") {
				qryObj["query"]["filtered"]["query"]["bool"]["must"][andCounter]["bool"]["must"][orCounter]["range"] = {};
				qryObj["query"]["filtered"]["query"]["bool"]["must"][andCounter]["bool"]["must"][orCounter]["range"]["altitude_meters"] = {};
				qryObj["query"]["filtered"]["query"]["bool"]["must"][andCounter]["bool"]["must"][orCounter]["range"]["altitude_meters"]["gt"] = data.textObject.toLowerCase();
			} else if(data.predicate == "lt") {
				qryObj["query"]["filtered"]["query"]["bool"]["must"][andCounter]["bool"]["must"][orCounter]["range"] = {};
				qryObj["query"]["filtered"]["query"]["bool"]["must"][andCounter]["bool"]["must"][orCounter]["range"]["altitude_meters"] = {};
				qryObj["query"]["filtered"]["query"]["bool"]["must"][andCounter]["bool"]["must"][orCounter]["range"]["altitude_meters"]["lt"] = data.textObject.toLowerCase();
			}
			orCounter+=1;
		});
		andCounter+=1;
	}
	if(conditions.deeps) {
		orCounter = 0;
		qryObj["query"]["filtered"]["query"]["bool"]["must"][andCounter] = {};
		qryObj["query"]["filtered"]["query"]["bool"]["must"][andCounter]["bool"] = {};
		qryObj["query"]["filtered"]["query"]["bool"]["must"][andCounter]["bool"]["must"] = [];
		_.each(conditions.deeps, function(data) {
			qryObj["query"]["filtered"]["query"]["bool"]["must"][andCounter]["bool"]["must"][orCounter] = {};
			if(data.predicate == "eq") {
				qryObj["query"]["filtered"]["query"]["bool"]["must"][andCounter]["bool"]["must"][orCounter]["range"] = {};
				qryObj["query"]["filtered"]["query"]["bool"]["must"][andCounter]["bool"]["must"][orCounter]["range"]["depth_centimeters"] = {};
				qryObj["query"]["filtered"]["query"]["bool"]["must"][andCounter]["bool"]["must"][orCounter]["range"]["depth_centimeters"]["gte"] = data.textObject.toLowerCase();
				qryObj["query"]["filtered"]["query"]["bool"]["must"][andCounter]["bool"]["must"][orCounter]["range"]["depth_centimeters"]["lte"] = data.textObject.toLowerCase();
			} else if(data.predicate == "gt") {
				qryObj["query"]["filtered"]["query"]["bool"]["must"][andCounter]["bool"]["must"][orCounter]["range"] = {};
				qryObj["query"]["filtered"]["query"]["bool"]["must"][andCounter]["bool"]["must"][orCounter]["range"]["depth_centimeters"] = {};
				qryObj["query"]["filtered"]["query"]["bool"]["must"][andCounter]["bool"]["must"][orCounter]["range"]["depth_centimeters"]["gt"] = data.textObject.toLowerCase();
			} else if(data.predicate == "lt") {
				qryObj["query"]["filtered"]["query"]["bool"]["must"][andCounter]["bool"]["must"][orCounter]["range"] = {};
				qryObj["query"]["filtered"]["query"]["bool"]["must"][andCounter]["bool"]["must"][orCounter]["range"]["depth_centimeters"] = {};
				qryObj["query"]["filtered"]["query"]["bool"]["must"][andCounter]["bool"]["must"][orCounter]["range"]["depth_centimeters"]["lt"] = data.textObject.toLowerCase();
			}
			orCounter+=1;
		});
		andCounter+=1;
	}
	if(conditions.poligonalCoordinates || conditions.radialCoordinates || conditions.latitudes) {
		if(conditions.poligonalCoordinates) {
			orCounter = 0;
			qryObj["query"]["filtered"]["filter"]["bool"]["must"][2] = {};
			qryObj["query"]["filtered"]["filter"]["bool"]["must"][2]["geo_polygon"] = {};
			qryObj["query"]["filtered"]["filter"]["bool"]["must"][2]["geo_polygon"]["location"] = {};
			qryObj["query"]["filtered"]["filter"]["bool"]["must"][2]["geo_polygon"]["location"]["points"] = [];
			_.each(conditions.poligonalCoordinates, function(data) {
				qryObj["query"]["filtered"]["filter"]["bool"]["must"][2]["geo_polygon"]["location"]["points"][orCounter] = {"lat": data.lat, "lon": data.lng};
				orCounter+=1;
			});
		}
		if(conditions.radialCoordinates) {
			qryObj["query"]["filtered"]["filter"]["bool"]["must"][2] = {};
			qryObj["query"]["filtered"]["filter"]["bool"]["must"][2]["geo_distance"] = {};
			_.each(conditions.radialCoordinates, function(data) {
				qryObj["query"]["filtered"]["filter"]["bool"]["must"][2]["geo_distance"]["distance"] = data.radius + "m";
				qryObj["query"]["filtered"]["filter"]["bool"]["must"][2]["geo_distance"]["location"] = {"lat": data.lat, "lon": data.lng};
			});
		}
	} else {
		qryObj["query"]["filtered"]["filter"]["bool"]["must"][2] = {};
		qryObj["query"]["filtered"]["filter"]["bool"]["must"][2]["exists"] = {};
		qryObj["query"]["filtered"]["filter"]["bool"]["must"][2]["exists"]["field"] = "cell_id";
	}
	if(qryObj["query"]["filtered"]["query"]["bool"]["must"].length === 0) {
		qryObj["query"]["filtered"]["query"]["bool"]["must"][andCounter] = {};
		qryObj["query"]["filtered"]["query"]["bool"]["must"][andCounter]["match_all"] = {};
		andCounter+=1;
	}
	mySearchCall = elasticSearchClient.search('sibexplorer', 'occurrences', qryObj);
	return mySearchCall;
};

exports.getOccurrencesWithFilter = function(conditions) {
	var qryObj = {};
	var condition1 = {}
		, condition2 = {};
	var logic
		, logic2;
	var haveQuery = false;
	var countFilter = 0;
	qryObj["_source"] = ["id", "canonical", "nombre_comun", "resource.name", "institution.code", "collection.code", "catalogue.number", "catalogue.id", "occurrence_date", "modified", "location", "country_name", "department_name", "basis_of_record.name_spanish"];

	// Default, filter deleted occurrences
	qryObj["query"] = {};
	qryObj["query"]["filtered"] = {};
	qryObj["query"]["filtered"]["filter"] = {};
	qryObj["query"]["filtered"]["filter"]["bool"] = {};
	qryObj["query"]["filtered"]["filter"]["bool"]["must"] = [];
	qryObj["query"]["filtered"]["filter"]["bool"]["must_not"] = [];
	qryObj["query"]["filtered"]["filter"]["bool"]["should"] = [];
	qryObj["query"]["filtered"]["filter"]["bool"]["must"][0] =
		{
			missing: {
				field : "deleted"
			}
		};
	countFilter++;

	if((typeof conditions.filter != 'undefined') && (typeof conditions.filter.filters != 'undefined')) {
		qryObj["query"]["filtered"]["query"] = {};
		qryObj["query"]["filtered"]["query"]["bool"] = {};
		qryObj["query"]["filtered"]["query"]["bool"]["must"] = [];
		qryObj["query"]["filtered"]["query"]["bool"]["should"] = [];
		if(conditions.filter.logic == 'and') {
			logic = qryObj["query"]["filtered"]["query"]["bool"]["must"];
		} else if(conditions.filter.logic == 'or') {
			logic = qryObj["query"]["filtered"]["query"]["bool"]["should"];
		}
		for (var counter in conditions.filter.filters) {
			if(typeof conditions.filter.filters[counter].filters != 'undefined') {
				// Internal concatenated condition (multiple logic operators)
				logic[counter] = {};
				logic[counter]["bool"] = {};
				logic[counter]["bool"]["must"] = [];
				logic[counter]["bool"]["should"] = [];
				if(conditions.filter.filters[counter].logic == 'and') {
					logic2 = logic[counter]["bool"]["must"];
				} else if(conditions.filter.filters[counter].logic == 'or') {
					logic2 = logic[counter]["bool"]["should"];
				}
				if(conditions.filter.filters[counter].filters[0].operator == 'eq' || conditions.filter.filters[counter].filters[0].operator == 'neq') {
					if(conditions.filter.filters[counter].filters[0].field == 'occurrence_date') {
						var date = moment(new Date(conditions.filter.filters[counter].filters[0].value));
						if(conditions.filter.filters[counter].filters[0].operator == 'neq') {
							qryObj["query"]["filtered"]["filter"]["bool"]["must_not"][countFilter] = {};
							qryObj["query"]["filtered"]["filter"]["bool"]["must_not"][countFilter]["numeric_range"] = {};
							qryObj["query"]["filtered"]["filter"]["bool"]["must_not"][countFilter]["numeric_range"]["occurrence_date"] = {};
							qryObj["query"]["filtered"]["filter"]["bool"]["must_not"][countFilter]["numeric_range"]["occurrence_date"]['gte'] = date.format('YYYY-MM-DD');
							qryObj["query"]["filtered"]["filter"]["bool"]["must_not"][countFilter]["numeric_range"]["occurrence_date"]['lte'] = date.format('YYYY-MM-DD');
							countFilter++;
						} else {
							qryObj["query"]["filtered"]["filter"]["bool"]["must"][countFilter] = {};
							qryObj["query"]["filtered"]["filter"]["bool"]["must"][countFilter]["numeric_range"] = {};
							qryObj["query"]["filtered"]["filter"]["bool"]["must"][countFilter]["numeric_range"]["occurrence_date"] = {};
							qryObj["query"]["filtered"]["filter"]["bool"]["must"][countFilter]["numeric_range"]["occurrence_date"]['gte'] = date.format('YYYY-MM-DD');
							qryObj["query"]["filtered"]["filter"]["bool"]["must"][countFilter]["numeric_range"]["occurrence_date"]['lte'] = date.format('YYYY-MM-DD');
							countFilter++;
						}
					} else {
						haveQuery = true;
						if(conditions.filter.filters[counter].filters[0].operator == 'neq') {
							logic2[0] = {};
							logic2[0]["bool"] = {};
							logic2[0]["bool"]["must_not"] = {};
							logic2[0]["bool"]["must_not"]["term"] = {};
							logic2[0]["bool"]["must_not"]["term"][databaseSearchMapping[conditions.filter.filters[counter].filters[0].field]] = conditions.filter.filters[counter].filters[0].value.toLowerCase();
						} else {
							logic2[0] = {};
							logic2[0]["term"] = {};
							logic2[0]["term"][databaseSearchMapping[conditions.filter.filters[counter].filters[0].field]] = conditions.filter.filters[counter].filters[0].value.toLowerCase();
						}
					}
				} else if(conditions.filter.filters[counter].filters[0].operator == 'contains' || conditions.filter.filters[counter].filters[0].operator == 'doesnotcontain') {
					haveQuery = true;
					if(conditions.filter.filters[counter].filters[0].operator == 'doesnotcontain') {
						logic2[0] = {};
						logic2[0]["bool"] = {};
						logic2[0]["bool"]["must_not"] = {};
						logic2[0]["bool"]["must_not"]["wildcard"] = {};
						logic2[0]["bool"]["must_not"]["wildcard"][databaseSearchMapping[conditions.filter.filters[counter].filters[0].field]] = "*"+conditions.filter.filters[counter].filters[0].value.toLowerCase()+"*";
					} else {
						logic2[0] = {};
						logic2[0]["wildcard"] = {};
						logic2[0]["wildcard"][databaseSearchMapping[conditions.filter.filters[counter].filters[0].field]] = "*"+conditions.filter.filters[counter].filters[0].value.toLowerCase()+"*";
					}
				} else if(conditions.filter.filters[counter].filters[0].operator == 'startswith') {
					haveQuery = true;
					logic2[counter] = {};
					logic2[counter]["wildcard"] = {};
					logic2[counter]["wildcard"][databaseSearchMapping[conditions.filter.filters[counter].filters[0].field]] = conditions.filter.filters[counter].filters[0].value.toLowerCase()+"*";
				} else if(conditions.filter.filters[counter].filters[0].operator == 'endswith') {
					haveQuery = true;
					logic2[counter] = {};
					logic2[counter]["wildcard"] = {};
					logic2[counter]["wildcard"][databaseSearchMapping[conditions.filter.filters[counter].filters[0].field]] = "*"+conditions.filter.filters[counter].filters[0].value.toLowerCase();
				} else if(conditions.filter.filters[counter].filters[0].operator == 'gt' || conditions.filter.filters[counter].filters[0].operator == 'gte' || conditions.filter.filters[counter].filters[0].operator == 'lt' || conditions.filter.filters[counter].filters[0].operator == 'lte') {
					var date = moment(new Date(conditions.filter.filters[counter].filters[0].value));
					if(conditions.filter.filters[counter].logic == 'and') {
						qryObj["query"]["filtered"]["filter"]["bool"]["must"][countFilter] = {};
						qryObj["query"]["filtered"]["filter"]["bool"]["must"][countFilter]["numeric_range"] = {};
						qryObj["query"]["filtered"]["filter"]["bool"]["must"][countFilter]["numeric_range"]["occurrence_date"] = {};
						qryObj["query"]["filtered"]["filter"]["bool"]["must"][countFilter]["numeric_range"]["occurrence_date"][conditions.filter.filters[counter].filters[0].operator] = date.format('YYYY-MM-DD');
					} else if(conditions.filter.filters[counter].logic == 'or') {
						qryObj["query"]["filtered"]["filter"]["bool"]["should"][countFilter] = {};
						qryObj["query"]["filtered"]["filter"]["bool"]["should"][countFilter]["numeric_range"] = {};
						qryObj["query"]["filtered"]["filter"]["bool"]["should"][countFilter]["numeric_range"]["occurrence_date"] = {};
						qryObj["query"]["filtered"]["filter"]["bool"]["should"][countFilter]["numeric_range"]["occurrence_date"][conditions.filter.filters[counter].filters[0].operator] = date.format('YYYY-MM-DD');
					}
					countFilter++;
				}
				if(conditions.filter.filters[counter].filters[1].operator == 'eq' || conditions.filter.filters[counter].filters[1].operator == 'neq') {
					if(conditions.filter.filters[counter].filters[1].field == 'occurrence_date') {
						var date = moment(new Date(conditions.filter.filters[counter].filters[1].value));
						if(conditions.filter.filters[counter].filters[1].operator == 'neq') {
							qryObj["query"]["filtered"]["filter"]["bool"]["must_not"][countFilter] = {};
							qryObj["query"]["filtered"]["filter"]["bool"]["must_not"][countFilter]["numeric_range"] = {};
							qryObj["query"]["filtered"]["filter"]["bool"]["must_not"][countFilter]["numeric_range"]["occurrence_date"] = {};
							qryObj["query"]["filtered"]["filter"]["bool"]["must_not"][countFilter]["numeric_range"]["occurrence_date"]['gte'] = date.format('YYYY-MM-DD');
							qryObj["query"]["filtered"]["filter"]["bool"]["must_not"][countFilter]["numeric_range"]["occurrence_date"]['lte'] = date.format('YYYY-MM-DD');
							countFilter++;
						} else {
							qryObj["query"]["filtered"]["filter"]["bool"]["must"][countFilter] = {};
							qryObj["query"]["filtered"]["filter"]["bool"]["must"][countFilter]["numeric_range"] = {};
							qryObj["query"]["filtered"]["filter"]["bool"]["must"][countFilter]["numeric_range"]["occurrence_date"] = {};
							qryObj["query"]["filtered"]["filter"]["bool"]["must"][countFilter]["numeric_range"]["occurrence_date"]['gte'] = date.format('YYYY-MM-DD');
							qryObj["query"]["filtered"]["filter"]["bool"]["must"][countFilter]["numeric_range"]["occurrence_date"]['lte'] = date.format('YYYY-MM-DD');
							countFilter++;
						}
					} else {
						haveQuery = true;
						if(conditions.filter.filters[counter].filters[1].operator == 'neq') {
							logic2[1] = {};
							logic2[1]["bool"] = {};
							logic2[1]["bool"]["must_not"] = {};
							logic2[1]["bool"]["must_not"]["term"] = {};
							logic2[1]["bool"]["must_not"]["term"][databaseSearchMapping[conditions.filter.filters[counter].filters[1].field]] = conditions.filter.filters[counter].filters[1].value.toLowerCase();
						} else {
							logic2[1] = {};
							logic2[1]["term"] = {};
							logic2[1]["term"][databaseSearchMapping[conditions.filter.filters[counter].filters[1].field]] = conditions.filter.filters[counter].filters[1].value.toLowerCase();
						}
					}
				} else if(conditions.filter.filters[counter].filters[1].operator == 'contains' || conditions.filter.filters[counter].filters[1].operator == 'doesnotcontain') {
					haveQuery = true;
					if(conditions.filter.filters[counter].filters[1].operator == 'doesnotcontain') {
						logic2[1] = {};
						logic2[1]["bool"] = {};
						logic2[1]["bool"]["must_not"] = {};
						logic2[1]["bool"]["must_not"]["wildcard"] = {};
						logic2[1]["bool"]["must_not"]["wildcard"][databaseSearchMapping[conditions.filter.filters[counter].filters[1].field]] = "*"+conditions.filter.filters[counter].filters[1].value.toLowerCase()+"*";
					} else {
						logic2[1] = {};
						logic2[1]["wildcard"] = {};
						logic2[1]["wildcard"][databaseSearchMapping[conditions.filter.filters[counter].filters[1].field]] = "*"+conditions.filter.filters[counter].filters[1].value.toLowerCase()+"*";
					}
				} else if(conditions.filter.filters[counter].filters[1].operator == 'startswith') {
					haveQuery = true;
					logic2[counter] = {};
					logic2[counter]["wildcard"] = {};
					logic2[counter]["wildcard"][databaseSearchMapping[conditions.filter.filters[counter].filters[1].field]] = conditions.filter.filters[counter].filters[1].value.toLowerCase()+"*";
				} else if(conditions.filter.filters[counter].filters[1].operator == 'endswith') {
					haveQuery = true;
					logic2[counter] = {};
					logic2[counter]["wildcard"] = {};
					logic2[counter]["wildcard"][databaseSearchMapping[conditions.filter.filters[counter].filters[1].field]] = "*"+conditions.filter.filters[counter].filters[1].value.toLowerCase();
				} else if(conditions.filter.filters[counter].filters[1].operator == 'gt' || conditions.filter.filters[counter].filters[1].operator == 'gte' || conditions.filter.filters[counter].filters[1].operator == 'lt' || conditions.filter.filters[counter].filters[1].operator == 'lte') {
					var date = moment(new Date(conditions.filter.filters[counter].filters[1].value));
					if(conditions.filter.filters[counter].logic == 'and') {
						qryObj["query"]["filtered"]["filter"]["bool"]["must"][countFilter] = {};
						qryObj["query"]["filtered"]["filter"]["bool"]["must"][countFilter]["numeric_range"] = {};
						qryObj["query"]["filtered"]["filter"]["bool"]["must"][countFilter]["numeric_range"]["occurrence_date"] = {};
						qryObj["query"]["filtered"]["filter"]["bool"]["must"][countFilter]["numeric_range"]["occurrence_date"][conditions.filter.filters[counter].filters[1].operator] = date.format('YYYY-MM-DD');
					} else if(conditions.filter.filters[counter].logic == 'or') {
						qryObj["query"]["filtered"]["filter"]["bool"]["should"][countFilter] = {};
						qryObj["query"]["filtered"]["filter"]["bool"]["should"][countFilter]["numeric_range"] = {};
						qryObj["query"]["filtered"]["filter"]["bool"]["should"][countFilter]["numeric_range"]["occurrence_date"] = {};
						qryObj["query"]["filtered"]["filter"]["bool"]["should"][countFilter]["numeric_range"]["occurrence_date"][conditions.filter.filters[counter].filters[1].operator] = date.format('YYYY-MM-DD');
					}
					countFilter++;
				}
			} else {
				// External condition of single logic operator

				if(conditions.filter.filters[counter].operator == 'eq' || conditions.filter.filters[counter].operator == 'neq') {
					if(conditions.filter.filters[counter].field == 'occurrence_date') {
						var date = moment(new Date(conditions.filter.filters[counter].value));
						if(conditions.filter.filters[counter].operator == 'neq') {
							qryObj["query"]["filtered"]["filter"]["bool"]["must_not"][countFilter] = {};
							qryObj["query"]["filtered"]["filter"]["bool"]["must_not"][countFilter]["numeric_range"] = {};
							qryObj["query"]["filtered"]["filter"]["bool"]["must_not"][countFilter]["numeric_range"]["occurrence_date"] = {};
							qryObj["query"]["filtered"]["filter"]["bool"]["must_not"][countFilter]["numeric_range"]["occurrence_date"]['gte'] = date.format('YYYY-MM-DD');
							qryObj["query"]["filtered"]["filter"]["bool"]["must_not"][countFilter]["numeric_range"]["occurrence_date"]['lte'] = date.format('YYYY-MM-DD');
							countFilter++;
						} else {
							qryObj["query"]["filtered"]["filter"]["bool"]["must"][countFilter] = {};
							qryObj["query"]["filtered"]["filter"]["bool"]["must"][countFilter]["numeric_range"] = {};
							qryObj["query"]["filtered"]["filter"]["bool"]["must"][countFilter]["numeric_range"]["occurrence_date"] = {};
							qryObj["query"]["filtered"]["filter"]["bool"]["must"][countFilter]["numeric_range"]["occurrence_date"]['gte'] = date.format('YYYY-MM-DD');
							qryObj["query"]["filtered"]["filter"]["bool"]["must"][countFilter]["numeric_range"]["occurrence_date"]['lte'] = date.format('YYYY-MM-DD');
							countFilter++;
						}
					} else {
						haveQuery = true;
						logic[counter] = {};
						if(conditions.filter.filters[counter].operator == 'neq') {
							logic[counter]["bool"] = {};
							logic[counter]["bool"]["must_not"] = {};
							logic[counter]["bool"]["must_not"]["term"] = {};
							logic[counter]["bool"]["must_not"]["term"][databaseSearchMapping[conditions.filter.filters[counter].field]] = conditions.filter.filters[counter].value.toLowerCase();
						} else {
							logic[counter]["term"] = {};
							logic[counter]["term"][databaseSearchMapping[conditions.filter.filters[counter].field]] = conditions.filter.filters[counter].value.toLowerCase();
						}
					}
				} else if(conditions.filter.filters[counter].operator == 'contains' || conditions.filter.filters[counter].operator == 'doesnotcontain') {
					haveQuery = true;
					logic[counter] = {};
					if(conditions.filter.filters[counter].operator == 'doesnotcontain') {
						logic[counter]["bool"] = {};
						logic[counter]["bool"]["must_not"] = {};
						logic[counter]["bool"]["must_not"]["wildcard"] = {};
						logic[counter]["bool"]["must_not"]["wildcard"][databaseSearchMapping[conditions.filter.filters[counter].field]] = "*"+conditions.filter.filters[counter].value.toLowerCase()+"*";
					} else {
						logic[counter]["wildcard"] = {};
						logic[counter]["wildcard"][databaseSearchMapping[conditions.filter.filters[counter].field]] = "*"+conditions.filter.filters[counter].value.toLowerCase()+"*";
					}
				} else if(conditions.filter.filters[counter].operator == 'startswith') {
					haveQuery = true;
					logic[counter] = {};
					logic[counter]["wildcard"] = {};
					logic[counter]["wildcard"][databaseSearchMapping[conditions.filter.filters[counter].field]] = conditions.filter.filters[counter].value.toLowerCase()+"*";
				} else if(conditions.filter.filters[counter].operator == 'endswith') {
					haveQuery = true;
					logic[counter] = {};
					logic[counter]["wildcard"] = {};
					logic[counter]["wildcard"][databaseSearchMapping[conditions.filter.filters[counter].field]] = "*"+conditions.filter.filters[counter].value.toLowerCase();
				} else if(conditions.filter.filters[counter].operator == 'gt' || conditions.filter.filters[counter].operator == 'gte' || conditions.filter.filters[counter].operator == 'lt' || conditions.filter.filters[counter].operator == 'lte') {
					var date = moment(conditions.filter.filters[counter].value);
					if(conditions.filter.logic == 'and') {
						qryObj["query"]["filtered"]["filter"]["bool"]["must"][countFilter] = {};
						qryObj["query"]["filtered"]["filter"]["bool"]["must"][countFilter]["numeric_range"] = {};
						qryObj["query"]["filtered"]["filter"]["bool"]["must"][countFilter]["numeric_range"]["occurrence_date"] = {};
						qryObj["query"]["filtered"]["filter"]["bool"]["must"][countFilter]["numeric_range"]["occurrence_date"][conditions.filter.filters[counter].operator] = date.format('YYYY-MM-DD');
					} else if(conditions.filter.logic == 'or') {
						qryObj["query"]["filtered"]["filter"]["bool"]["should"][countFilter] = {};
						qryObj["query"]["filtered"]["filter"]["bool"]["should"][countFilter]["numeric_range"] = {};
						qryObj["query"]["filtered"]["filter"]["bool"]["should"][countFilter]["numeric_range"]["occurrence_date"] = {};
						qryObj["query"]["filtered"]["filter"]["bool"]["should"][countFilter]["numeric_range"]["occurrence_date"][conditions.filter.filters[counter].operator] = date.format('YYYY-MM-DD');
					}
					countFilter++;
				}
			}
		}
		if(haveQuery === false) {
			qryObj["query"]["filtered"]["query"]["bool"]["must"][0] = {};
			qryObj["query"]["filtered"]["query"]["bool"]["must"][0]["match_all"] = {};
		}
	}

	qryObj["from"] = (conditions.page-1)*conditions.pageSize;
	qryObj["size"] = conditions.pageSize;

	// Sorting
	qryObj["sort"] = [];
	if(typeof conditions.sort != 'undefined') {
		for (var i in conditions.sort) {
			qryObj["sort"][i] = {};
			qryObj["sort"][i][databaseOrderMapping[conditions.sort[i].field]] = conditions.sort[i].dir;
		}
	} else {
		qryObj["sort"][0] = {};
		qryObj["sort"][0][databaseOrderMapping["canonical"]] = "asc";
	}

	mySearchCall = elasticSearchClient.search('sibexplorer', 'occurrences', qryObj);
	return mySearchCall;
};

exports.geoJsonMapPoints = function(parameters) {
	var qryObj = {
		"_source": ["id", "canonical", "location"],
		"sort": [ { "canonical.untouched": "asc" } ],
		"from": 0,
		"size" : 1000,
		"query": {
			"filtered": {
				"filter": {
					"bool": {
						"must": [
							{
								"missing": {
									"field": "deleted"
								}
							},
							{
								"term": {
									"geospatial_issue": 0,
								}
							},
							{
								"exists": {
									"field": "cell_id"
								}
							}
						]
					}
				},
				"query" : {
					"bool": {
						"must": []
					}
				}
			}
		}
	};
	qryObj["from"] = parameters.startindex || 0;
	if(parameters.maxresults) {
		if(parameters.maxresults > 1000) {
			qryObj["size"] = 1000;
		} else {
			qryObj["size"] = parameters.maxresults;
		}
	} else {
		qryObj["size"] = parameters.maxresults || 1000;
	}

	var andCounter = 0;
	var currentFilter = 1;

	if(parameters.scientificname) {
		qryObj["query"]["filtered"]["query"]["bool"]["must"][andCounter] = {};
		qryObj["query"]["filtered"]["query"]["bool"]["must"][andCounter]["wildcard"] = {};
		qryObj["query"]["filtered"]["query"]["bool"]["must"][andCounter]["wildcard"]["canonical.exactWords"] = parameters.scientificname.toLowerCase();
		andCounter+=1;
	}

	if(parameters.basisofrecord) {
		qryObj["query"]["filtered"]["query"]["bool"]["must"][andCounter] = {};
		qryObj["query"]["filtered"]["query"]["bool"]["must"][andCounter]["wildcard"] = {};
		qryObj["query"]["filtered"]["query"]["bool"]["must"][andCounter]["wildcard"]["basis_of_record.name_spanish.exactWords"] = parameters.basisofrecord.toLowerCase();
		andCounter+=1;
	}

	if(parameters.departmentname) {
		qryObj["query"]["filtered"]["query"]["bool"]["must"][andCounter] = {};
		qryObj["query"]["filtered"]["query"]["bool"]["must"][andCounter]["wildcard"] = {};
		qryObj["query"]["filtered"]["query"]["bool"]["must"][andCounter]["wildcard"]["department_name.exactWords"] = parameters.departmentname.toLowerCase();
		andCounter+=1;
	}

	if(parameters.locality) {
		qryObj["query"]["filtered"]["query"]["bool"]["must"][andCounter] = {};
		qryObj["query"]["filtered"]["query"]["bool"]["must"][andCounter]["wildcard"] = {};
		qryObj["query"]["filtered"]["query"]["bool"]["must"][andCounter]["wildcard"]["locality.exactWords"] = parameters.locality.toLowerCase();
		andCounter+=1;
	}

	if(parameters.taxonname) {
		qryObj["query"]["filtered"]["query"]["bool"]["must"][andCounter] = {};
		qryObj["query"]["filtered"]["query"]["bool"]["must"][andCounter]["bool"] = {};
		qryObj["query"]["filtered"]["query"]["bool"]["must"][andCounter]["bool"]["should"] = [];
		qryObj["query"]["filtered"]["query"]["bool"]["must"][andCounter]["bool"]["should"][0] = {};
		qryObj["query"]["filtered"]["query"]["bool"]["must"][andCounter]["bool"]["should"][0]["wildcard"] = {};
		qryObj["query"]["filtered"]["query"]["bool"]["must"][andCounter]["bool"]["should"][0]["wildcard"]["taxonomy.kingdom_name.exactWords"] = parameters.taxonname.toLowerCase();
		qryObj["query"]["filtered"]["query"]["bool"]["must"][andCounter]["bool"]["should"][1] = {};
		qryObj["query"]["filtered"]["query"]["bool"]["must"][andCounter]["bool"]["should"][1]["wildcard"] = {};
		qryObj["query"]["filtered"]["query"]["bool"]["must"][andCounter]["bool"]["should"][1]["wildcard"]["taxonomy.phylum_name.exactWords"] = parameters.taxonname.toLowerCase();
		qryObj["query"]["filtered"]["query"]["bool"]["must"][andCounter]["bool"]["should"][2] = {};
		qryObj["query"]["filtered"]["query"]["bool"]["must"][andCounter]["bool"]["should"][2]["wildcard"] = {};
		qryObj["query"]["filtered"]["query"]["bool"]["must"][andCounter]["bool"]["should"][2]["wildcard"]["taxonomy.class_name.exactWords"] = parameters.taxonname.toLowerCase();
		qryObj["query"]["filtered"]["query"]["bool"]["must"][andCounter]["bool"]["should"][3] = {};
		qryObj["query"]["filtered"]["query"]["bool"]["must"][andCounter]["bool"]["should"][3]["wildcard"] = {};
		qryObj["query"]["filtered"]["query"]["bool"]["must"][andCounter]["bool"]["should"][3]["wildcard"]["taxonomy.order_name.exactWords"] = parameters.taxonname.toLowerCase();
		qryObj["query"]["filtered"]["query"]["bool"]["must"][andCounter]["bool"]["should"][4] = {};
		qryObj["query"]["filtered"]["query"]["bool"]["must"][andCounter]["bool"]["should"][4]["wildcard"] = {};
		qryObj["query"]["filtered"]["query"]["bool"]["must"][andCounter]["bool"]["should"][4]["wildcard"]["taxonomy.family_name.exactWords"] = parameters.taxonname.toLowerCase();
		qryObj["query"]["filtered"]["query"]["bool"]["must"][andCounter]["bool"]["should"][5] = {};
		qryObj["query"]["filtered"]["query"]["bool"]["must"][andCounter]["bool"]["should"][5]["wildcard"] = {};
		qryObj["query"]["filtered"]["query"]["bool"]["must"][andCounter]["bool"]["should"][5]["wildcard"]["taxonomy.genus_name.exactWords"] = parameters.taxonname.toLowerCase();
		qryObj["query"]["filtered"]["query"]["bool"]["must"][andCounter]["bool"]["should"][6] = {};
		qryObj["query"]["filtered"]["query"]["bool"]["must"][andCounter]["bool"]["should"][6]["wildcard"] = {};
		qryObj["query"]["filtered"]["query"]["bool"]["must"][andCounter]["bool"]["should"][6]["wildcard"]["taxonomy.species_name.exactWords"] = parameters.taxonname.toLowerCase();
		andCounter+=1;
	}

	if(parameters.originisocountrycode) {
		qryObj["query"]["filtered"]["query"]["bool"]["must"][andCounter] = {};
		qryObj["query"]["filtered"]["query"]["bool"]["must"][andCounter]["wildcard"] = {};
		qryObj["query"]["filtered"]["query"]["bool"]["must"][andCounter]["wildcard"]["iso_country_code.exactWords"] = parameters.originisocountrycode.toLowerCase();
		andCounter+=1;
	}

	if(parameters.commonname) {
		qryObj["query"]["filtered"]["query"]["bool"]["must"][andCounter] = {};
		qryObj["query"]["filtered"]["query"]["bool"]["must"][andCounter]["nested"] = {};
		qryObj["query"]["filtered"]["query"]["bool"]["must"][andCounter]["nested"]["path"] = "common_names";
		qryObj["query"]["filtered"]["query"]["bool"]["must"][andCounter]["nested"]["query"] = {};
		qryObj["query"]["filtered"]["query"]["bool"]["must"][andCounter]["nested"]["query"]["wildcard"] = {};
		qryObj["query"]["filtered"]["query"]["bool"]["must"][andCounter]["nested"]["query"]["wildcard"]["common_names.name.exactWords"] = parameters.commonname.toLowerCase();
		andCounter+=1;
	}

	if(parameters.taxonconceptkey) {
		qryObj["query"]["filtered"]["query"]["bool"]["must"][andCounter] = {};
		qryObj["query"]["filtered"]["query"]["bool"]["must"][andCounter]["bool"] = {};
		qryObj["query"]["filtered"]["query"]["bool"]["must"][andCounter]["bool"]["should"] = [];
		qryObj["query"]["filtered"]["query"]["bool"]["must"][andCounter]["bool"]["should"][0] = {};
		qryObj["query"]["filtered"]["query"]["bool"]["must"][andCounter]["bool"]["should"][0]["term"] = {};
		qryObj["query"]["filtered"]["query"]["bool"]["must"][andCounter]["bool"]["should"][0]["term"]["taxonomy.kingdom_id"] = parameters.taxonconceptkey.toLowerCase();
		qryObj["query"]["filtered"]["query"]["bool"]["must"][andCounter]["bool"]["should"][1] = {};
		qryObj["query"]["filtered"]["query"]["bool"]["must"][andCounter]["bool"]["should"][1]["term"] = {};
		qryObj["query"]["filtered"]["query"]["bool"]["must"][andCounter]["bool"]["should"][1]["term"]["taxonomy.phylum_id"] = parameters.taxonconceptkey.toLowerCase();
		qryObj["query"]["filtered"]["query"]["bool"]["must"][andCounter]["bool"]["should"][2] = {};
		qryObj["query"]["filtered"]["query"]["bool"]["must"][andCounter]["bool"]["should"][2]["term"] = {};
		qryObj["query"]["filtered"]["query"]["bool"]["must"][andCounter]["bool"]["should"][2]["term"]["taxonomy.class_id"] = parameters.taxonconceptkey.toLowerCase();
		qryObj["query"]["filtered"]["query"]["bool"]["must"][andCounter]["bool"]["should"][3] = {};
		qryObj["query"]["filtered"]["query"]["bool"]["must"][andCounter]["bool"]["should"][3]["term"] = {};
		qryObj["query"]["filtered"]["query"]["bool"]["must"][andCounter]["bool"]["should"][3]["term"]["taxonomy.order_id"] = parameters.taxonconceptkey.toLowerCase();
		qryObj["query"]["filtered"]["query"]["bool"]["must"][andCounter]["bool"]["should"][4] = {};
		qryObj["query"]["filtered"]["query"]["bool"]["must"][andCounter]["bool"]["should"][4]["term"] = {};
		qryObj["query"]["filtered"]["query"]["bool"]["must"][andCounter]["bool"]["should"][4]["term"]["taxonomy.family_id"] = parameters.taxonconceptkey.toLowerCase();
		qryObj["query"]["filtered"]["query"]["bool"]["must"][andCounter]["bool"]["should"][5] = {};
		qryObj["query"]["filtered"]["query"]["bool"]["must"][andCounter]["bool"]["should"][5]["term"] = {};
		qryObj["query"]["filtered"]["query"]["bool"]["must"][andCounter]["bool"]["should"][5]["term"]["taxonomy.genus_id"] = parameters.taxonconceptkey.toLowerCase();
		qryObj["query"]["filtered"]["query"]["bool"]["must"][andCounter]["bool"]["should"][6] = {};
		qryObj["query"]["filtered"]["query"]["bool"]["must"][andCounter]["bool"]["should"][6]["term"] = {};
		qryObj["query"]["filtered"]["query"]["bool"]["must"][andCounter]["bool"]["should"][6]["term"]["taxonomy.species_id"] = parameters.taxonconceptkey.toLowerCase();
		andCounter+=1;
	}

	if(parameters.dataproviderkey) {
		qryObj["query"]["filtered"]["query"]["bool"]["must"][andCounter] = {};
		qryObj["query"]["filtered"]["query"]["bool"]["must"][andCounter]["term"] = {};
		qryObj["query"]["filtered"]["query"]["bool"]["must"][andCounter]["term"]["provider.id"] = parameters.dataproviderkey.toLowerCase();
		andCounter+=1;
	}

	if(parameters.dataresourcekey) {
		qryObj["query"]["filtered"]["query"]["bool"]["must"][andCounter] = {};
		qryObj["query"]["filtered"]["query"]["bool"]["must"][andCounter]["term"] = {};
		qryObj["query"]["filtered"]["query"]["bool"]["must"][andCounter]["term"]["resource.id"] = parameters.dataresourcekey.toLowerCase();
		andCounter+=1;
	}

	if(parameters.institutioncode) {
		qryObj["query"]["filtered"]["query"]["bool"]["must"][andCounter] = {};
		qryObj["query"]["filtered"]["query"]["bool"]["must"][andCounter]["wildcard"] = {};
		qryObj["query"]["filtered"]["query"]["bool"]["must"][andCounter]["wildcard"]["institution.code.exactWords"] = parameters.institutioncode.toLowerCase();
		andCounter+=1;
	}

	if(parameters.collectioncode) {
		qryObj["query"]["filtered"]["query"]["bool"]["must"][andCounter] = {};
		qryObj["query"]["filtered"]["query"]["bool"]["must"][andCounter]["wildcard"] = {};
		qryObj["query"]["filtered"]["query"]["bool"]["must"][andCounter]["wildcard"]["collection.code.exactWords"] = parameters.collectioncode.toLowerCase();
		andCounter+=1;
	}

	if(parameters.catalognumber) {
		qryObj["query"]["filtered"]["query"]["bool"]["must"][andCounter] = {};
		qryObj["query"]["filtered"]["query"]["bool"]["must"][andCounter]["wildcard"] = {};
		qryObj["query"]["filtered"]["query"]["bool"]["must"][andCounter]["wildcard"]["catalogue.number.exactWords"] = parameters.catalognumber.toLowerCase();
		andCounter+=1;
	}

	if(parameters.originisodepartmentcode) {
		qryObj["query"]["filtered"]["query"]["bool"]["must"][andCounter] = {};
		qryObj["query"]["filtered"]["query"]["bool"]["must"][andCounter]["wildcard"] = {};
		qryObj["query"]["filtered"]["query"]["bool"]["must"][andCounter]["wildcard"]["iso_department_code.exactWords"] = parameters.originisodepartmentcode.toLowerCase();
		andCounter+=1;
	}

	if(parameters.originisocountycode) {
		qryObj["query"]["filtered"]["query"]["bool"]["must"][andCounter] = {};
		qryObj["query"]["filtered"]["query"]["bool"]["must"][andCounter]["wildcard"] = {};
		qryObj["query"]["filtered"]["query"]["bool"]["must"][andCounter]["wildcard"]["iso_county_code.exactWords"] = parameters.originisocountycode.toLowerCase();
		andCounter+=1;
	}

	if(parameters.originparamocode) {
		qryObj["query"]["filtered"]["query"]["bool"]["must"][andCounter] = {};
		qryObj["query"]["filtered"]["query"]["bool"]["must"][andCounter]["wildcard"] = {};
		qryObj["query"]["filtered"]["query"]["bool"]["must"][andCounter]["wildcard"]["paramo_code.exactWords"] = parameters.originparamocode.toLowerCase();
		andCounter+=1;
	}

	if(parameters.originmarinezonecode) {
		qryObj["query"]["filtered"]["query"]["bool"]["must"][andCounter] = {};
		qryObj["query"]["filtered"]["query"]["bool"]["must"][andCounter]["wildcard"] = {};
		qryObj["query"]["filtered"]["query"]["bool"]["must"][andCounter]["wildcard"]["marine_zone_code.exactWords"] = parameters.originmarinezonecode.toLowerCase();
		andCounter+=1;
	}

	if(parameters.cellid) {
		qryObj["query"]["filtered"]["query"]["bool"]["must"][andCounter] = {};
		qryObj["query"]["filtered"]["query"]["bool"]["must"][andCounter]["term"] = {};
		qryObj["query"]["filtered"]["query"]["bool"]["must"][andCounter]["term"]["cell_id"] = parameters.cellid.toLowerCase();
		andCounter+=1;
	}

	if(parameters.centicellid) {
		qryObj["query"]["filtered"]["query"]["bool"]["must"][andCounter] = {};
		qryObj["query"]["filtered"]["query"]["bool"]["must"][andCounter]["term"] = {};
		qryObj["query"]["filtered"]["query"]["bool"]["must"][andCounter]["term"]["centi_cell_id"] = parameters.centicellid.toLowerCase();
		andCounter+=1;
	}

	if(parameters.pointfivecellid) {
		qryObj["query"]["filtered"]["query"]["bool"]["must"][andCounter] = {};
		qryObj["query"]["filtered"]["query"]["bool"]["must"][andCounter]["term"] = {};
		qryObj["query"]["filtered"]["query"]["bool"]["must"][andCounter]["term"]["pointfive_cell_id"] = parameters.pointfivecellid.toLowerCase();
		andCounter+=1;
	}

	if(parameters.pointtwocellid) {
		qryObj["query"]["filtered"]["query"]["bool"]["must"][andCounter] = {};
		qryObj["query"]["filtered"]["query"]["bool"]["must"][andCounter]["term"] = {};
		qryObj["query"]["filtered"]["query"]["bool"]["must"][andCounter]["term"]["pointtwo_cell_id"] = parameters.pointtwocellid.toLowerCase();
		andCounter+=1;
	}

	if(parameters.minlatitude || parameters.maxlatitude || parameters.minlongitude || parameters.maxlongitude) {
		qryObj["query"]["filtered"]["query"]["bool"]["must"][andCounter] = {};
		qryObj["query"]["filtered"]["query"]["bool"]["must"][andCounter]["geo_bounding_box"] = {};
		qryObj["query"]["filtered"]["query"]["bool"]["must"][andCounter]["geo_bounding_box"]["location"] = {};
		qryObj["query"]["filtered"]["query"]["bool"]["must"][andCounter]["geo_bounding_box"]["location"]["top_left"] = {};
		if(parameters.maxlatitude) {
			qryObj["query"]["filtered"]["query"]["bool"]["must"][andCounter]["geo_bounding_box"]["location"]["top_left"]["lat"] = parseInt(parameters.maxlatitude);
		} else {
			qryObj["query"]["filtered"]["query"]["bool"]["must"][andCounter]["geo_bounding_box"]["location"]["top_left"]["lat"] = 90;
		}
		if(parameters.minlongitude) {
			qryObj["query"]["filtered"]["query"]["bool"]["must"][andCounter]["geo_bounding_box"]["location"]["top_left"]["lon"] = parseInt(parameters.minlongitude);
		} else {
			qryObj["query"]["filtered"]["query"]["bool"]["must"][andCounter]["geo_bounding_box"]["location"]["top_left"]["lon"] = -180;
		}
		qryObj["query"]["filtered"]["query"]["bool"]["must"][andCounter]["geo_bounding_box"]["location"]["bottom_right"] = {};
		if(parameters.minlatitude) {
			qryObj["query"]["filtered"]["query"]["bool"]["must"][andCounter]["geo_bounding_box"]["location"]["bottom_right"]["lat"] = parseInt(parameters.minlatitude);
		} else {
			qryObj["query"]["filtered"]["query"]["bool"]["must"][andCounter]["geo_bounding_box"]["location"]["bottom_right"]["lat"] = -90;
		}
		if(parameters.maxlongitude) {
			qryObj["query"]["filtered"]["query"]["bool"]["must"][andCounter]["geo_bounding_box"]["location"]["bottom_right"]["lon"] = parseInt(parameters.maxlongitude);
		} else {
			qryObj["query"]["filtered"]["query"]["bool"]["must"][andCounter]["geo_bounding_box"]["location"]["bottom_right"]["lon"] = 179.999;
		}
		andCounter+=1;
	}

	if(parameters.mindepth || parameters.maxdepth) {
		qryObj["query"]["filtered"]["filter"][currentFilter] = {};
		qryObj["query"]["filtered"]["filter"][currentFilter]["numeric_range"] = {};
		qryObj["query"]["filtered"]["filter"][currentFilter]["numeric_range"]["altitude_metres"] = {};
		if(parameters.mindepth)
			qryObj["query"]["filtered"]["filter"][currentFilter]["numeric_range"]["altitude_metres"]["gte"] = parameters.mindepth;
		if(parameters.maxdepth)
			qryObj["query"]["filtered"]["filter"][currentFilter]["numeric_range"]["altitude_metres"]["lte"] = parameters.maxdepth;
		currentFilter+=1;
		andCounter+=1;
	}

	if(parameters.startdate || parameters.enddate) {
		qryObj["query"]["filtered"]["filter"][currentFilter] = {};
		qryObj["query"]["filtered"]["filter"][currentFilter]["numeric_range"] = {};
		qryObj["query"]["filtered"]["filter"][currentFilter]["numeric_range"]["created"] = {};
		if(parameters.startdate)
			qryObj["query"]["filtered"]["filter"][currentFilter]["numeric_range"]["created"]["gte"] = parameters.startdate + " 00:00:00";
		if(parameters.enddate)
			qryObj["query"]["filtered"]["filter"][currentFilter]["numeric_range"]["created"]["lte"] = parameters.enddate + " 00:00:00";
		currentFilter+=1;
		andCounter+=1;
	}

	if(parameters.startyear || parameters.endyear) {
		qryObj["query"]["filtered"]["filter"][currentFilter] = {};
		qryObj["query"]["filtered"]["filter"][currentFilter]["numeric_range"] = {};
		qryObj["query"]["filtered"]["filter"][currentFilter]["numeric_range"]["created"] = {};
		if(parameters.startyear)
			qryObj["query"]["filtered"]["filter"][currentFilter]["numeric_range"]["created"]["gte"] = parameters.startyear + "-01-01 00:00:00";
		if(parameters.endyear)
			qryObj["query"]["filtered"]["filter"][currentFilter]["numeric_range"]["created"]["lte"] = parameters.endyear + "-12-31 00:00:00";
		currentFilter+=1;
		andCounter+=1;
	}

	if(parameters.year) {
		qryObj["query"]["filtered"]["filter"][currentFilter] = {};
		qryObj["query"]["filtered"]["filter"][currentFilter]["numeric_range"] = {};
		qryObj["query"]["filtered"]["filter"][currentFilter]["numeric_range"]["created"] = {};
		qryObj["query"]["filtered"]["filter"][currentFilter]["numeric_range"]["created"]["gte"] = parameters.year + "-01-01 00:00:00";
		qryObj["query"]["filtered"]["filter"][currentFilter]["numeric_range"]["created"]["lte"] = parameters.year + "-12-31 00:00:00";
		currentFilter+=1;
		andCounter+=1;
	}

	if(parameters.modifiedsince) {
		qryObj["query"]["filtered"]["filter"][currentFilter] = {};
		qryObj["query"]["filtered"]["filter"][currentFilter]["numeric_range"] = {};
		qryObj["query"]["filtered"]["filter"][currentFilter]["numeric_range"]["modified"] = {};
		qryObj["query"]["filtered"]["filter"][currentFilter]["numeric_range"]["modified"]["gte"] = parameters.modifiedsince + " 00:00:00";
		currentFilter+=1;
		andCounter+=1;
	}

	mySearchCall = elasticSearchClient.search('sibexplorer', 'occurrences', qryObj);
	return mySearchCall;
};
