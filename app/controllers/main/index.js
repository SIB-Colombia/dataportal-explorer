var Recaptcha = require('recaptcha').Recaptcha;

var PUBLIC_KEY  = '6LdwrAUTAAAAAL7SMgkNMSjvdiMxS0YwaZ8AcSYE',
    PRIVATE_KEY = process.env.CAPTCHASECRET;

exports.index = function(req, res) {
	var recaptcha = new Recaptcha(PUBLIC_KEY, PRIVATE_KEY);
	res.render('index', { title: 'Explorador - Portal de datos SIB Colombia', recaptcha_form: recaptcha.toHTML() });
};
