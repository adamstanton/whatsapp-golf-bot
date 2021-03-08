var express = require('express');
var apiRoutes = express.Router();
var config = require('../config'); // get our config file
var tcp = require('../comms/chyron');
var log = require('../logprocess/logparser');

// route to show API is working and return a message (GET http://localhost:8080/api/)
apiRoutes.get('/', function(req, res) {
  res.json({ message: 'Welcome to the MST GFX HUB.' });
});

apiRoutes.post('/toggleLogging', function(req, res) {
  tcp.toggleLogging();
  res.json({ message: 'done...' });
});

apiRoutes.post('/unlicense', function(req, res) {
  tcp.unlicense();
  res.json({ message: 'done...' });
});

apiRoutes.post('/license', function(req, res) {
  tcp.license();
  res.json({ message: 'done...' });
});

apiRoutes.post('/processLogFile', function(req, res) {
  if (req.body.logfile) {
    log.parseFile(req.body.logfile)
    res.json({ message: 'processing' });
  } else {
    res.json({ message: 'no log file found in request' });
  }
});

apiRoutes.get('/exportMessageNumbers', function(req, res) {
  log.exportMessageNumbers(function(data) {
    res.json({ message: data });
  });
});

apiRoutes.get('/games/:season', function(req, res) {
  if (req.params.season) {
    res.json({ success: "db_data.success", message: "db_data.message", data:" db_data.data" });
  } else {
    res.json({ success: false, message: "Please specify a season e.g: ../api/games/2016", data: "" });
  }
});

module.exports = apiRoutes;
