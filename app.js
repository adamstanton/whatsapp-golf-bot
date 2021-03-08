var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var routes = require('./routes/routes.js');
var http = require('http');

var app = express();
var socketapp = express();
var server = http.createServer(app);
global.io = require('socket.io')(server);
const sql = require('mssql')
require('./whatsapp/post-sql.js')(sql);
// console.log('sqlFunc=' + sqlFunc);
// golfDraw = sqlFunc.golfDraw();

// view engine setup
app.engine('.html', require('ejs').__express);
app.set('app engine', 'html');
app.set('app engine', 'ejs');
app.set('app', __dirname + '/app');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
//app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'app')));

io.on('connection', function (client) {    
     require('./whatsapp/message-svr.js')(client, sql, routes);
});

// render our home page
app.use('/', routes);
// handle a POST request to send a text message. 
// This is sent via ajax on our home page
app.post('/message', function(req, res, next) {
  console.log('hello world');
  // Use the REST client to send a text message
  client.messages.create({
    from: 'whatsapp:+14155238886',
    body: 'Good luck on your Twilio quest!',
    to: 'whatsapp:+447507467702'
  }).then(function(message) {
    // When we get a response from Twilio, respond to the HTTP POST request
    res.send('Message is inbound!');
  });
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.json({
          message: err.message,
          error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.json({
      message: err.message,
      error: err
    });
});

module.exports = { app, server };
