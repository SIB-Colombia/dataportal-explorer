var express = require('express')
  , winston = require('winston');

module.exports = function(parent) {
	logger = new (winston.Logger)({
    transports: [
      new (winston.transports.Console)({ level: 'error' }),
      new (winston.transports.File)({ filename: '/../../logs/dataportal-explorer.log' })
    ]
  });
};