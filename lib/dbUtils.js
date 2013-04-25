var mysql = require("mysql");

var connection;

exports.initConnection = function() {
	connection = mysql.createConnection({
		host : 'localhost',
		user : 'root',
		database : 'dataportal',
		port: '3306',
		password : 'h4s1p8k2'
	});
	connection.connect(function(err){
		if(!err) {
			console.log("You are connected to the database.");
		} else {
			throw err;
		}
	});
}

exports.closeConnection = function() {
	connection.end(function(err){
		if(!err) {
			console.log("Mysql connection is terminated.");
		} else {
			throw err;
		}
	});
}

exports.getAllGeoOccurrenceData = function(result) {
	connection.query("select id, canonical, num_occurrences, latitude, longitude from geo_ocurrence_record_denormalized WHERE geo_ocurrence_record_denormalized.iso_country_code = 'CO' LIMIT 1000", function(err, rows, fields) {
		if (err) {
			res.send(err);
		}
		result(rows);
	});
}
 
/*exports.getLatestEntries = function(cb) {
CONN.query("select id, title, alias, posted from tblblogentries order by posted desc limit 0,10", function(err, rows, fields) {
cb(rows);
});
}
 
exports.getBlogEntryById = function(id,success,fail) {
CONN.query("select id, title, body, morebody, posted from tblblogentries where id = ?",[id], function(err, rows, fields) {
if(rows.length == 1) success(rows[0]);
else fail();
});
}
 
exports.getBlogEntry = function(date,alias,success,fail) {
var year = date.getFullYear();
var month = date.getMonth()+1;
var day = date.getDate();
CONN.query("select id, title, body, morebody, posted from tblblogentries where year(posted) = ? and month(posted) = ? and dayofmonth(posted) = ? and alias = ?",
[year,month,day,alias], function(err, rows, fields) {
if(rows && rows.length == 1) {
exports.getCommentsForBlogEntry(rows[0].id, function(comments) {
success(rows[0],comments);
});
}
else fail();
});
}
 
exports.getCommentsForBlogEntry = function(id,success) {
CONN.query("select id, name, email, comment, posted, website from tblblogcomments where entryidfk = ?", [id], function(err, rows, fields) {
if(!rows || !rows.length) rows = [];
success(rows);
});
}*/