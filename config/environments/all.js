var express = require('express')
  , path = require('path');

module.exports = function(parent) {
	var oneMonth = 2592000;
	parent.set('port', process.env.PORT || 3000);
	parent.set('view engine', 'jade');
	parent.set('jsonp callback', true );
	parent.use(express.compress());
	parent.use(express.favicon());
	parent.use(express.logger('dev'));
	parent.use(express.bodyParser());
	parent.use(express.methodOverride());
	parent.use(require('stylus').middleware(__dirname + '/../../public'));

	var env = process.env.NODE_ENV || 'development';

	// Load configuration according to environment
	if(process.env.NODE_ENV == 'development') {
		require('./development')(parent);
	} else if(process.env.NODE_ENV == 'production') {
		require('./production')(parent);
	} else {
		require('./development')(parent);
	}

	// Databases initialization
	require('./../initializers/databases')(env);

	// load controllers
	require('./../routers')(parent, { verbose: true });

	logger.info("Dataportal Explorer initial configuration loaded.");
};