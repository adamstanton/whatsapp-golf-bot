var express = require('express');
var router = express.Router();

//GETS
router.get('/data/getAllTeams', function(req, res) {
    dbAPI.getAllTeams(function(data) {
        res.json(data, undefined);
    });
});

//POSTS
router.post('/addNewEvent', function(req, res) {
	//idbAPI.addEvent(req.body, res);
});
