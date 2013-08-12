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