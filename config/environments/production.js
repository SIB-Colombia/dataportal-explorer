var express = require('express')
  , path = require('path')
  , winston = require('winston');

module.exports = function(parent) {
	parent.use(express.static(path.join(__dirname, '/../../public'), { maxAge: oneMonth }));
	
	logger = new (winston.Logger)({
		transports: [
			new (winston.transports.Console)({ level: 'error' }),
			new (winston.transports.File)({ filename: 'logs/dataportal-explorer.log' })
		]
	});
};