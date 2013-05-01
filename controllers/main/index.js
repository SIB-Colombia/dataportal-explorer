/**
 * Module dependencies.
 */
var mongoose = require('mongoose')
  , Occurrence = mongoose.model('Occurrence')

var dbWrapper = require("../../lib/dbUtils");
var serverCluster = require("../../lib/servercluster");
var markercluster = require("../../lib/markercluster");
//var leaflet = require("../../lib/leaflet/leaflet-src");

exports.updatemongodb = function(req, res) {
	dbWrapper.initConnection()
	dbWrapper.getAllGeoOccurrenceData(function(rows) {
		for (var i = 0; i < rows.length; i++) {
			var occurrence = new Occurrence({id: rows[i].id, canonical: rows[i].canonical, num_occurrences: rows[i].num_occurrences, latitude: rows[i].latitude, longitude: rows[i].longitude})
			occurrence.save()
		}
	})
	dbWrapper.closeConnection()
	res.send("MongoDB Database updated");
}

exports.index2 = function(req, res){
	Occurrence.find(function (err, occurrence) {
		if(err)
			console.log("Fail loading mongodb database data")
		res.render('index', { title: 'Explorador - Portal de datos SIB Colombia' });
	})
};

exports.index = function(req, res) {
	dbWrapper.initConnection();
	dbWrapper.getAllGeoOccurrenceData(function(rows) {
		//res.writeHead(200, {'Content-Type':'application/json'});
		//res.write(JSON.stringify(rows));
		//res.end();
		//var sopas = 'sopas';
		//var cluster = markercluster.markerClusterGroup();
		var cluster = serverCluster.markerClusterGroup();
		/*for (var i = 0; i < rows.length; i++) {
			var marker = serverCluster.marker(serverCluster.latLng(rows[i].latitude, rows[i].longitude), { title: rows[i].canonical + ' (' + rows[i].num_occurrences + ')' });
			marker.bindPopup(rows[i].canonical + ' (' + rows[i].num_occurrences + ')');
			cluster.addLayer(marker);
		}
		var finalCluster = cluster.createCluster();*/
	
		res.render('index', { title: 'Explorador - Portal de datos SIB Colombia', data: JSON.stringify(rows) });
	});
	dbWrapper.closeConnection();
	//res.render('index', { title: 'Explorador - Portal de datos SIB Colombia' });
}