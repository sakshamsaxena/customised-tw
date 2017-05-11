#!/usr/bin/env node

const fs = require('fs');
const exec = require('child_process').exec;
const readline = require('readline');
const rl = readline.createInterface({
	input: process.stdin,
	output: process.stdout
});

var conPub = null;
var conSec = null;

rl.question("Hi !\nKindly enter your Twitter API keys below\n\nConsumer Public : ", function(args) {
	conPub = args;
	rl.question("Consumer Secret : ", function(args) {
		conSec = args;
		updateConfig();
		rl.close();
	});
});

function updateConfig() {

	var data = fs.readFileSync("./config/config.sample.js", "ascii");
	data = data.replace("consumer-public-key", conPub);
	data = data.replace("consumer-secret-key", conSec);

	fs.writeFile("./config/config.js", data, "utf8", function(args) {
		exec("rm ./config/config.sample.js", function(err, stdout, stderr) {
			if (err)
				throw new Error(err)
			if (stderr)
				throw new Error(stderr)
			console.log(stdout + "\nAll done !");
		})
	});
}