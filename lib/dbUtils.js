var mysql = require("mysql");
var MongoClient = require('mongodb').MongoClient;
var q = require('q');

var connection;

exports.initConnection = function() {
	connection = mysql.createConnection({
		host : 'localhost',
		user : 'root',
		database : 'dataportal',
		port: '3306',
		password : 'h4s1p8k2'
	});
	connection.connect(function(err){
		if(!err) {
			console.log("You are connected to the database.");
		} else {
			throw err;
		}
	});
}

exports.closeConnection = function() {
	connection.end(function(err){
		if(!err) {
			console.log("Mysql connection is terminated.");
		} else {
			throw err;
		}
	});
}

exports.getAllGeoOccurrenceData = function(result) {
	connection.query("select id, canonical, num_occurrences, latitude, longitude from geo_ocurrence_record_denormalized WHERE geo_ocurrence_record_denormalized.iso_country_code = 'CO' LIMIT 20000", function(err, rows, fields) {
		if (err) {
			res.send(err);
		}
		result(rows);
	});
}

exports.getAllOccurrenceData = function(result) {
	connection.query("SELECT * FROM ocurrence_record_denormalized", function(err, rows, fields) {
		if (err) {
			res.send(err);
		}
		result(rows);
	});
}

exports.getCountAllOccurrences = function(result) {
	connection.query("SELECT Count(*) AS total_occurrences FROM ocurrence_record_denormalized", function(err, rows, fields) {
		if (err) {
			res.send(err);
		}
		result(rows);
	});
}

exports.getCountAllGeoreferencedOccurrences = function(result) {
	connection.query("SELECT Sum(geo_ocurrence_record_denormalized.num_occurrences) AS total_occurrences FROM geo_ocurrence_record_denormalized", function(err, rows, fields) {
		if (err) {
			res.send(err);
		}
		result(rows);
	});
}

exports.getCanonicalNameGroups = function(result) {
	connection.query("SELECT ocurrence_record_denormalized.canonical, Count(*) AS Occurrences FROM ocurrence_record_denormalized GROUP BY ocurrence_record_denormalized.canonical ORDER BY Occurrences DESC", function(err, rows, fields) {
		if (err) {
			res.send(err);
		}
		result(rows);
	});
}

exports.convertOccurrences = function(result) {
	connection = mysql.createConnection({
		host : 'localhost',
		user : 'root',
		database : 'dataportal',
		port: '3306',
		password : 'h4s1p8k2'
	});
	connection.connect(function(err){
		if(!err) {
			console.log("You are connected to the database.");
		} else {
			throw err;
		}
	});
	var query = connection.query("SELECT * FROM ocurrence_record_denormalized")
	MongoClient.connect(process.env.MONGODB_DB_CONNECT_URL, function(err, db) {
		if (err) throw err
		db.createCollection("occurrences", function(err, collection) {
			if (err) throw err
			console.log("Created occurrences collection")
			query
				.on('result', function(row) {
					connection.pause()
					var document = {id:row.id, canonical:row.canonical, latitude: row.latitude, longitude: row.longitude, data_provider_id: row.data_provider_id, data_provider_name: row.data_provider_name, data_resource_id: row.data_resource_id, data_resource_name: row.data_resource_name, rights: row.rights, institution_code_id: row.institution_code_id, institution_code: row.institution_code, collection_code_id: row.collection_code_id, collection_code: row.collection_code, catalogue_number_id: row.catalogue_number_id, catalogue_number: row.catalogue_number, citation: row.citation, created: row.created, modified: row.modified, kingdom_concept_id: row.kingdom_concept_id, class_concept_id: row.class_concept_id, order_concept_id: row.order_concept_id, family_concept_id: row.family_concept_id, genus_concept_id: row.genus_concept_id, species_concept_id: row.species_concept_id, iso_country_code: row.iso_country_code, iso_department_code: row.iso_department_code, year: row.year, month: row.month, occurrence_date: row.occurrence_date, altitude_metres: row.altitude_metres, depth_centimetres: row.depth_centimetres, kingdom: row.kingdom, phylum: row.phylum, class: row.class, order_rank: row.order_rank, family: row.family, genus: row.genus, species: row.species}
					collection.insert(document, function(err, records) {
						if (err) throw err
						connection.resume()
					})		
				})
		})
	})
}

