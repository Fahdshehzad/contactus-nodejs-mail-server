/*
*
* Mail server based on node.js.
* Add mail and other settings in properties.ini file
*
*/

var express = require('express');
var app = express();

var nodemailer = require('nodemailer');
var PropertiesReader = require('properties-reader');
var properties = PropertiesReader('properties.ini');
var request = require('request');


// Put your recaptcha secret key here.
const secretKey = properties.get('recap.secretKeyV2');


// Parse URL-encoded bodies (as sent by HTML forms)
app.use(express.urlencoded());

// Parse JSON bodies (as sent by API clients)
app.use(express.json());

// Access the parse results as req.body
app.post('/', function(req, res) {

	// g-recaptcha-response is the key that browser will generate upon form submit.
	// if its blank or null means user has not selected the captcha, so return the error.
	if(req.body['g-recaptcha-response'] === undefined || req.body['g-recaptcha-response'] === '' || req.body['g-recaptcha-response'] === null) {
		return res.json({"responseCode" : 1,"responseDesc" : "Please select captcha"});
	}
	// req.connection.remoteAddress will provide IP address of connected user.
	var verificationUrl = "https://www.google.com/recaptcha/api/siteverify?secret=" + secretKey + "&response=" + req.body['g-recaptcha-response'] + "&remoteip=" + req.connection.remoteAddress;
	
	// Hitting GET request to the URL, Google will respond with success or error scenario.
	request(verificationUrl, function(error, response, body) {
		body = JSON.parse(body);
		// Success will be true or false depending upon captcha validation.
		if(body.success !== undefined && !body.success) {
		    res.status(400);
            res.send('Failed captcha verification');
            return;
		}

		let name = req.body.name || 'Missing Name';
		let replyTo = req.body.email;
		let phoneNo = req.body.phoneNo || 'Missing Phone';
		let reason = req.body.reason || 'Missing reason';
		let message = req.body.message || 'Missing Message';

		var transporter = nodemailer.createTransport({
			host: properties.get('mail.host'),
			port: properties.get('mail.port'),		
			secure: true, // true for 465, false for other ports
			auth: {
				user: properties.get('auth.user'),
				pass: properties.get('auth.pass')
			}
		});

		let mailOptions = {
			replyTo: replyTo,
			from: '"' + properties.get('mail.fromName') + '" ' + properties.get('mail.from'), // sender address
			to: properties.get('mail.to'), // list of receivers
			subject: reason + ' ' + name, // Subject line
			text: name + '\n' + phoneNo + '\n' + message // plain text body
		}

		transporter.sendMail(mailOptions, function(error, info){
		  if (error) {
			res.send('Message not Sent: ' + error);
		  } else {
			res.send('Message Sent: ' + info.response);
		  }
		});
	});
});

app.listen(5050)

