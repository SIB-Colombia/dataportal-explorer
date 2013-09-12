/**
 * Module dependencies.
 */
var mongodb = require('mongodb')
  , MongoClient = require('mongodb').MongoClient
  , Occurrence = mongoose.model('Occurrence')
  , OccurrenceES = mongoose.model('OccurrenceES')
  , GeoOccurrence = mongoose.model('GeoOccurrence')
  , GeoOccurrenceES = mongoose.model('GeoOccurrenceES')
  , GeneralIndicator = mongoose.model('GeneralIndicator')
  , CanonicalGroup = mongoose.model('CanonicalGroup')
  , KingdomGroup = mongoose.model('KingdomGroup')
  , PhylumGroup = mongoose.model('PhylumGroup')
  , ClassGroup = mongoose.model('ClassGroup')
  , OrderRankGroup = mongoose.model('OrderRankGroup')
  , FamilyGroup = mongoose.model('FamilyGroup')
  , GenusGroup = mongoose.model('GenusGroup')
  , SpeciesGroup = mongoose.model('SpeciesGroup')
  , CountriesGroup = mongoose.model('CountriesGroup')
  , DepartmentsGroup = mongoose.model('DepartmentsGroup')
  , DataProvidersGroup = mongoose.model('DataProvidersGroup')
  , DataResourcesGroup = mongoose.model('DataResourcesGroup')
  , InstitutionCodeGroup = mongoose.model('InstitutionCodeGroup')
  , CollectionCodeGroup = mongoose.model('CollectionCodeGroup')
  , HelpSearchText = mongoose.model('HelpSearchText')
  , async = require('async')

var dbWrapper = require("../../../lib/dbUtils");
var serverCluster = require("../../../lib/servercluster");
var markercluster = require("../../../lib/markercluster");

var inspect = require('util').inspect;
var Client = require('mariasql');

var occurrencesES = require("../../models/elasticsearch/occurrencesModel");

exports.name = 'main';
exports.engine = 'jade';

toBoundingBoxCell = function(cellId) {
	var longitude = (cellId % 360) - 180;
	var latitude = -90;
	if (cellId > 0) {
		latitude = Math.floor(cellId / 360) - 90;
	}
	var locationCellId = {lat: latitude, lon: longitude};
	return locationCellId;
};

toBoundingBoxCentiCell = function(cellId, centiCellId) {
	var longitudeX10 = 10 * ((cellId % 360) - 180);
	var latitudeX10 = -900;
	if (cellId > 0) {
		latitudeX10 = 10 * (Math.floor(cellId / 360) - 90);
	}

	var longOffset = (centiCellId % 10);
	var latOffset = 0;
	if (centiCellId > 0) {
		latOffset = (centiCellId / 10);
	}

	var minLatitude = (latitudeX10 + latOffset) / 10;
	minLatitude = Math.floor(minLatitude * 10 ) / 10;
	var minLongitude = (longitudeX10 + longOffset) / 10;
	minLongitude = Math.floor(minLongitude * 10 ) / 10;
	//var maxLatitude = (latitudeX10 + latOffset + 1) / 10;
	//var maxlongitude = (longitudeX10 + longOffset + 1) / 10;
	var locationCentiCellId = {lat: minLatitude, lon: minLongitude};
	return locationCentiCellId;
};

toBoundingBoxPointFiveCell = function(cellId, pointFiveCellId) {
	var longitudeX10 = 10 * ((cellId % 360) - 180);
	var latitudeX10 = -900;
	if (cellId > 0) {
		latitudeX10 = 10 * (Math.floor(cellId / 360) - 90);
	}

	var longOffset = (pointFiveCellId % 10);
	var latOffset = 0;
	if (pointFiveCellId > 0) {
		latOffset = (pointFiveCellId / 10);
	}

	var minLatitude = (latitudeX10 + latOffset) / 10;
	minLatitude = Math.floor(minLatitude * 10 ) / 10;
	var minLongitude = (longitudeX10 + longOffset) / 10;
	minLongitude = Math.floor(minLongitude * 10 ) / 10;
	var locationPointFiveCellId = {lat: minLatitude, lon: minLongitude};
	return locationPointFiveCellId;
};

toBoundingBoxPointTwoCell = function(cellId, pointTwoCellId) {
	var longitudeX10 = 10 * ((cellId % 360) - 180);
	var latitudeX10 = -900;
	if (cellId > 0) {
		latitudeX10 = 10 * (Math.floor(cellId / 360) - 90);
	}

	var longOffset = (pointTwoCellId % 10);
	var latOffset = 0;
	if (pointTwoCellId > 0) {
		latOffset = (pointTwoCellId / 10);
	}

	var minLatitude = (latitudeX10 + latOffset) / 10;
	minLatitude = Math.floor(minLatitude * 10 ) / 10;
	var minLongitude = (longitudeX10 + longOffset) / 10;
	minLongitude = Math.floor(minLongitude * 10 ) / 10;
	var locationPointTwoCellId = {lat: minLatitude, lon: minLongitude};
	return locationPointTwoCellId;
};

toPointFiveCellId = function(latitude, longitude) {
	if (latitude === null || latitude < -90 || latitude > 90 || longitude < -180 || longitude > 180) {
		logger.error("Latitude[" + latitude + "], Longitude[" + longitude + "] cannot be converted to a 0.5 cell id");
	} else {
		//get decimal value for up to 4 decimal places
		//17.2-> 172000 -> 2000
		var la = Math.abs(Math.floor((latitude * 10000) % 10000));
		if (latitude < 0)
			la = 10000 - la;
		la = Math.floor((la / 1000) % 10);
		if(la >= 0 && la < 5) {
			la = 0;
		} else {
			la = 5;
		}
		var lo = Math.abs(Math.floor((longitude * 10000) % 10000));
		if (longitude < 0)
			lo = 10000 - lo;
		lo = Math.floor((lo / 1000) % 10);
		if(lo >= 0 && lo < 5) {
			lo = 0;
		} else {
			lo = 5;
		}

		var pointFiveCellId = (la * 10) + lo;
		return Math.abs(pointFiveCellId);
	}
};

