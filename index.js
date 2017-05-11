/*
	Customised Twitter Feed
	By Saksham Saxena
	May 2017

	A simple server to fetch popular tweets with #custserv hashtag and at least one retweet.

	Released under MIT License

*/

/* Based on Express for minimal obstruction and maximum scalability. */
var express = require('express');
var bodyParser = require('body-parser');
var request = require('superagent');
var base64 = require('base-64');

/* Keeping the sensitive configuration information separate from the logic. */
var config = require('./config/config.js');

/* Setting up the HTTP Server App of Express. */
var app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.set('json spaces', 4);

/* Root Route */
app.get('/', function(req, res) {
	/* Create the Auth Key for using the API. */
	var key = base64.encode(config.CONSUMER_PUBLIC + ':' + config.CONSUMER_SECRET);

	/* Consume the API using Promises to ensure correct flow. */
	new Promise(function(resolve, reject) {
			/* Obtain the Access Token */
			request
				.post('https://api.twitter.com/oauth2/token')
				.set('Authorization', 'Basic ' + key)
				.set('Content-Type', 'application/x-www-form-urlencoded;charset=UTF-8')
				.send('grant_type=client_credentials')
				.end(function(err, res) {
					if (err) {
						reject(err);
					} else {
						resolve(res.body.access_token);
						console.log("Received the access token.");
					}
				});
		})
		.then(function(token) {
			/* Use the Token to obtain the required tweets */
			var tweets = [];
			request
				.get('https://api.twitter.com/1.1/search/tweets.json?q=%23custserv&result_type=popular')
				.set('Authorization', 'Bearer ' + token)
				.end(function(err, resp) {
					if (err) {
						throw err;
					} else {
						var response = resp.body.statuses;
						/* Look for those tweets with a retweet count */
						for (var i = 0; i < response.length; i++) {
							if (response[i].retweet_count)
								tweets.push(response[i]);
						}
					}
					/* Respond with the tweet object array. */
					res.json(tweets);
					console.log("Got the Tweets!");
				});
		})
		.catch(function(err) {
			console.error(err);
			process.exit(1);
		});
});

/* Listen to the Port */
app.listen(8000, function() {
	console.log('Your Customised Twitter Feed is live on port 8000!')
});

module.exports = app;