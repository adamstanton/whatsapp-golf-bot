var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});
router.get('/output_rugby_arfu', function(req, res, next) {;
  res.render('output_rugby_arfu', { title: '' });
});

module.exports = router;