toPointTwoCellId = function(latitude, longitude) {
	if (latitude === null || latitude < -90 || latitude > 90 || longitude < -180 || longitude > 180) {
		logger.error("Latitude[" + latitude + "], Longitude[" + longitude + "] cannot be converted to a 0.5 cell id");
	} else {
		//get decimal value for up to 4 decimal places
		//17.2-> 172000 -> 2000
		var la = Math.abs(Math.floor((latitude * 10000) % 10000));
		if (latitude < 0)
			la = 10000 - la;
		la = Math.floor((la / 1000) % 10);
		if(la >= 0 && la < 2) {
			la = 0;
		} else if(la >= 2 && la < 4) {
			la = 2;
		} else if(la >= 4 && la < 6) {
			la = 4;
		} else if(la >= 6 && la < 8) {
			la = 6;
		} else if(la >= 8) {
			la = 8;
		}
		var lo = Math.abs(Math.floor((longitude * 10000) % 10000));
		if (longitude < 0)
			lo = 10000 - lo;
		lo = Math.floor((lo / 1000) % 10);
		if(lo >= 0 && lo < 2) {
			lo = 0;
		} else if(lo >= 2 && lo < 4) {
			lo = 2;
		} else if(lo >= 4 && lo < 6) {
			lo = 4;
		} else if(lo >= 6 && lo < 8) {
			lo = 6;
		} else if(lo >= 8) {
			lo = 8;
		}

		var pointTwoCellId = (la * 10) + lo;
		return Math.abs(pointTwoCellId);
	}
};

