var express = require('express');
var router = express.Router();
var twilio = require('twilio');

// Create an authenticated client to access the Twilio REST API
var client = twilio(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN);

// Load configuration information from system environment variables.
var TWILIO_ACCOUNT_SID = 'ACa21a7d6a8d37d6806cf26b4dbdf36099';
var TWILIO_AUTH_TOKEN = '897f1943751ca4d0641560c828cae99f';
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

router.post("/testwebhookff", (req, res) => {
    //const attributes = req.body.message;



     console.log('in routes.js' + req.body);
    // response = translateMessage(req.body.message);
    //client.messages.create({
    //  from: 'whatsapp:+14155238886',
    //  body: response,
    //  to: 'whatsapp:+447507467702'
    //}).then(function(message) {
      // When we get a response from Twilio, respond to the HTTP POST request
      // res.send('Message is inbound!');
	  // res.status(err.status).end();
	//  console.log('message sent');
    //});
    // console.log(attributes)
    // res.send(`<Response><Message>${attributes}</Message></Response>`)
    //.send(attributes);
  });
  
  function translateMessage(incoming) {
    let translate = '';
    if (incoming.includes('h')) {
      let place = incoming.split('h');
      if (translate !== '') {translate += ' '};
      translate += 'hole ' + extractNumber(place[1]);
    }
    if (incoming.includes('s')) {
      let place = incoming.split('s');
      if (translate !== '') {translate += ' '};
      translate += 'shot ' + extractNumber(place[1]);
    }
    if (incoming.includes('p')) {
      let place = incoming.split('p');
      if (translate !== '') {translate += ' '};
      translate += 'player ' + extractNumber(place[1]);
    }
    return  translate + '?  y or n';
  }
  
  function extractNumber(str) {
    rtnStr = '';
    for (i=0 ; i < str.length ; i++) {
      var res = str.charAt(i);
      if (isNumeric(res)) {
        rtnStr += res;
      } else {
        return rtnStr;
      }
    }
    return rtnStr;
  }
  
  function isNumeric(n) {
    return !isNaN(parseFloat(n)) && isFinite(n);
  }


module.exports = router;
