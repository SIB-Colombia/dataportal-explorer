var occurrencesES = require("../../models/elasticsearch/occurrencesModel");
var _ = require('underscore');

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
	occurrences = occurrencesES.getDistributionStats("onedegree", req.params._cellid);
	occurrences.exec(function(err, data){
		res.jsonp(JSON.parse(data));
	});
};

exports.getDistributionStatsPointFiveDegree = function(req, res) {
	occurrences = occurrencesES.getDistributionStats("pointfivedegree", req.params._cellid, req.params._pointfivecellid);
	occurrences.exec(function(err, data){
		res.jsonp(JSON.parse(data));
	});
};

exports.getDistributionStatsPointTwoDegree = function(req, res) {
	occurrences = occurrencesES.getDistributionStats("pointtwodegree", req.params._cellid, req.params._pointtwocellid);
	occurrences.exec(function(err, data){
		res.jsonp(JSON.parse(data));
	});
};

exports.getDistributionStatsPointOneDegree = function(req, res) {
	occurrences = occurrencesES.getDistributionStats("pointonedegree", req.params._cellid, req.params._centicellid);
	occurrences.exec(function(err, data){
		res.jsonp(JSON.parse(data));
	});
};

exports.getDistributionStatsWithSearchOneDegree = function(req, res) {
	occurrences = occurrencesES.getDistributionStatsWithSearchCondition("onedegree", req.body);
	occurrences.exec(function(err, data){
		res.jsonp(JSON.parse(data));
	});
};

exports.getDistributionStatsWithSearchPointFiveDegree = function(req, res) {
	occurrences = occurrencesES.getDistributionStatsWithSearchCondition("pointfivedegree", req.body);
	occurrences.exec(function(err, data){
		res.jsonp(JSON.parse(data));
	});
};

exports.getDistributionStatsWithSearchPointTwoDegree = function(req, res) {
	occurrences = occurrencesES.getDistributionStatsWithSearchCondition("pointtwodegree", req.body);
	occurrences.exec(function(err, data){
		res.jsonp(JSON.parse(data));
	});
};

exports.getDistributionStatsWithSearchPointOneDegree = function(req, res) {
	occurrences = occurrencesES.getDistributionStatsWithSearchCondition("pointonedegree", req.body);
	occurrences.exec(function(err, data){
		res.jsonp(JSON.parse(data));
	});
};

exports.searchDistributionOccurrences = function(req, res) {
	occurrences = occurrencesES.getDistributionWithFilter(req.body);
	occurrences.exec(function(err, data){
		res.jsonp(JSON.parse(data));
	});
};
