var express = require('express');
var app = express();
var request = require('request');
app.use('/static', express.static(__dirname + '/../client/release'));
app.use('/', express.static(__dirname + '/../client/release'));

var URL = "https://api.contentstack.io";

var port = process.env.PORT || 5000;

app.use('/', function(req, res) {
    req.headers["web_ui_api_key"] = "607a456d7f3afc20cd9fcb1f";
    req.pipe(request(URL + req.url)).pipe(res);
});

app.listen(port);

console.log('Worker[%d] : Application running on [%d] Port.', 1, port);