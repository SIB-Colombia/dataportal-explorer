var occurrencesES = require("../../models/elasticsearch/occurrencesModel");
var _ = require('underscore');

exports.startDownload = function(req, res) {
	//console.log(req.body);
	console.log(JSON.stringify(req.body));
	//occurrences = occurrencesES.getDistributionWithFilter(req.body);
	//occurrences.exec(function(err, data){
	res.jsonp({"result": "ok"});
};
