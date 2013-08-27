var occurrencesES = require("../../models/elasticsearch/occurrencesModel");

exports.listInitialDistributionOneDegree = function(req, res) {
	occurrences = occurrencesES.getDistributionsOneDegree();
	occurrences.exec(function(err, data){
		res.jsonp(JSON.parse(data));
	});
};

exports.listInitialDistributionCentiDegree = function(req, res) {
	occurrences = occurrencesES.getDistributionsCentiDegree();
	occurrences.exec(function(err, data){
		res.jsonp(JSON.parse(data));
	});
};

exports.listInitialDistributionPointFiveDegree = function(req, res) {
	occurrences = occurrencesES.getDistributionsPointFiveDegree();
	occurrences.exec(function(err, data){
		res.jsonp(JSON.parse(data));
	});
};

exports.listInitialDistributionPointTwoDegree = function(req, res) {
	occurrences = occurrencesES.getDistributionsPointTwoDegree();
	occurrences.exec(function(err, data){
		res.jsonp(JSON.parse(data));
	});
};

exports.getDistributionStatsOneDegree = function(req, res) {
	occurrences = occurrencesES.getStatsOccurrencesOneDegree(req.params._cellid);
	occurrences.exec(function(err, data){
		res.jsonp(JSON.parse(data));
	});
};

exports.getDistributionStatsPointOneDegree = function(req, res) {
	occurrences = occurrencesES.getStatsOccurrencesPointOneDegree(req.params._cellid, req.params._centicellid);
	occurrences.exec(function(err, data){
		res.jsonp(JSON.parse(data));
	});
};

exports.getDistributionStatsPointFiveDegree = function(req, res) {
	occurrences = occurrencesES.getStatsOccurrencesPointFiveDegree(req.params._cellid, req.params._pointfivecellid);
	occurrences.exec(function(err, data){
		res.jsonp(JSON.parse(data));
	});
};

exports.getDistributionStatsPointTwoDegree = function(req, res) {
	occurrences = occurrencesES.getStatsOccurrencesPointTwoDegree(req.params._cellid, req.params._pointtwocellid);
	occurrences.exec(function(err, data){
		res.jsonp(JSON.parse(data));
	});
};