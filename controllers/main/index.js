
/*
 * GET home page.
 */

var dbWrapper = require("../../lib/dbUtils");
var markercluster = require("../../lib/markercluster");
//var leaflet = require("../../lib/leaflet/leaflet-src");

exports.index = function(req, res){
	dbWrapper.initConnection();
	dbWrapper.getAllGeoOccurrenceData(function(rows) {
		//res.writeHead(200, {'Content-Type':'application/json'});
		//res.write(JSON.stringify(rows));
		//res.end();
		//var sopas = 'sopas';
		var cluster = markercluster.markerClusterGroup();
		for (var i = 0; i < rows.length; i++) {
			//occurrence = rows[i];
			//console.log(latLong);
			//console.log(JSON.stringify(latLong));
			var marker = markercluster.marker(markercluster.latLng(rows[i].latitude, rows[i].longitude), { title: rows[i].canonical + ' (' + rows[i].num_occurrences + ')' });
			//marker.bindPopup(rows[i].canonical + ' (' + rows[i].num_occurrences + ')');
			//console.log(marker);
			//var seen = [];
			//var json = JSON.stringify(marker, function(key, val) {
			//	if (typeof val 
			//		if (seen.indexOf(val) >= 0)
			//			return;
			//		seen.push(val);
			//	}
			//	return val;
			//});
			//console.log(json);
			cluster.addLayer(marker);
			//console.log(cluster);
		}
		//var myCars=new Array("Saab",23,"BMW");
		//console.log(myCars);
		//
		//var latlong = new cluster.L.LatLng(occurrence.latitude, occurrence.longitude)
		
		//console.log(cluster);

		res.render('index', { title: 'Explorador - Portal de datos SIB Colombia', data: JSON.stringify(rows) });
	});
	dbWrapper.closeConnection();
	//res.render('index', { title: 'Explorador - Portal de datos SIB Colombia' });
};