exports.convertFromMysqlToMongoDB = function(req, res) {
	var c = new Client();
	c.connect({
		host: '127.0.0.1',
		user: 'root',
		password: 'h4s1p8k2',
		db: 'dataportal'
	});

	c.on('connect', function() {
		logger.info('Client connected');
	})
	.on('error', function(err) {
		logger.info('Client error: ' + err);
	})
	.on('close', function(hadError) {
		logger.info('Client closed');
	});

	/*c.query('SELECT * FROM occurrence_record order by id limit 100000 offset 1000000')
		.on('result', function(result) {
			result.on('row', function(row) {
				var pointFiveCell = null;
				var pointTwoCell = null;
				if(row.latitude !== null) {
					pointFiveCell = toPointFiveCellId(row.latitude, row.longitude);
					pointTwoCell = toPointTwoCellId(row.latitude, row.longitude);
					c.query('UPDATE occurrence_record SET pointfive_cell_id = '+pointFiveCell+', pointtwo_cell_id = ' + pointTwoCell + ' WHERE id = '+row.id);
				}
			})
			.on('error', function(err) {
				logger.info('Result error: ' + inspect(err));
			})
			.on('end', function(info) {
				logger.info('Result finished successfully');
			});
		})
		.on('end', function() {
			logger.info('Done with all results');
		});*/

	/*MongoClient.connect('mongodb://localhost/sibexplorer_dev', function(error, db) {
		if (error) console.info(error);
		db.createCollection("occurrences", function(err, collection) {
			c.query('SELECT * FROM occurrence_record_denormalized order by id limit 100000 offset 1000000')
				.on('result', function(result) {
					result.on('row', function(row) {
						var locationCellId = toBoundingBoxCell(row.cell_id);
						var locationCentiCellId = toBoundingBoxCentiCell(row.cell_id, row.centi_cell_id);
						var locationPointFiveCellId = toBoundingBoxPointFiveCell(row.cell_id, row.pointfive_cell_id);
						var locationPointTwoCellId = toBoundingBoxPointTwoCell(row.cell_id, row.pointtwo_cell_id);

						var kingdom_group = row.kingdom + "~~~" + row.kingdom_concept_id;
						var phylum_group = row.phylum + "~~~" + row.phylum_concept_id;
						var taxonClass_group = row.class + "~~~" + row.class_concept_id;
						var order_rank_group = row.order_rank + "~~~" + row.order_concept_id;
						var family_group = row.family + "~~~" + row.family_concept_id;
						var genus_group = row.genus + "~~~" + row.genus_concept_id;
						var species_group = row.species + "~~~" + row.species_concept_id;
						var pointfive_group = row.cell_id + "~~~" + row.pointfive_cell_id;
						var pointtwo_group = row.cell_id + "~~~" + row.pointtwo_cell_id;
						var centi_group = row.cell_id + "~~~" + row.centi_cell_id;
						var document = {id:row.id, canonical:row.canonical, location: {lat: row.latitude, lon: row.longitude}, cell_id: row.cell_id, centi_cell_id: row.centi_cell_id, pointfive_cell_id: row.pointfive_cell_id, pointtwo_cell_id: row.pointtwo_cell_id, mod360_cell_id: row.mod360_cell_id, location_cell: locationCellId, location_centi_cell: locationCentiCellId, location_pointfive_cell: locationPointFiveCellId, location_pointtwo_cell: locationPointTwoCellId, data_provider_id: row.data_provider_id, data_provider_name: row.data_provider_name, data_resource_id: row.data_resource_id, data_resource_name: row.data_resource_name, rights: row.rights, institution_code_id: row.institution_code_id, institution_code: row.institution_code, collection_code_id: row.collection_code_id, collection_code: row.collection_code, catalogue_number_id: row.catalogue_number_id, catalogue_number: row.catalogue_number, citation: row.citation, created: row.created, modified: row.modified, kingdom_concept_id: row.kingdom_concept_id, phylum_concept_id: row.phylum_concept_id,class_concept_id: row.class_concept_id, order_concept_id: row.order_concept_id, family_concept_id: row.family_concept_id, genus_concept_id: row.genus_concept_id, species_concept_id: row.species_concept_id, iso_country_code: row.iso_country_code, iso_department_code: row.iso_department_code, year: row.year, month: row.month, occurrence_date: row.occurrence_date, altitude_metres: row.altitude_metres, depth_centimetres: row.depth_centimetres, kingdom: row.kingdom, phylum: row.phylum, taxonClass: row.class, order_rank: row.order_rank, family: row.family, genus: row.genus, species: row.species, country_name: row.country_name, department_name: row.department_name, basis_of_record_id: row.basis_of_record_id, basis_of_record_name: row.basis_of_record_name, basis_of_record_name_spanish: row.basis_of_record_name_spanish, kingdom_group: kingdom_group, phylum_group: phylum_group, taxonClass_group: taxonClass_group, order_rank_group: order_rank_group, family_group: family_group, genus_group: genus_group, species_group: species_group, pointfive_group: pointfive_group, pointtwo_group: pointtwo_group, centi_group: centi_group};
						collection.insert(document, function(err, records) {
							if (err) throw err;
						});
					})
					.on('error', function(err) {
						logger.info('Result error: ' + inspect(err));
					})
					.on('end', function(info) {
						logger.info('Result finished successfully');
					});
				})
				.on('end', function() {
					logger.info('Done with all results');
				});
		});
	});*/

	/*MongoClient.connect('mongodb://localhost/sibexplorer_dev', function(error, db) {
		if (error) console.info(error);
		db.createCollection("geooccurrences", function(err, collection) {
			c.query('SELECT * FROM geo_occurrence_record_denormalized order by id')
				.on('result', function(result) {
					result.on('row', function(row) {
						var locationCellId = toBoundingBoxCell(row.cell_id);
						var locationCentiCellId = toBoundingBoxCentiCell(row.cell_id, row.centi_cell_id);
						var locationPointFiveCellId = toBoundingBoxPointFiveCell(row.cell_id, row.pointfive_cell_id);
						var locationPointTwoCellId = toBoundingBoxPointTwoCell(row.cell_id, row.pointtwo_cell_id);
						var document = {id:row.id, canonical:row.canonical, num_occurrences:row.num_occurrences, location: {lat:row.latitude, lon:row.longitude}, cell_id: row.cell_id, centi_cell_id: row.centi_cell_id, pointfive_cell_id: row.pointfive_cell_id, pointtwo_cell_id: row.pointtwo_cell_id, mod360_cell_id: row.mod360_cell_id, location_cell: locationCellId, location_centi_cell: locationCentiCellId, location_pointfive_cell: locationPointFiveCellId, location_pointtwo_cell: locationPointTwoCellId, data_provider_id:row.data_provider_id, data_provider_name:row.data_provider_name, data_resource_id:row.data_resource_id, data_resource_name:row.data_resource_name, rights:row.rights, institution_code_id:row.institution_code_id, institution_code:row.institution_code, collection_code_id:row.collection_code_id, collection_code:row.collection_code, catalogue_number_id:row.catalogue_number_id, catalogue_number:row.catalogue_number, citation:row.citation, created:row.created, modified:row.modified, kingdom_concept_id:row.kingdom_concept_id, phylum_concept_id:row.phylum_concept_id, class_concept_id:row.class_concept_id, order_concept_id:row.order_concept_id, family_concept_id:row.family_concept_id, genus_concept_id:row.genus_concept_id, species_concept_id:row.species_concept_id, iso_country_code:row.iso_country_code, iso_department_code:row.iso_department_code, year:row.year, month:row.month, occurrence_date:row.occurrence_date, altitude_metres:row.altitude_metres, depth_centimetres:row.depth_centimetres, country_name: row.country_name, department_name: row.department_name};
						collection.insert(document, function(err, records) {
							if (err) throw err;
						});
					})
					.on('error', function(err) {
						console.info('Result error: ' + inspect(err));
					})
					.on('end', function(info) {
						console.info('Result finished successfully');
					});
				})
				.on('end', function() {
					console.info('Done with all results');
				});
		});
	});*/

	/*MongoClient.connect('mongodb://localhost/sibexplorer_dev', function(error, db) {
		if (error) console.info(error);
		db.createCollection("cell_density", function(err, collection) {
			c.query('SELECT * FROM cell_density order by type')
				.on('result', function(result) {
					result.on('row', function(row) {
						var locationCellId = toBoundingBoxCell(row.cell_id);
						var document = {type: row.type, entity_id: row.entity_id, cell_id: row.cell_id, location_cell: locationCellId, count: row.count};
						collection.insert(document, function(err, records) {
							if (err) throw err;
						});
					})
					.on('error', function(err) {
						console.info('Result error: ' + inspect(err));
					})
					.on('end', function(info) {
						console.info('Result finished successfully');
					});
				})
				.on('end', function() {
					console.info('Done with all results');
				});
		});
	});*/

	/*MongoClient.connect('mongodb://localhost/sibexplorer_dev', function(error, db) {
		if (error) console.info(error);
		db.createCollection("pointfive_cell_density", function(err, collection) {
			c.query('SELECT * FROM pointfive_cell_density order by type')
				.on('result', function(result) {
					result.on('row', function(row) {
						var locationCellId = toBoundingBoxCell(row.cell_id);
						var locationPointFiveCellId = toBoundingBoxPointFiveCell(row.cell_id, row.pointfive_cell_id);
						var document = {type: row.type, entity_id: row.entity_id, cell_id: row.cell_id, pointfive_cell_id: row.pointfive_cell_id, location_cell: locationCellId, location_pointfive_cell: locationPointFiveCellId, count: row.count};
						collection.insert(document, function(err, records) {
							if (err) throw err;
						});
					})
					.on('error', function(err) {
						console.info('Result error: ' + inspect(err));
					})
					.on('end', function(info) {
						console.info('Result finished successfully');
					});
				})
				.on('end', function() {
					console.info('Done with all results');
				});
		});
	});*/

	/*MongoClient.connect('mongodb://localhost/sibexplorer_dev', function(error, db) {
		if (error) console.info(error);
		db.createCollection("pointtwo_cell_density", function(err, collection) {
			c.query('SELECT * FROM pointtwo_cell_density order by type')
				.on('result', function(result) {
					result.on('row', function(row) {
						var locationCellId = toBoundingBoxCell(row.cell_id);
						var locationPointTwoCellId = toBoundingBoxPointTwoCell(row.cell_id, row.pointtwo_cell_id);
						var document = {type: row.type, entity_id: row.entity_id, cell_id: row.cell_id, pointtwo_cell_id: row.pointtwo_cell_id, location_cell: locationCellId, location_pointtwo_cell: locationPointTwoCellId, count: row.count};
						collection.insert(document, function(err, records) {
							if (err) throw err;
						});
					})
					.on('error', function(err) {
						console.info('Result error: ' + inspect(err));
					})
					.on('end', function(info) {
						console.info('Result finished successfully');
					});
				})
				.on('end', function() {
					console.info('Done with all results');
				});
		});
	});*/

	/*MongoClient.connect('mongodb://localhost/sibexplorer_dev', function(error, db) {
		if (error) console.info(error);
		db.createCollection("centi_cell_density", function(err, collection) {
			c.query('SELECT * FROM centi_cell_density order by type')
				.on('result', function(result) {
					result.on('row', function(row) {
						var locationCellId = toBoundingBoxCell(row.cell_id);
						var locationCentiCellId = toBoundingBoxCentiCell(row.cell_id, row.centi_cell_id);
						var document = {type: row.type, entity_id: row.entity_id, cell_id: row.cell_id, centi_cell_id: row.centi_cell_id, location_cell: locationCellId, location_centi_cell: locationCentiCellId, count: row.count};
						collection.insert(document, function(err, records) {
							if (err) throw err;
						});
					})
					.on('error', function(err) {
						console.info('Result error: ' + inspect(err));
					})
					.on('end', function(info) {
						console.info('Result finished successfully');
					});
				})
				.on('end', function() {
					console.info('Done with all results');
				});
		});
	});*/

	//c.end();
	res.send("MongoDB Database updated");
};


