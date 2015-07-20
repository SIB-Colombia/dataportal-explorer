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

var mysqlPass = process.env.MYSQL_PASSWORD
var c = new Client();
c.connect({
	host: '127.0.0.1',
	user: 'valentina',
	password: mysqlPass,
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

			var cell_group = row.cell_id + "~~~" + locationCellId.lat + "~~~" + locationCellId.lon;
			var pointfive_group = row.cell_id + "~~~" + row.pointfive_cell_id + "~~~" + locationPointFiveCellId.lat + "~~~" + locationPointFiveCellId.lon;
			var pointtwo_group = row.cell_id + "~~~" + row.pointtwo_cell_id + "~~~" + locationPointTwoCellId.lat + "~~~" + locationPointTwoCellId.lon;
			var centi_group = row.cell_id + "~~~" + row.centi_cell_id + "~~~" + locationCentiCellId.lat + "~~~" + locationCentiCellId.lon;
			if(!row.latitude)
				row.latitude = 1000;
			if(!row.longitude)
				row.longitude = 1000;
			var document = {id: parseInt(row.id),canonical: row.taxon_name_canonical,taxon_name_author: row.taxon_name_author,location: {lat: row.latitude,lon: row.longitude},cell_id: row.cell_id,centi_cell_id: row.centi_cell_id,pointfive_cell_id: row.pointfive_cell_id,pointtwo_cell_id: row.pointtwo_cell_id,mod360_cell_id: row.mod360_cell_id,geospatial_issue: row.geospatial_issue,county_name: row.county_name,locality: row.locality,paramo_name: row.paramo_name,marine_zone_name: row.marine_zone_name,iso_country_code: row.iso_country_code,iso_department_code: row.iso_department_code,iso_county_code: row.iso_county_code,paramo_code: row.paramo_code,marine_zone_code: row.marine_zone_code,year: row.year,month: row.month,occurrence_date: row.occurrence_date,altitude_meters: row.altitude_metres,depth_centimeters: row.depth_centimetres,taxonomic_issue: row.taxonomic_issue,other_issue: row.other_issue,deleted: row.deleted,modified: row.modified,protected_area: row.protected_area,zonification: row.zonification,dry_forest: row.dry_forest,iso_country_code_calculated: row.iso_country_code_calculated,iso_department_code_calculated: row.iso_department_code_calculated,paramo_sector: row.paramo_sector,paramo_district: row.paramo_district,country_name: row.country_name,country_name_calculated: row.country_name_calculated,department_name: row.department_name,location_cell: locationCellId,location_centi_cell: locationCentiCellId,location_pointfive_cell: locationPointFiveCellId,location_pointtwo_cell: locationPointTwoCellId,cell_group: cell_group,pointfive_group: pointfive_group,pointtwo_group: pointtwo_group,centi_group: centi_group,taxonomy: {id: parseInt(row.taxon_concept_id),phylum_id: parseInt(row.phylum_concept_id),phylum_name: row.phylum,phylum_author: row.phylum_author,kingdom_id: parseInt(row.kingdom_concept_id),kingdom_name: row.kingdom,kingdom_author: row.kingdom_author,class_id: parseInt(row.class_concept_id),class_name: row.class,class_author: row.class_author,order_id: parseInt(row.order_concept_id),order_name: row.order_rank,order_author: row.order_author,family_id: parseInt(row.family_concept_id),family_name: row.family,family_author: row.family_author,genus_id: parseInt(row.genus_concept_id),genus_name: row.genus,genus_author: row.genus_author,species_id: parseInt(row.species_concept_id),species_name: row.species,species_author: row.species_author},provider: {id: parseInt(row.data_provider_id),name: row.data_provider_name,description: row.data_provider_description,address: row.data_provider_address,city: row.data_provider_city,website_url: row.data_provider_website_url,logo_url: row.data_provider_logo_url,email: row.data_provider_email,telephone: row.data_provider_telephone,uuid: row.data_provider_uuid,created: row.data_provider_created,modified: row.data_provider_modified,deleted: row.data_provider_deleted,iso_country_code: row.data_provider_iso_country_code,gbif_approver: row.data_provider_gbif_approver,type: row.data_provider_type,country_name: row.data_provider_country_name},resource: {id: parseInt(row.data_resource_id),name: row.data_resource_name,display_name: row.data_resource_display_name,description: row.data_resource_description,rights: row.data_resource_rights,citation: row.data_resource_citation,logo_url: row.data_resource_logo_url,created: row.data_resource_created,modified: row.data_resource_modified,deleted: row.data_resource_deleted,website_url: row.data_resource_website_url,gbif_registry_uuid: row.data_resource_gbif_registry_uuid},institution: {id: parseInt(row.institution_code_id),code: row.institution_code},collection: {id: parseInt(row.collection_code_id),code: row.collection_code},catalogue: {id: parseInt(row.catalogue_number_id),number: row.catalogue_number},basis_of_record: {id: parseInt(row.basis_of_record_id),name: row.basis_of_record_name,name_spanish: row.basis_of_record_name_spanish}, taxon_rank_id: row.taxon_rank_id, taxon_rank: row.taxon_rank};

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
