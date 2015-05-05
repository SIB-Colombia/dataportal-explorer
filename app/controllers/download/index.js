var request = require("request");

exports.startDownload = function(req, res) {

	if(req.body.captchaKey) {
		// Send request validation with google captcha service
		var options = {
			url: 'https://www.google.com/recaptcha/api/siteverify',
			method: 'POST',
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded'
			},
			form: {
				'secret': process.env.CAPTCHASECRET,
				'response': req.body.captchaKey
			}
		};
		// Start the request
		request(options, function (error, response, body) {
			if (!error && response.statusCode == 200) {
				// Print out the response body
				var resultObject = JSON.parse(body);
				console.log(resultObject);
				if(resultObject.success != false) {
					var kafka = require('kafka-node'),
							Producer = kafka.Producer,
							client = new kafka.Client(),
							producer = new Producer(client);

					var message = {
						"email": req.body.email,
						"reason": req.body.reason,
						"type": req.body.type,
						"query": req.body.query
					}
					var payloads = [
						{ topic: 'occurrencesDownload', messages: JSON.stringify(message), partition: 0 }
					];
					producer.on('ready', function () {
						producer.send(payloads, function (err, data) {
							console.log(data);
							res.jsonp({"success": "true"});
						});
					});

					producer.on('error', function (err) {
						res.sendStatus(400);
					});

				} else {
					res.sendStatus(401);
				}
			}
		});
	} else {
		var kafka = require('kafka-node'),
				Producer = kafka.Producer,
				client = new kafka.Client(),
				producer = new Producer(client);

		var message = {
			"email": req.body.email,
			"reason": req.body.reason,
			"type": req.body.type,
			"query": req.body.query
		}
		var payloads = [
			{ topic: 'occurrencesDownload', messages: JSON.stringify(message), partition: 0 }
		];
		producer.on('ready', function () {
			producer.send(payloads, function (err, data) {
				console.log(data);
				res.jsonp({"success": "true"});
			});
		});

		producer.on('error', function (err) {
			res.sendStatus(400);
		});

	}
};