exports.convertOccurrencesES = function(result) {
	connection = mysql.createConnection({
		host : 'localhost',
		user : 'root',
		database : 'dataportal',
		port: '3306',
		password : 'h4s1p8k2'
	});
	connection.connect(function(err){
		if(!err) {
			console.log("You are connected to the database.");
		} else {
			throw err;
		}
	});
	var query = connection.query("SELECT * FROM ocurrence_record_denormalized")
	MongoClient.connect(process.env.MONGODB_DB_CONNECT_URL, function(err, db) {
		if (err) throw err
		db.createCollection("occurrences_es", function(err, collection) {
			if (err) throw err
			console.log("Created occurrences_es collection")
			query
				.on('result', function(row) {
					connection.pause()
					var document = {id:row.id, canonical:row.canonical, location: {lat: row.latitude, lon: row.longitude}, data_provider_id: row.data_provider_id, data_provider_name: row.data_provider_name, data_resource_id: row.data_resource_id, data_resource_name: row.data_resource_name, rights: row.rights, institution_code_id: row.institution_code_id, institution_code: row.institution_code, collection_code_id: row.collection_code_id, collection_code: row.collection_code, catalogue_number_id: row.catalogue_number_id, catalogue_number: row.catalogue_number, citation: row.citation, created: row.created, modified: row.modified, kingdom_concept_id: row.kingdom_concept_id, class_concept_id: row.class_concept_id, order_concept_id: row.order_concept_id, family_concept_id: row.family_concept_id, genus_concept_id: row.genus_concept_id, species_concept_id: row.species_concept_id, iso_country_code: row.iso_country_code, iso_department_code: row.iso_department_code, year: row.year, month: row.month, occurrence_date: row.occurrence_date, altitude_metres: row.altitude_metres, depth_centimetres: row.depth_centimetres, kingdom: row.kingdom, phylum: row.phylum, class: row.class, order_rank: row.order_rank, family: row.family, genus: row.genus, species: row.species}
					collection.insert(document, function(err, records) {
						if (err) throw err
						connection.resume()
					})		
				})
		})
	})
}

exports.convertGeoOccurrences = function(result) {
	getData("SELECT * FROM geo_ocurrence_record_denormalized").then(function(rows) {
		result(rows)
	}, function (error) {
		console.log(error)
	})
}

exports.convertOccurrences = function(result) {
	getData("SELECT * FROM ocurrence_record_denormalized").then(function(rows) {
		result(rows)
	}, function (error) {
		console.log(error)
	})
}

function getData(query) {
	var deferred = q.defer()
	connection.query(query, function(err, rows, fields) {
		if (err) {
			//res.send(err)
			deferred.reject(new Error(err))
		}
		deferred.resolve(rows)
	})
	return deferred.promise
}

exports.getKingdomNameGroups = function(result) {
	connection.query("SELECT ocurrence_record_denormalized.kingdom, Count(ocurrence_record_denormalized.kingdom) AS occurrences FROM ocurrence_record_denormalized WHERE ocurrence_record_denormalized.kingdom IS NOT NULL GROUP BY ocurrence_record_denormalized.kingdom", function(err, rows, fields) {
		if (err) {
			res.send(err);
		}
		result(rows);
	});
}

exports.getPhylumNameGroups = function(result) {
	connection.query("SELECT ocurrence_record_denormalized.phylum, Count(ocurrence_record_denormalized.phylum) AS occurrences FROM ocurrence_record_denormalized WHERE ocurrence_record_denormalized.phylum IS NOT NULL GROUP BY ocurrence_record_denormalized.phylum", function(err, rows, fields) {
		if (err) {
			res.send(err);
		}
		result(rows);
	});
}

exports.getClassNameGroups = function(result) {
	connection.query("SELECT ocurrence_record_denormalized.class AS nameClass, Count(ocurrence_record_denormalized.class) AS occurrences FROM ocurrence_record_denormalized WHERE ocurrence_record_denormalized.class IS NOT NULL GROUP BY ocurrence_record_denormalized.class", function(err, rows, fields) {
		if (err) {
			res.send(err);
		}
		result(rows);
	});
}

exports.getOrderRankNameGroups = function(result) {
	connection.query("SELECT ocurrence_record_denormalized.order_rank, Count(ocurrence_record_denormalized.order_rank) AS occurrences FROM ocurrence_record_denormalized WHERE ocurrence_record_denormalized.order_rank IS NOT NULL GROUP BY ocurrence_record_denormalized.order_rank", function(err, rows, fields) {
		if (err) {
			res.send(err);
		}
		result(rows);
	});
}

exports.getFamilyNameGroups = function(result) {
	connection.query("SELECT ocurrence_record_denormalized.family, Count(ocurrence_record_denormalized.family) AS occurrences FROM ocurrence_record_denormalized WHERE ocurrence_record_denormalized.family IS NOT NULL GROUP BY ocurrence_record_denormalized.family", function(err, rows, fields) {
		if (err) {
			res.send(err);
		}
		result(rows);
	});
}

exports.getGenusNameGroups = function(result) {
	connection.query("SELECT ocurrence_record_denormalized.genus, Count(ocurrence_record_denormalized.genus) AS occurrences FROM ocurrence_record_denormalized WHERE ocurrence_record_denormalized.genus IS NOT NULL GROUP BY ocurrence_record_denormalized.genus", function(err, rows, fields) {
		if (err) {
			res.send(err);
		}
		result(rows);
	});
}

exports.getSpeciesNameGroups = function(result) {
	connection.query("SELECT ocurrence_record_denormalized.species, Count(ocurrence_record_denormalized.species) AS occurrences FROM ocurrence_record_denormalized WHERE ocurrence_record_denormalized.species IS NOT NULL GROUP BY ocurrence_record_denormalized.species", function(err, rows, fields) {
		if (err) {
			res.send(err);
		}
		result(rows);
	});
}

