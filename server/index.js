'use strict';

var express = require('express'),
	app = express(),
	http = require('http').Server(app);

app.use(express.static('static'));

app.set('views', './client/templates');
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');

app.get('/', function(req, res) {
	res.render('index.html', {});
});

http.listen(3000, function() {
	console.log('Listening on port 3000');
});