

module.exports = function(client, sql, routes) {

    requesthttp = require('request');
    request = require('request-json');
    
    var config = require('../config/project-config.json');

    var golfDraw = [];
    var displayMessages = [];
    var clientMessageModel = {
        match: 0,
        player: [{
            hole: 0,
            shot: 0,
            in: 0,
            orderOfPlay: 0,
            leaderboardRow: {},     
        }, 
        {
        hole: 0,
        shot: 0,
        in: 0,
        orderOfPlay: 0,
        leaderboardRow: {},     
        },
        {
        hole: 0,
        shot: 0,
        in: 0,
        orderOfPlay: 0,
        leaderboardRow: {},     
        },
        {
        hole: 0,
        shot: 0,
        in: 0,
        orderOfPlay: 0,
        leaderboardRow: {},     
        }],
        pIndex: 0, // Ply Index above. 
        translatedMessage: '',
        message: '',
        action: ''
    }

    let clientMessage = JSON.parse(JSON.stringify((clientMessageModel)));

    // We need this to build our post string
    var http = require('http');
    var twilio = require('twilio');
    
    // Load configuration information from system environment variables.
    var TWILIO_ACCOUNT_SID = 'ACa21a7d6a8d37d6806cf26b4dbdf36099',
    TWILIO_AUTH_TOKEN = '0f5d3915cfde5734f6468b768a7bd23f',
    TWILIO_PHONE_NUMBER = process.env.TWILIO_PHONE_NUMBER;

    // Create an authenticated client to access the Twilio REST API
    var twilio_client = twilio(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN);

    function PostDraw() {
            var dataclient = request.createClient(config.intraneturl +  '/');
            // var traceString = JSON.stringify(shotdata.stats);
            // console.log('home/sendtracedata?TournamentID=' + tournID + '&Round=' + round + '&TraceData=' + traceString );
            // Build the post string from an object
            // An object of options to indicate where to post to

            dataclient.post('MST.XML', function(err, res, body) {
                return console.log(err + ':' + res.statusCode);
            });

            // Set up the request
            //var post_req = http.request(post_options, function(res) {
            //    res.setEncoding('utf8');
            //    res.on('data', function (chunk) {
            //       // console.log('Response: ' + chunk);
             //   });
            //});

            // post the data
         //   post_req.write(traceString);
         //   post_req.end();

          //  requesthttp.post('https://ptsv2.com/t/l3bm3-1547718442/post', traceString)
            console.log('PostTrace complete'  );

        }
        var CCGTemplateName = '';
        var user = {
            _id: ''
        };
         console.log('--------USER--------');
         console.log(client.id);

        user._id = 'topt_user';
        var sessionUserID = user._id;
        var sessionCCGID = '';
        var grpStr = "user:" + sessionUserID;
        var gfxgrpStr = "gfxuser:" + sessionUserID;
        var tournID = 0;
        client.join(grpStr);
        console.log('socket io is actually working');
        console.log('*********** SESSION INFO ***********');
        var userConfig = {};
        if (!client.request.session) {
            console.log('creating new session');
            client.request.session = {};
            client.request.session.config = {
                userid: ""
            };
            userConfig = client.request.session.config;
            getDraw();
        }

        function getDraw() {

          var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
          var parser = require('xml2json');
          const xhr = new XMLHttpRequest();
          xhr.open('GET', config.intraneturl  + `/MST.XML`, true);
          xhr.onload = function(e) {
          console.log('got', this.status);
            if (this.status == 200) {
              var json = parser.toJson(this.responseText);
              golfDraw = JSON.parse(json);
            }
          };
          xhr.onerror = function(e) {
          console.log('error???', e);
          };
          xhr.send();

          //PostDraw();
            //console.log('in post-sql=' + config.testmode);
     
               // ... error checks
           
               // Query
        //       new sql.Request().query('select * from Tournament where status = 1', (err, result) => {
        //        if (result !== undefined) {
        //          tournID = result.recordset[0].TournamentID;
                  //console.dir(result.recordset[0].TournamentID);
        //          new sql.Request().query('SELECT * from Leaderboard where TournamentID = ' + result.recordset[0].TournamentID + ' and Round = ' + result.recordset[0].CurrentRound 
        //          + ' ORDER BY Match, orderInMatch', (err, result) => {
        //              golfDraw = result.recordset;
                      // console.log(golfDraw);
        //          }) 
        //        } else {
        //            console.log('no tournaments found');
        //        }
        //       })
        }

        console.dir(userConfig);
        console.log('*********** ************ ***********');
        // disconnect event
        client.on('disconnect', function() {
            console.log(client.id + ' has disconnected from the server');
        });
                
        client.on('getTopTracerAPI', function(options) {
       //     console.log(options.host + "-" + options.path);
            var toptracerClient = request.createClient(options.host);

            toptracerClient.get(options.path, function(err, res, body) {
                //console.log(body);
               client.emit('r-TopTracerAPI', body, options);
            });
            
        });

        var checkIsRunning =  null;

        client.on('postTopTracerShot', function(shotdata, options) {
            if (shotdata.stats.landing_angle != undefined) {
              shotdata.stats.landing_angle = shotdata.stats.landing_angle.toFixed(1);
            }
            if (shotdata.stats.ball_speed != undefined) {
                shotdata.stats.ball_speed = shotdata.stats.ball_speed.toFixed(1);
            }
            if (shotdata.stats.flat_carry != undefined) {
                shotdata.stats.flat_carry = shotdata.stats.flat_carry.toFixed(1);
            }
            if (shotdata.stats.curve != undefined) {
                shotdata.stats.curve = shotdata.stats.curve.toFixed(1);
            }
          //  console.log ('height before=' + shotdata.stats.height);
            shotdata.stats.height = shotdata.stats.height - config.cameraheight;
            shotdata.stats.height = shotdata.stats.height.toFixed(1)
         //   console.log ('height after=' + shotdata.stats.height);
            if (shotdata.stats.launch_angle != undefined) {
                 shotdata.stats.launch_angle = shotdata.stats.launch_angle.toFixed(1);
            }
            
            if (shotdata.stats.hang_time != undefined) {
                shotdata.stats.hang_time = shotdata.stats.hang_time.toFixed(1);
            }
            if (options.playerid != undefined) {
                console.log('options.playerid == ' + options.playerid);
                shotdata.stats.MSTID = options.playerid.toString();
            }
            else
            {
                console.log('options.playerid == undefined');
                options.playerid = 0;
            }
            shotdata.stats.hole = options.bay_id.toString();
            shotdata.stats.round = parseInt(options.roundNo);
            shotdata.stats.pollstatus = "hit";

            if (options.playerid > -1)
            {
                if (config.testmode != 1 && options.postsql == true)
                {
                    clearTimeout(checkIsRunning);
                    checkIsRunning = setTimeout(function () {
                        console.log('insert SQL');
                        new sql.Request()
                            .input('Round', sql.Int, options.roundNo)
                            .input('TournamentID', sql.Int, tournID)
                            .input('Round', sql.Int, options.roundNo)
                            .input('Hole', sql.Int, options.bay_id)
                            .input('MSTID', sql.Int, options.playerid)
                            .input('LandingAngle', sql.Real, shotdata.stats.landing_angle)
                            .input('BallSpeed', sql.Real, shotdata.stats.ball_speed)
                            .input('FlatCarry', sql.Real, shotdata.stats.flat_carry)
                            .input('Curve', sql.Real, shotdata.stats.curve)
                            .input('Height', sql.Real, shotdata.stats.height)
                            .input('HangTime', sql.Real, shotdata.stats.hang_time)
                            .input('LaunchAngle', sql.Real, shotdata.stats.launch_angle)
                            .input('ShotNumber', sql.Int, 1)
                            .input('ShotID', sql.Int, 999)
                            .input('remove', sql.Int, 0)
                        // .output('output_parameter', sql.VarChar(50))
                            .execute('addTraceStats', (err, result) => {
                                // ... error checks
                        
                                //console.dir(result)
                            });  
                            options.optionid = 5;  //shot complete 
                            PostTrace(tournID, options.roundNo, shotdata);
                    }, 500);
                  
                }
            }
            else
            {
                console.log('error: playerid=0 ');
            }
            client.emit('r-postTopTracerShot', shotdata, options);
            client.broadcast.emit('r-postTopTracerShot', shotdata, options);
        });

        client.on('getDrawOrder', function(round) {
            console.log('getDrawOrder: round' + round);
            if (config.testmode != 1)
            {
                new sql.Request().query('select * from Tournament where status = 1', (err, result) => {
                    // ... error checks
                    tournID = result.recordset[0].TournamentID;
                    //console.dir(result.recordset[0].TournamentID);
                    new sql.Request().query('SELECT * from Leaderboard where TournamentID = ' + result.recordset[0].TournamentID + ' and Round = ' + round
                    + ' ORDER BY Match, orderInMatch', (err, result) => {
                        client.emit('r-getDrawOrder', result.recordset);
                        //vue/cli dont like above syntax 
                        client.emit('r_getDrawOrder', result.recordset);
                    }) 
                })
            }
        }); 

        client.on('getCurrentRoundDrawOrder', function() {
            if (config.testmode != 1)
            {
                new sql.Request().query('select * from Tournament where status = 1', (err, result) => {
                  if (result !== undefined) {
                    tournID = result.recordset[0].TournamentID;
                    //console.dir(result.recordset[0].TournamentID);
                    new sql.Request().query('SELECT * from Leaderboard where TournamentID = ' + result.recordset[0].TournamentID + ' and Round = ' + result.recordset[0].CurrentRound 
                    + ' ORDER BY Match, orderInMatch', (err, result) => {
                        golfDraw = result.recordset;
                        // console.log(golfDraw);
                    }) 
                  } else {
                      console.log('no tournaments found');
                  }
                })
            }
        }); 

        client.on('getProjectConfig', function() {
            client.emit('r-getProjectConfig', config);
        });

        client.on('changePlayer', function(player) {
            client.broadcast.emit('r-changePlayer', player);
        });

        routes.post("/webhook", (req, res) => {
            //const attributes = req.body.message;
            console.log('/webhook');
            // let reqText = req.body.queryResult.queryText;
            console.log('response: ' + JSON.stringify(req.body));
            // console.log('in app.js' + req.body);
            clientMessage = translateMessage(req.body.Body);
            if (clientMessage.action === 'reply') {
                twilio_client.messages.create({
                  from: 'whatsapp:+14155238886',
                  body: clientMessage.translatedMessage + ' y or n ?',
                  to: 'whatsapp:+447507467702'
                }).then(function(message) {
                  // When we get a response from Twilio, respond to the HTTP POST request
                  res.send('Message is inbound!');
                });
            } else if (clientMessage.action === 'display') {
              displayMessages.push(clientMessage.translatedMessage);
              client.broadcast.emit('r-translatedReply', clientMessage.translatedMessage);
            }
        });

        routes.post("/testwebhook", (req, res) => {
            //const attributes = req.body.message;
            console.log(req.body.message);
            // console.log('in app.js' + req.body);
            clientMessage = translateMessage(req.body.message);
            if (clientMessage.action === 'reply') {
                twilio_client.messages.create({
                  from: 'whatsapp:+14155238886',
                  body: clientMessage.translatedMessage + ' y or n ?',
                  to: 'whatsapp:+447507467702'
                }).then(function(message) {
                  // When we get a response from Twilio, respond to the HTTP POST request
                  res.send('Message is inbound!');
                });
            } else if (clientMessage.action === 'display') {
              displayMessages.push(clientMessage.translatedMessage);
              client.broadcast.emit('r-translatedReply', clientMessage.translatedMessage);
            }
          });

          function translateMessage(incoming) {
            let translate = '';
            let foundMatch = false;
            let foundPlayer = false;
            let foundHole = false;
            incoming = incoming.toLowerCase();
            if (incoming.includes('y') || incoming.includes('n') || incoming.includes('*')) { 
              clientMessage.message = incoming;
              clientMessage.action = 'display';
              return clientMessage;
            }
            if (incoming.includes('m')) {
              let place = incoming.split('m');
              if (translate !== '') {translate += ' '};
              clientMessage.match = extractNumber(place[1]);
              if (translate !== '') {translate += ' '};
              translate += 'match ' + clientMessage.match;
              clientMessage.action = 'reply';
              foundMatch = true;
            }
            if (incoming.includes('p')) {
              let place = incoming.split('p');
              if (translate !== '') {translate += ' '};
              clientMessage.pIndex = (extractNumber(place[1]) - 1);
              foundPlayer = findPlayer(clientMessage);
              if (translate !== '') {translate += ' '};
              translate +=  clientMessage.player[clientMessage.pIndex].playerRow.first.charAt(0) + '. ' + clientMessage.player[clientMessage.pIndex].playerRow.last; 
              // translate +=  'Lee' + '. ' + 'Westwood'; 
              foundPlayer = true;
              //  ******************************************
              clientMessage.action = 'reply';
            }
            if (incoming.includes('h')) {
              let place = incoming.split('h');
              if (translate !== '') {translate += ' '};
              clientMessage.player[clientMessage.pIndex].hole = extractNumber(place[1]);
              if (translate !== '') {translate += ' '};
              translate += 'hole ' + clientMessage.player[clientMessage.pIndex].hole;
              clientMessage.action = 'reply';
              foundHole = true;
            }
            if (incoming.includes('s')) {
              let place = incoming.split('s');
              if (translate !== '') {translate += ' '};
              clientMessage.player[clientMessage.pIndex].shot = extractNumber(place[1]);
              if (translate !== '') {translate += ' '};
              translate += 'shot ' + clientMessage.player[clientMessage.pIndex].shot;
              clientMessage.action = 'reply';
            }
            clientMessage.translatedMessage = '';
            if (!foundMatch) {
              clientMessage.translatedMessage = 'match ' + clientMessage.match + ': ';
            }
            if (!foundPlayer) {
              if (clientMessage.translatedMessage !== '') {clientMessage.translatedMessage += ' '};
              clientMessage.translatedMessage += clientMessage.player[clientMessage.pIndex].playerRow.first.charAt(0) + '. ' + clientMessage.player[clientMessage.pIndex].playerRow.last; 
              // clientMessage.translatedMessage += 'L' + '. ' + 'Westwood'; 
            }
            if (!foundHole) {
              if (clientMessage.translatedMessage !== '') {clientMessage.translatedMessage += ' '};
              clientMessage.translatedMessage += 'hole ' + clientMessage.player[clientMessage.pIndex].hole;
            }
        
            if (clientMessage.translatedMessage !== '') {clientMessage.translatedMessage += ' '};
            clientMessage.translatedMessage += translate;
            return clientMessage;
        }
        
        function findPlayer(clientMessage) {
            // console.log ('in findplayer:clientMessage'  + (JSON.stringify((clientMessage))));
            currentRnd = parseInt(golfDraw.event.tournament.currentround);
            for (i=0; i < golfDraw.event.players.player.length; i++) {
                playerelement = golfDraw.event.players.player[i];
                if (currentRnd === 1) {
                  var roundelement = golfDraw.event.players.player[i].round;
                } else {
                  var roundelement = golfDraw.event.players.player[i].round[currentRnd - 1];
                }
                
                var playerelement = golfDraw.event.players.player[i];
                if(parseInt(roundelement.matchnumber) === clientMessage.match && parseInt(roundelement.orderinmatch) === (clientMessage.pIndex + 1)) {
                   // console.log ('in findplayer:'  + golfDraw.length);
                    clientMessage.player[clientMessage.pIndex].roundRow = roundelement;
                    clientMessage.player[clientMessage.pIndex].playerRow = playerelement;
                    return true;
                }
            }
            return false;
        }
        
        function extractNumber(str) {
          rtnStr = '';
          for (i=0 ; i < str.length ; i++) {
            var res = str.charAt(i);
            if (isNumeric(res)) {
              rtnStr += res;
            } else {
              return parseInt(rtnStr);
            }
          }
          return parseInt(rtnStr);
        }
        
        function isNumeric(n) {
          return !isNaN(parseFloat(n)) && isFinite(n);
        }
        
}