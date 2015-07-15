/**
 * Module dependencies.
 */
var fs = require("fs");
var mongodb = require('mongodb')
	, MongoClient = require('mongodb').MongoClient;

var Client = require('mariasql');

var c = new Client();
c.connect({
	host: '127.0.0.1',
	user: 'valentina',
	password: 'h4s1p8k21078!',
	db: 'dataportal'
});

c.on('connect', function() {
	console.log('Client connected');
})
.on('error', function(err) {
	console.log('Client error: ' + err);
})
.on('close', function(hadError) {
	console.log('Client closed');
});

fs.openSync("output.txt", 'w+');
var counter = 0;
c.query('SELECT common_name_taxon_concept.taxon_concept_id, common_name.name, common_name.transliteration, common_name.iso_language_code, common_name.iso_country_code,	language.name AS language_name FROM common_name_taxon_concept INNER JOIN common_name ON common_name_taxon_concept.common_name_id = common_name.id LEFT JOIN language ON common_name.iso_language_code = language.iso_language_code;')
	.on('result', function(result) {
		result.on('row', function(row) {
			counter++;
			var document = {name: row.name, transliteration: row.transliteration, iso_language_code: row.iso_language_code, iso_country_code: row.iso_country_code, language_name: row.language_name};
			fs.appendFileSync("output.txt", row.taxon_concept_id+"\t"+JSON.stringify(document) + "\n");
			if(counter%500 == 0) {
				console.log("Total common names records extracted from MySQL database: "+counter);
			}
		})
		.on('error', function(err) {
			console.log('Result error: ' + err);
		})
		.on('end', function(info) {
			console.log('Result finished successfully');
		});
	})
	.on('end', function() {
		console.log('Done with all results');
		c.end();

		var counter = 0;
		var numUpdated = 1;
		readline = require('readline');
		MongoClient.connect('mongodb://localhost/sibexplorer_dev', function(error, db) {
			if (error) console.info(error);
			var rd = readline.createInterface({
				input: fs.createReadStream('output.txt'),
				output: process.stdout,
				terminal: false
			});

			rd.on('line', function(line) {
				var lineData = line.split("\t");
				db.collection('occurrences').update({"taxonomy.species_id": parseInt(lineData[0])}, {$push: {common_names: JSON.parse(lineData[1])}}, {multi:true, safe: true}, function(err) {
					if (err) {
						console.warn(err.message);
					} else {
						console.log('Successfully updated num of occurrences: '+numUpdated);
						numUpdated++;
						if (numUpdated-1 == counter) {
							db.close();
							console.log("Common names for occurence records data transfered from MySQL to MongoDB.")
						}
					}
				});
				counter++;
			});

			rd.on('close', function() {
				fs.unlinkSync('output.txt');
			});

		});
	});
