var express = require('express');
var compress = require('compression');
var favicon = require('serve-favicon');
var morgan  = require('morgan');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var path = require('path');

module.exports = function(parent) {
	var oneMonth = 2592000;
	parent.set('port', process.env.PORT || 3000);
	parent.set('view engine', 'jade');
	parent.set('jsonp callback', true );
	parent.use(compress());
	parent.use(favicon(__dirname + '/../../public/images/sib.ico'));
	parent.use(morgan('dev'));
	parent.use(bodyParser.urlencoded({
		extended: true
	}));
	parent.use(bodyParser.json());
	parent.use(methodOverride());
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
