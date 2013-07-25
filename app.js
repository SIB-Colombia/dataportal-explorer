/*
 * Module dependencies.
 */

var express = require('express')
  , http = require('http');

var app = express();

// Load app configuration
require('./config/environments/all')(app);

http.createServer(app).listen(app.get('port'), function() {
	console.log('Express server listening on port ' + app.get('port'));
});