exports.updatemongodb = function(req, res) {
	// Clear occurrences collection
	/*mongoose.connection.collections['occurrences'].drop(function(err) {
		console.log('collection occurrences dropped')
		mongoose.disconnect()
	})*/
	// Clear occurrences collection
	/*mongoose.connection.collections['occurrences_es'].drop(function(err) {
		console.log('collection occurrences_es dropped')
		mongoose.disconnect()
	})*/
	// Clear geooccurrences collection
	/*mongoose.connection.collections['geooccurrences'].drop(function(err) {
		console.log('collection geooccurrences dropped')
		mongoose.disconnect()
	})*/
	// Clear geooccurrences_es collection
	/*mongoose.connection.collections['geooccurrences_es'].drop(function(err) {
		console.log('collection geooccurrences_es dropped')
		mongoose.disconnect()
	})*/
	// Clear stats collection
	/*mongoose.connection.collections['general_stats'].drop(function(err) {
		console.log('collection general_stats dropped')
		mongoose.disconnect()
	})*/
	// Clear canonical names groups collection
	/*mongoose.connection.collections['canonical_groups'].drop(function(err) {
		console.log('collection canonical_groups dropped')
		mongoose.disconnect()
	})*/
	// Clear kingdom names groups collection
	/*mongoose.connection.collections['kingdom_groups'].drop(function(err) {
		console.log('collection kingdom_groups dropped')
		mongoose.disconnect()
	})*/
	// Clear phylum names groups collection
	/*mongoose.connection.collections['phylum_groups'].drop(function(err) {
		console.log('collection phylum_groups dropped')
		mongoose.disconnect()
	})*/
	// Clear class names groups collection
	/*mongoose.connection.collections['class_groups'].drop(function(err) {
		console.log('collection class_groups dropped')
		mongoose.disconnect()
	})*/
	// Clear order_rank names groups collection
	/*mongoose.connection.collections['order_rank_groups'].drop(function(err) {
		console.log('collection order_rank_groups dropped')
		mongoose.disconnect()
	})*/
	// Clear family names groups collection
	/*mongoose.connection.collections['family_groups'].drop(function(err) {
		console.log('collection family_groups dropped')
		mongoose.disconnect()
	})*/
	// Clear genus names groups collection
	/*mongoose.connection.collections['genus_groups'].drop(function(err) {
		console.log('collection genus_groups dropped')
		mongoose.disconnect()
	})*/
	// Clear species names groups collection
	/*mongoose.connection.collections['species_groups'].drop(function(err) {
		console.log('collection species_groups dropped')
		mongoose.disconnect()
	})*/
	// Clear countries groups collection
	/*mongoose.connection.collections['country_groups'].drop(function(err) {
		console.log('collection country_groups dropped')
		mongoose.disconnect()
	})*/
	// Clear departments groups collection
	/*mongoose.connection.collections['department_groups'].drop(function(err) {
		console.log('collection department_groups dropped')
		mongoose.disconnect()
	})*/
	// Clear data providers groups collection
	/*mongoose.connection.collections['data_provider_groups'].drop(function(err) {
		console.log('collection data_provider_groups dropped')
		mongoose.disconnect()
	})*/
	// Clear data resources groups collection
	/*mongoose.connection.collections['data_resource_groups'].drop(function(err) {
		console.log('collection data_resource_groups dropped')
		mongoose.disconnect()
	})*/
	// Clear data institution code groups collection
	/*mongoose.connection.collections['institution_code_groups'].drop(function(err) {
		console.log('collection institution_code_groups dropped')
		mongoose.disconnect()
	})*/
	// Clear data collection code groups collection
	/*mongoose.connection.collections['collection_code_groups'].drop(function(err) {
		console.log('collection collection_code_groups dropped')
		mongoose.disconnect()
	})*/
	// Clear help search data collection
	/*mongoose.connection.collections['help_search_text'].drop(function(err) {
		console.log('collection help_search_text dropped')
		mongoose.disconnect()
	})*/

	dbWrapper.initConnection();
	// Generate occurrences data
	/*dbWrapper.convertOccurrences(function(result) {
		console.log(result)
	})*/

	// Generate geooccurrences data
	/*dbWrapper.convertGeoOccurrences(function(rows) {
		console.log(rows.length)
		MongoClient.connect(process.env.MONGODB_DB_CONNECT_URL, function(err, db) {
			if (err) console.log(err)
			db.createCollection("geooccurrences", function(err, collection) {
				if (err) console.log(err)
				console.log("Created geooccurrences collection")
				for (var i = 0; i < rows.length; i++) {
					var document = {id: rows[i].id, canonical: rows[i].canonical, num_occurrences: rows[i].num_occurrences, latitude: rows[i].latitude, longitude: rows[i].longitude, data_provider_id: rows[i].data_provider_id, data_provider_name: rows[i].data_provider_name, data_resource_id: rows[i].data_resource_id, data_resource_name: rows[i].data_resource_name, rights: rows[i].rights, institution_code_id: rows[i].institution_code_id, institution_code: rows[i].institution_code, collection_code_id: rows[i].collection_code_id, collection_code: rows[i].collection_code, catalogue_number_id: rows[i].catalogue_number_id, catalogue_number: rows[i].catalogue_number, citation: rows[i].citation, created: rows[i].created, modified: rows[i].modified, kingdom_concept_id: rows[i].kingdom_concept_id, class_concept_id: rows[i].class_concept_id, order_concept_id: rows[i].order_concept_id, family_concept_id: rows[i].family_concept_id, genus_concept_id: rows[i].genus_concept_id, species_concept_id: rows[i].species_concept_id, iso_country_code: rows[i].iso_country_code, iso_department_code: rows[i].iso_department_code, year: rows[i].year, month: rows[i].month, occurrence_date: rows[i].occurrence_date, altitude_metres: rows[i].altitude_metres, depth_centimetres: rows[i].depth_centimetres, kingdom: rows[i].kingdom, phylum: rows[i].phylum, class: rows[i].class, order_rank: rows[i].order_rank, family: rows[i].family, genus: rows[i].genus, species: rows[i].species}
					collection.insert(document, function(err, records) {
						if (err) console.log(err)
					})
				}
				console.log("Conversión finalizada")
			})
		})
	})*/
	// Generate geooccurrences_es data
	/*dbWrapper.convertGeoOccurrences(function(rows) {
		console.log(rows.length)
		MongoClient.connect(process.env.MONGODB_DB_CONNECT_URL, function(err, db) {
			if (err) console.log(err)
			db.createCollection("geooccurrences_es", function(err, collection) {
				if (err) console.log(err)
				console.log("Created geooccurrences_es collection")
				for (var i = 0; i < rows.length; i++) {
					var document = {id: rows[i].id, canonical: rows[i].canonical, num_occurrences: rows[i].num_occurrences, location: {lat: rows[i].latitude, lon: rows[i].longitude}, data_provider_id: rows[i].data_provider_id, data_provider_name: rows[i].data_provider_name, data_resource_id: rows[i].data_resource_id, data_resource_name: rows[i].data_resource_name, rights: rows[i].rights, institution_code_id: rows[i].institution_code_id, institution_code: rows[i].institution_code, collection_code_id: rows[i].collection_code_id, collection_code: rows[i].collection_code, catalogue_number_id: rows[i].catalogue_number_id, catalogue_number: rows[i].catalogue_number, citation: rows[i].citation, created: rows[i].created, modified: rows[i].modified, kingdom_concept_id: rows[i].kingdom_concept_id, class_concept_id: rows[i].class_concept_id, order_concept_id: rows[i].order_concept_id, family_concept_id: rows[i].family_concept_id, genus_concept_id: rows[i].genus_concept_id, species_concept_id: rows[i].species_concept_id, iso_country_code: rows[i].iso_country_code, iso_department_code: rows[i].iso_department_code, year: rows[i].year, month: rows[i].month, occurrence_date: rows[i].occurrence_date, altitude_metres: rows[i].altitude_metres, depth_centimetres: rows[i].depth_centimetres, kingdom: rows[i].kingdom, phylum: rows[i].phylum, class: rows[i].class, order_rank: rows[i].order_rank, family: rows[i].family, genus: rows[i].genus, species: rows[i].species}
					collection.insert(document, function(err, records) {
						if (err) console.log(err)
					})
				}
				console.log("Conversión finalizada")
			})
		})
	})*/
	// Generate total occurrences stats
	dbWrapper.getCountAllOccurrences(function(rows) {
		var generalIndicator = new GeneralIndicator({name: "Total occurrences", value: rows[0].total_occurrences});
		generalIndicator.save();
		console.info(rows);
	});
	// Generate total georeferenced occurrences stats
	dbWrapper.getCountAllGeoreferencedOccurrences(function(rows) {
		var generalIndicator = new GeneralIndicator({name: "Total georeferenced occurrences", value: rows[0].total_occurrences});
		generalIndicator.save();
		console.info(rows);
	});
	// Generate canonical groups data
	dbWrapper.getCanonicalNameGroups(function(rows) {
		for (var i = 0; i < rows.length; i++) {
			var canonicalGroup = new CanonicalGroup({canonical: rows[i].canonical, occurrences: rows[i].Occurrences});
			canonicalGroup.save();
		}
	});
	// Generate kingdom groups data
	dbWrapper.getKingdomNameGroups(function(rows) {
		for (var i = 0; i < rows.length; i++) {
			var kingdomGroup = new KingdomGroup({kingdom: rows[i].kingdom, occurrences: rows[i].occurrences});
			kingdomGroup.save();
		}
	});
	// Generate phylum groups data
	dbWrapper.getPhylumNameGroups(function(rows) {
		for (var i = 0; i < rows.length; i++) {
			var phylumGroup = new PhylumGroup({phylum: rows[i].phylum, occurrences: rows[i].occurrences});
			phylumGroup.save();
		}
	});
	// Generate class groups data
	dbWrapper.getClassNameGroups(function(rows) {
		for (var i = 0; i < rows.length; i++) {
			var classGroup = new ClassGroup({nameClass: rows[i].nameClass, occurrences: rows[i].occurrences});
			classGroup.save();
		}
	});
	// Generate order_rank groups data
	dbWrapper.getOrderRankNameGroups(function(rows) {
		for (var i = 0; i < rows.length; i++) {
			var orderRankGroup = new OrderRankGroup({order_rank: rows[i].order_rank, occurrences: rows[i].occurrences});
			orderRankGroup.save();
		}
	});
	// Generate family groups data
	dbWrapper.getFamilyNameGroups(function(rows) {
		for (var i = 0; i < rows.length; i++) {
			var familyGroup = new FamilyGroup({family: rows[i].family, occurrences: rows[i].occurrences});
			familyGroup.save();
		}
	});
	// Generate Genus groups data
	dbWrapper.getGenusNameGroups(function(rows) {
		for (var i = 0; i < rows.length; i++) {
			var genusGroup = new GenusGroup({genus: rows[i].genus, occurrences: rows[i].occurrences});
			genusGroup.save();
		}
	});
	// Generate species groups data
	dbWrapper.getSpeciesNameGroups(function(rows) {
		for (var i = 0; i < rows.length; i++) {
			var speciesGroup = new SpeciesGroup({species: rows[i].species, occurrences: rows[i].occurrences});
			speciesGroup.save();
		}
	});
	// Generate country occurrences groups data
	dbWrapper.getCountryNameGroups(function(rows) {
		for (var i = 0; i < rows.length; i++) {
			var countriesGroup = new CountriesGroup({countryName: rows[i].countryName, isoCountryCode: rows[i].iso_country_code, occurrences: rows[i].occurrences});
			countriesGroup.save();
		}
	});
	// Generate departments occurrences groups data
	dbWrapper.getDepartmentNameGroups(function(rows) {
		for (var i = 0; i < rows.length; i++) {
			var departmentsGroup = new DepartmentsGroup({departmentName: rows[i].departmentName, isoDepartmentCode: rows[i].iso_department_code, occurrences: rows[i].occurrences});
			departmentsGroup.save();
		}
	});
	// Generate providers occurrences groups data
	dbWrapper.getDataProviderNameGroups(function(rows) {
		for (var i = 0; i < rows.length; i++) {
			var dataProvidersGroup = new DataProvidersGroup({providerName: rows[i].providerName, providerID: rows[i].providerID, occurrences: rows[i].occurrences});
			dataProvidersGroup.save();
		}
	});
	// Generate resources occurrences groups data
	dbWrapper.getDataResourceNameGroups(function(rows) {
		for (var i = 0; i < rows.length; i++) {
			var dataResourcesGroup = new DataResourcesGroup({resourceName: rows[i].resourceName, resourceID: rows[i].resourceID, occurrences: rows[i].occurrences, providerID: rows[i].providerID});
			dataResourcesGroup.save();
		}
	});
	// Generate institution code groups data
	dbWrapper.getInstitutionCodeGroups(function(rows) {
		for (var i = 0; i < rows.length; i++) {
			var institutionCodeGroup = new InstitutionCodeGroup({institutionCode: rows[i].institutionCode, institutionCodeID: rows[i].institutionCodeID, occurrences: rows[i].occurrences});
			institutionCodeGroup.save();
		}
	});
	// Generate collection code groups data
	dbWrapper.getCollectionCodeGroups(function(rows) {
		for (var i = 0; i < rows.length; i++) {
			var collectionCodeGroup = new CollectionCodeGroup({collectionCode: rows[i].collectionCode, collectionCodeID: rows[i].collectionCodeID, occurrences: rows[i].occurrences});
			collectionCodeGroup.save();
		}
	});
	// Generate help search data
	var helpSearchText = new HelpSearchText({subjectName: "canonical", subjectID: 0, text: "<p>Escriba un nombre científico y pulse en Agregar filtro.</p><p>Este filtro devolverá cualquier registro que posea un nombre que concuerde con el identificador dado del organismo, sin importar como está clasificado el organismo.</p>"});
	helpSearchText.save();
	helpSearchText = new HelpSearchText({subjectName: "kingdom", subjectID: 100, text: "<p>Escriba un nombre de reino y pulse en Agregar filtro.</p><p>Este filtro devolverá cualquier registro que posea un reino que concuerde con el organismo.</p>"});
	helpSearchText.save();
	helpSearchText = new HelpSearchText({subjectName: "phylum", subjectID: 101, text: "<p>Escriba un nombre de filo y pulse en Agregar filtro.</p><p>Este filtro devolverá cualquier registro que posea un filo que concuerde con el organismo.</p>"});
	helpSearchText.save();
	helpSearchText = new HelpSearchText({subjectName: "class", subjectID: 102, text: "<p>Escriba un nombre de clase y pulse en Agregar filtro.</p><p>Este filtro devolverá cualquier registro que posea una clase que concuerde con el organismo.</p>"});
	helpSearchText.save();
	helpSearchText = new HelpSearchText({subjectName: "order_rank", subjectID: 103, text: "<p>Escriba un nombre de orden y pulse en Agregar filtro.</p><p>Este filtro devolverá cualquier registro que posea un orden que concuerde con el organismo.</p>"});
	helpSearchText.save();
	helpSearchText = new HelpSearchText({subjectName: "family", subjectID: 104, text: "<p>Escriba un nombre de familia y pulse en Agregar filtro.</p><p>Este filtro devolverá cualquier registro que posea una familia que concuerde con el organismo.</p>"});
	helpSearchText.save();
	helpSearchText = new HelpSearchText({subjectName: "genus", subjectID: 105, text: "<p>Escriba un nombre de género y pulse en Agregar filtro.</p><p>Este filtro devolverá cualquier registro que posea un género que concuerde con el organismo.</p>"});
	helpSearchText.save();
	helpSearchText = new HelpSearchText({subjectName: "species", subjectID: 106, text: "<p>Escriba un nombre de especie y pulse en Agregar filtro.</p><p>Este filtro devolverá cualquier registro que posea una especie que concuerde con el organismo.</p>"});
	helpSearchText.save();
	helpSearchText = new HelpSearchText({subjectName: "dataproviders", subjectID: 25, text: "<p>Seleccione un publicador de datos de la lista y haga clic en Agregar filtro.</p><p>Este filtro retornará registros de los publicadores especificados.</p>"});
	helpSearchText.save();
	helpSearchText = new HelpSearchText({subjectName: "dataresources", subjectID: 24, text: "<p>Seleccione un recurso de datos de la lista y haga clic en Agregar filtro.</p><p>Este filtro retornará registros de los recursos especificados.</p>"});
	helpSearchText.save();
	helpSearchText = new HelpSearchText({subjectName: "countries", subjectID: 5, text: "<p>Seleccione un país de la lista y dar clic en Agregar filtro para filtrar su búsqueda a uno o más paises.</p><p>Este filtro retornará registros del país identificado, sin importar si poseen coordenadas; pero note que al agregar un filtro de coordenadas (Bounding box, Latitud o Longitud) limitará los resultados a registros georreferenciados.</p>"});
	helpSearchText.save();
	helpSearchText = new HelpSearchText({subjectName: "departments", subjectID: 38, text: "<p>Seleccione un departamento de la lista y oprima en Agregar filtro para acotar su búsqueda a uno o más departamentos.</p><p>Este filtro retorna los registros que pertenecen al departamento, independientemente de si estos tienen o no coordenadas; tenga en cuenta que al adicionar un filtro de coordenadas (Condición de selección, Latitud o Longitud) limitará los resultados a los registros georeferenciados.</p>"});
	helpSearchText.save();
	helpSearchText = new HelpSearchText({subjectName: "coordinatesState", subjectID: 28, text: '<p></p><p>Seleccione "incluye coordenadas" para filtrar aquellos registros que no están georreferenciados; alternativamente, seleccione "no incluye coordenadas" para excluir registros georreferenciados. Para ver todos los registros, no utilize este filtro.</p>'});
	helpSearchText.save();
	helpSearchText = new HelpSearchText({subjectName: "latitude", subjectID: 1, text: '<p></p><p>Ingrese una latitud en formato decimal (ej. -1.1) y escoja entre "es", "mayor que" y "menor que". Este filtro retornará solo registros georreferenciados que concuerdan con la selección.</p>'});
	helpSearchText.save();
	helpSearchText = new HelpSearchText({subjectName: "longitude", subjectID: 2, text: '<p></p><p>Ingrese una longitud en formato decimal (ej. -73.2) y escoja entre "es", "mayor que" y "menor que". Este filtro retornará solo registros georreferenciados que concuerdan con la selección.</p>'});
	helpSearchText.save();
	helpSearchText = new HelpSearchText({subjectName: "altitude", subjectID: 34, text: '<p>Ingrese una altitud en metros y escoja entre "es", "mayor que" y "menor que". Este filtro retornará solo registros con un valor de altitud que coincida con la selección. Este filtro sólo es compatible con los valores de números enteros.</p><p>Por favor tenga en cuenta que los valores de altitud subyacentes se supone que se indican en metros por las fuentes originales de datos, pero que no todas las fuentes de datos se ajustan a esta norma todavía. La conversión automática sólo puede ser suministrada en los casos donde se conoce la unidad de medida. Si planea cualquier análisis basado en los valores de altitud, se recomienda ponerse en contacto directamente con los propietarios de los datos relacionados y verificar las unidades de medida utilizadas en sus conjuntos de datos.</p>'});
	helpSearchText.save();
	helpSearchText = new HelpSearchText({subjectName: "deep", subjectID: 35, text: '<p>Ingrese una profundidad en metros y escoja entre "es", "mayor que" y "menor que". Este filtro retornará solo registros con un valor de profundidad que coincida con la selección. Este filtro admite valores decimales a 2 decimales.</p><p>Por favor tenga en cuenta que los valores de profundidad subyacentes se supone que se indican en metros por las fuentes originales de datos, pero que no todas las fuentes de datos se ajustan a esta norma todavía. La conversión automática sólo puede ser suministrada en los casos donde se conoce la unidad de medida. Si planea cualquier análisis basado en los valores de profundidad, se recomienda ponerse en contacto directamente con los propietarios de los datos relacionados y verificar las unidades de medida utilizadas en sus conjuntos de datos.</p>'});
	helpSearchText.save();
	helpSearchText = new HelpSearchText({subjectName: "occurrenceDate", subjectID: 4, text: '<p></p><p>Seleccione un rango de fecha y haga clic en Agregar filtro.</p>'});
	helpSearchText.save();
	helpSearchText = new HelpSearchText({subjectName: "occurrenceYearRange", subjectID: 33, text: '<p></p><p>Seleccione un rango de años y haga clic en Agregar filtro..</p>'});
	helpSearchText.save();
	helpSearchText = new HelpSearchText({subjectName: "occurrenceYear", subjectID: 21, text: '<p></p><p>Ingrese un año y haga clic en Agregar filtro. Este filtro retornará registros del año (o años) que concuerdan con la selección.</p>'});
	helpSearchText.save();
	helpSearchText = new HelpSearchText({subjectName: "occurrenceMonth", subjectID: 22, text: '<p></p><p>Seleccione un mes de la lista y haga clic en Agregar filtro. Este filtro retornará registros del mes especificado, sin importar el año.</p>'});
	helpSearchText.save();
	helpSearchText = new HelpSearchText({subjectName: "institutionCode", subjectID: 12, text: '<p></p><p>Ingrese un código de institución y "es". Este filtro retornará registros con el código de institución dado.</p>'});
	helpSearchText.save();
	helpSearchText = new HelpSearchText({subjectName: "collectionCode", subjectID: 13, text: '<p></p><p>Ingrese un código de colección y "es". El filtro retornará registros con el código de colección.</p>'});
	helpSearchText.save();
	helpSearchText = new HelpSearchText({subjectName: "catalogNumber", subjectID: 14, text: '<p></p><p>Ingrese un número de catálogo y pulse en Agregar filtro. Este filtro retornará registros con el número de catálogo especificado.</p>'});
	helpSearchText.save();
	dbWrapper.closeConnection();
	res.send("MongoDB Database updated");
};

