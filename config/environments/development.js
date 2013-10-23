var express = require('express')
  , path = require('path')
  , winston = require('winston');

module.exports = function(parent) {
	parent.use(express.errorHandler());
	parent.use(express.static(path.join(__dirname, '/../../public')));

	logger = new (winston.Logger)({
		transports: [
			new (winston.transports.Console)()
		]
	});
};