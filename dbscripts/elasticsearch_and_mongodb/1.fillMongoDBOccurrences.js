/**
 * Module dependencies.
 */
var fs = require("fs");
var mongodb = require('mongodb')
  , MongoClient = require('mongodb').MongoClient;

var Client = require('mariasql');

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

var c = new Client();
c.connect({
	host: '127.0.0.1',
	user: 'root',
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

var counter = 0;
fs.openSync("output.txt", 'w+');
c.query('SELECT * FROM occurrence_record_denormalized order by id;')
	.on('result', function(result) {
		result.on('row', function(row) {
			counter++;
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
			var cell_group = row.cell_id + "~~~" + locationCellId.lat + "~~~" + locationCellId.lon;
			var pointfive_group = row.cell_id + "~~~" + row.pointfive_cell_id + "~~~" + locationPointFiveCellId.lat + "~~~" + locationPointFiveCellId.lon;
			var pointtwo_group = row.cell_id + "~~~" + row.pointtwo_cell_id + "~~~" + locationPointTwoCellId.lat + "~~~" + locationPointTwoCellId.lon;
			var centi_group = row.cell_id + "~~~" + row.centi_cell_id + "~~~" + locationCentiCellId.lat + "~~~" + locationCentiCellId.lon;
			var county_group = row.department_name + "~~~" + row.county_name + "~~~" + row.iso_county_code;
			var paramo_group = row.paramo_name + "~~~" + row.paramo_code;
			var marine_zone_group = row.marine_zone_name + "~~~" + row.marine_zone_code;
			if(!row.latitude)
				row.latitude = 1000
			if(!row.longitude)
				row.longitude = 1000
			var document = {id:row.id, canonical:row.canonical, location: {lat: row.latitude, lon: row.longitude}, cell_id: row.cell_id, centi_cell_id: row.centi_cell_id, pointfive_cell_id: row.pointfive_cell_id, pointtwo_cell_id: row.pointtwo_cell_id, mod360_cell_id: row.mod360_cell_id, location_cell: locationCellId, location_centi_cell: locationCentiCellId, location_pointfive_cell: locationPointFiveCellId, location_pointtwo_cell: locationPointTwoCellId, taxon_concept_id: row.taxon_concept_id, data_provider_id: row.data_provider_id, data_provider_name: row.data_provider_name, data_resource_id: row.data_resource_id, data_resource_name: row.data_resource_name, rights: row.rights, institution_code_id: row.institution_code_id, institution_code: row.institution_code, collection_code_id: row.collection_code_id, collection_code: row.collection_code, catalogue_number_id: row.catalogue_number_id, catalogue_number: row.catalogue_number, citation: row.citation, created: row.created, modified: row.modified, kingdom_concept_id: row.kingdom_concept_id, phylum_concept_id: row.phylum_concept_id,class_concept_id: row.class_concept_id, order_concept_id: row.order_concept_id, family_concept_id: row.family_concept_id, genus_concept_id: row.genus_concept_id, species_concept_id: row.species_concept_id, iso_country_code: row.iso_country_code, iso_department_code: row.iso_department_code, iso_county_code: row.iso_county_code, year: row.year, month: row.month, occurrence_date: row.occurrence_date, altitude_metres: row.altitude_metres, depth_centimetres: row.depth_centimetres, kingdom: row.kingdom, phylum: row.phylum, taxonClass: row.class, order_rank: row.order_rank, family: row.family, genus: row.genus, species: row.species, country_name: row.country_name, department_name: row.department_name, county_name: row.county_name, paramo_name: row.paramo_name, marine_zone_name: row.marine_zone_name, paramo_code: row.paramo_code, marine_zone_code: row.marine_zone_code, basis_of_record_id: row.basis_of_record_id, basis_of_record_name: row.basis_of_record_name, basis_of_record_name_spanish: row.basis_of_record_name_spanish, kingdom_group: kingdom_group, phylum_group: phylum_group, taxonClass_group: taxonClass_group, order_rank_group: order_rank_group, family_group: family_group, genus_group: genus_group, species_group: species_group, cell_group: cell_group, pointfive_group: pointfive_group, pointtwo_group: pointtwo_group, centi_group: centi_group, county_group: county_group, paramo_group: paramo_group, marine_zone_group: marine_zone_group};
      fs.appendFileSync("output.txt", JSON.stringify(document) + "\n");
      if(counter%500 == 0) {
        console.log("Total occurrence records extracted from MySQL database: "+counter);
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
    readline = require('readline');
    MongoClient.connect('mongodb://localhost/sibexplorer_dev', function(error, db) {
      if (error) console.info(error);
      var rd = readline.createInterface({
        input: fs.createReadStream('output.txt'),
        output: process.stdout,
        terminal: false
      });

      rd.on('line', function(line) {
        db.collection('occurrences').insert(JSON.parse(line), {safe: false});
        if(counter%500 == 0) {
          console.log("Total records saved in occurrences mongoDB collection: "+counter);
        }
        counter++;
      });

      rd.on('close', function() {
        db.close();
        fs.unlinkSync('output.txt');
        console.log("Occurence records data transfered from MySQL to MongoDB.")
      });

    });
	});
