var request = require("request"),
    Recaptcha = require('recaptcha').Recaptcha;

var PUBLIC_KEY  = '6LdwrAUTAAAAAL7SMgkNMSjvdiMxS0YwaZ8AcSYE',
    PRIVATE_KEY = process.env.CAPTCHASECRET;

exports.startDownload = function(req, res) {
	var data = {
		remoteip:  req.ip || req.ips,
		challenge: req.body.challenge,
		response:  req.body.response
	};
	var recaptcha = new Recaptcha(PUBLIC_KEY, PRIVATE_KEY, data);

	recaptcha.verify(function(success, error_code) {
		if (success) {
			var kafka = require('kafka-node'),
					Producer = kafka.Producer,
					client = new kafka.Client(),
					producer = new Producer(client);

			// Print out the response body
			if(typeof req.body.ipsource !== "undefined") {
				remoteip = req.body.ipsource;
			} else {
				remoteip = req.ip || req.ips;
			}
			var message = {
				"email": req.body.email,
				"reason": req.body.reason,
				"type": req.body.type,
				"query": req.body.query,
				"date": req.body.date,
				"remoteip": remoteip
			}
			var payloads = [
				{ topic: 'occurrencesDownload', messages: JSON.stringify(message), partition: 0 }
			];
			producer.on('ready', function () {
				producer.send(payloads, function (err, data) {
					res.jsonp({"success": "true"});
				});
			});

			producer.on('error', function (err) {
				res.sendStatus(400);
			});
		} else {
			res.sendStatus(401);
		}
	});
};
