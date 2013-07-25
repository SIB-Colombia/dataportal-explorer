var express = require('express')
  , winston = require('winston');

module.exports = function(parent) {
	parent.use(express.errorHandler());

	logger = new (winston.Logger)({
		transports: [
			new (winston.transports.Console)()
		]
	});
};