exports.getCountryNameGroups = function(result) {
	connection.query("SELECT ocurrence_record_denormalized.iso_country_code, Count(ocurrence_record_denormalized.iso_country_code) AS occurrences, country_name.`name` AS countryName FROM ocurrence_record_denormalized INNER JOIN country_name ON ocurrence_record_denormalized.iso_country_code = country_name.iso_country_code WHERE ocurrence_record_denormalized.iso_country_code IS NOT NULL AND country_name.locale = 'en' GROUP BY ocurrence_record_denormalized.iso_country_code", function(err, rows, fields) {
		if (err) {
			res.send(err);
		}
		result(rows);
	});
}

exports.getDepartmentNameGroups = function(result) {
	connection.query("SELECT ocurrence_record_denormalized.iso_department_code, Count(ocurrence_record_denormalized.iso_department_code) AS occurrences, department.department_name AS departmentName FROM ocurrence_record_denormalized INNER JOIN department ON ocurrence_record_denormalized.iso_department_code = department.iso_department_code WHERE ocurrence_record_denormalized.iso_department_code IS NOT NULL GROUP BY ocurrence_record_denormalized.iso_department_code", function(err, rows, fields) {
		if (err) {
			res.send(err);
		}
		result(rows);
	});
}

exports.getDataProviderNameGroups = function(result) {
	connection.query("SELECT ocurrence_record_denormalized.data_provider_id AS providerID, Count(ocurrence_record_denormalized.data_provider_id) AS occurrences, ocurrence_record_denormalized.data_provider_name AS providerName FROM ocurrence_record_denormalized WHERE ocurrence_record_denormalized.data_provider_id IS NOT NULL GROUP BY ocurrence_record_denormalized.data_provider_id", function(err, rows, fields) {
		if (err) {
			res.send(err);
		}
		result(rows);
	});
}

exports.getDataResourceNameGroups = function(result) {
	connection.query("SELECT ocurrence_record_denormalized.data_resource_id AS resourceID, Count(ocurrence_record_denormalized.data_resource_id) AS occurrences, ocurrence_record_denormalized.data_resource_name AS resourceName, ocurrence_record_denormalized.data_provider_id AS providerID FROM ocurrence_record_denormalized WHERE ocurrence_record_denormalized.data_resource_id IS NOT NULL GROUP BY ocurrence_record_denormalized.data_resource_id", function(err, rows, fields) {
		if (err) {
			res.send(err);
		}
		result(rows);
	});
}

exports.getInstitutionCodeGroups = function(result) {
	connection.query("SELECT ocurrence_record_denormalized.institution_code_id AS institutionCodeID, Count(ocurrence_record_denormalized.institution_code_id) AS occurrences, ocurrence_record_denormalized.institution_code AS institutionCode FROM ocurrence_record_denormalized WHERE ocurrence_record_denormalized.institution_code_id IS NOT NULL GROUP BY ocurrence_record_denormalized.institution_code_id", function(err, rows, fields) {
		if (err) {
			res.send(err);
		}
		result(rows);
	});
}

exports.getCollectionCodeGroups = function(result) {
	connection.query("SELECT ocurrence_record_denormalized.collection_code_id AS collectionCodeID, Count(ocurrence_record_denormalized.collection_code_id) AS occurrences, ocurrence_record_denormalized.collection_code AS collectionCode FROM ocurrence_record_denormalized WHERE ocurrence_record_denormalized.collection_code_id IS NOT NULL GROUP BY ocurrence_record_denormalized.collection_code_id", function(err, rows, fields) {
		if (err) {
			res.send(err);
		}
		result(rows);
	});
}

/*exports.getLatestEntries = function(cb) {
CONN.query("select id, title, alias, posted from tblblogentries order by posted desc limit 0,10", function(err, rows, fields) {
cb(rows);
});
}
 
exports.getBlogEntryById = function(id,success,fail) {
CONN.query("select id, title, body, morebody, posted from tblblogentries where id = ?",[id], function(err, rows, fields) {
if(rows.length == 1) success(rows[0]);
else fail();
});
}
 
exports.getBlogEntry = function(date,alias,success,fail) {
var year = date.getFullYear();
var month = date.getMonth()+1;
var day = date.getDate();
CONN.query("select id, title, body, morebody, posted from tblblogentries where year(posted) = ? and month(posted) = ? and dayofmonth(posted) = ? and alias = ?",
[year,month,day,alias], function(err, rows, fields) {
if(rows && rows.length == 1) {
exports.getCommentsForBlogEntry(rows[0].id, function(comments) {
success(rows[0],comments);
});
}
else fail();
});
}
 
exports.getCommentsForBlogEntry = function(id,success) {
CONN.query("select id, name, email, comment, posted, website from tblblogcomments where entryidfk = ?", [id], function(err, rows, fields) {
if(!rows || !rows.length) rows = [];
success(rows);
});
}*/