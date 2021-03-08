
var signalR = require('signalr-client');
var client  = new signalR.client(
	//signalR service URL
	app.serverAddress + "/signalR",
	// array of hubs to be supported in the connection
	['leaderboardHub'],
  10,
  true
);

client.serviceHandlers.connected = function (connection) {
	/* connection: this is the connection raised from websocket */
	console.log("conn handled");
};

var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
			console.log('getTournamentData response:');
  	let tournament = JSON.parse(this.responseText)[0];

		//#### From the hub instance
		setTimeout(function() {
				(function sendMessage(tournament) {
						console.log("Client State Code: ", client.state.code);
						console.log("Client State Description: ", client.state.desc);
						console.log("==>> try to get hub");
						var hub = client.hub('leaderboardHub'); // Hub Name (case insensitive)

						// if not bound set the hub will be undefined
						if (!hub) {
								console.log("==>> hub not found. retry in 10 seconds");
								setTimeout(sendMessage, 10000);
								return;
						}
						console.log("==>> send message");
						hub.invoke(
						'getLeaderboard',
						tournament.TournamentID,
						tournament.CurrentRound
						);

				})(tournament);
		},1000);

    }
  };
  xhttp.open("GET",  app.serverAddress + "/home/getTournamentData", true);
  xhttp.send();



	client.on(
		'leaderboardHub',		// Hub Name (case insensitive)
		'updateLeaderboard',	// Method Name (case insensitive)
		function(name) { // Callback function with parameters matching call from hub
			console.log(JSON.parse(name));
			leaderboard = JSON.parse(name);
			app.leaderboard = leaderboard;
		});



	client.start();


		