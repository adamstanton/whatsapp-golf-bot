var express = require('express');
var router = express.Router();

//DEV
 //function isAuthenticated(req, res, next) {
 //    req.user = {first: 'Ashley', last: 'Williams', _id: 'arfu_user'};
 //    return next();
// }

/* **************** FULL REQUESTS ******************** */
var defaultOpt = {
	root: __dirname + '/../app',
	dotfiles: 'deny'
};
router.get('/', function(req, res) {
	//req.session.matchID = req.user._id;
	console.log('in /');
	 res.sendFile('index.html', defaultOpt, function (err) {
	 	if (err) {
	 		console.log(err);
	 		res.status(err.status).end();
	 	} else {
	 		console.log('Sent: ', 'index');
	 	}
	 });
});

router.get('/view', function(req, res) {
	//req.session.matchID = req.user._id;
	console.log('in /');
	 res.sendFile('view.html', defaultOpt, function (err) {
	 	if (err) {
	 		console.log(err);
	 		res.status(err.status).end();
	 	} else {
	 		console.log('Sent: ', 'view');
	 	}
	 });
});

module.exports = router;