exports.index = function(req, res) {
	/*async.parallel(
		{
			totalOccurrences: function(callback) {
				GeneralIndicator.findOne({'name': 'Total occurrences'}, 'value', function(err, indicator) {
						if(err) 
							callback(err, null)
						callback(null, indicator.value)
					}
				)
			},
			totalGeoOccurrences: function(callback) {
				GeneralIndicator.findOne({'name': 'Total georeferenced occurrences'}, 'value', function(err, indicator) {
						if(err) 
							callback(err, null)
						callback(null, indicator.value)
					}
				)
			}
			data: function(callback) {
				occurrences = occurrencesES.getOccurrences();
				occurrences.exec(function(err, data){
					callback(null, data);
				})
				GeoOccurrence.find().select('id canonical num_occurrences latitude longitude').limit(30000).exec(function (err, geooccurrences) {
					callback(null, geooccurrences)
				})
			}
		}, function(err, result) {
			if(err)
				res.send(handleError(err));
			//res.render('index', { title: 'Explorador - Portal de datos SIB Colombia', totalOccurrences: result.totalOccurrences, totalGeoOccurrences: result.totalGeoOccurrences, data: JSON.stringify(result.data), tableData: result.data });
			res.render('index', { title: 'Explorador - Portal de datos SIB Colombia', totalOccurrences: result.totalOccurrences, totalGeoOccurrences: result.totalGeoOccurrences });
		}
	)*/
	res.render('index', { title: 'Explorador - Portal de datos SIB Colombia' });
	//dbWrapper.initConnection();
	//dbWrapper.getAllGeoOccurrenceData(function(rows) {
		//res.writeHead(200, {'Content-Type':'application/json'});
		//res.write(JSON.stringify(rows));
		//res.end();
		//var sopas = 'sopas';
		//var cluster = markercluster.markerClusterGroup();
		//var cluster = serverCluster.markerClusterGroup();
		/*for (var i = 0; i < rows.length; i++) {
			var marker = serverCluster.marker(serverCluster.latLng(rows[i].latitude, rows[i].longitude), { title: rows[i].canonical + ' (' + rows[i].num_occurrences + ')' });
			marker.bindPopup(rows[i].canonical + ' (' + rows[i].num_occurrences + ')');
			cluster.addLayer(marker);
		}
		var finalCluster = cluster.createCluster();*/
	
		//res.render('index', { title: 'Explorador - Portal de datos SIB Colombia', data: JSON.stringify(rows) });
	//});
	//dbWrapper.closeConnection();
	//res.render('index', { title: 'Explorador - Portal de datos SIB Colombia' });
};