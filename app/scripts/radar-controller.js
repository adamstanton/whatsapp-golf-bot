	var test_id = 32848;
	var shotdata = [];
	var out = angular.module('Output-App', [])
	out.controller('RadarController', [ '$scope', '$location', function($scope) {
	   var hostStr = '';
	   console.log('hostStr=' + hostStr);
		$scope.safeApply = function(fn) {
		  var phase = this.$root.$$phase;
		  if(phase == '$apply' || phase == '$digest') {
		    if(fn && (typeof(fn) === 'function')) {
		      fn();
		    }
		  } else {
		    this.$apply(fn);
		  }
		};
		$scope.isPolling = false;
		$scope.togglePolling = false;
		$scope.bayid = 0;
		$scope.shotdata = [];
		$scope.distanceCount = 0;
		var pollObject = [];
		var  isShotLive = false;
		var lastobj;
		var lastoptions;
		var senttoscreen = false;
		$scope.shotdata = [];
		$scope.shotdatatxt = '';
		$scope.showShotData = false;
		$scope.config = [];
		$scope.bays = [];
		$scope.posted_MSTID = 0;

		$scope.drawlist = [];
		$scope.selectedPlayer = [];
		$scope.selectedListPlayer = [];
		$scope.selectedRound = 0;
		$scope.allbays = false;
		$scope.myTextarea = '';
		var lastKph = 0;
		//$scope.io = io.connect('http://127.0.0.1:3000');
		$scope.io = io.connect();
		$scope.io.on('connect', function (data) {
			console.log('io connected');
			$scope.io.emit('getProjectConfig');

        	//$scope.findShots();
		});
		$scope.vaporio = io.connect();
		$scope.vaporio.on('connect', function (data) {
			// console.log('vaporio connected');
		});
		
		$scope.findLongPoll = function() {
				if ($scope.isPolling == true)
				{
					var pathStr = '';
					if (parseInt($scope.bayid) === 0 || $scope.allbays === true) {
						$scope.allbays = true;
						pathStr = 'poll?app_type=MST&bays_revision=1&device_id=MST&targets_revision=1' + '&num_shots=1';
					} else { 
						$scope.allbays = false;
						pathStr = 'poll?app_type=MST&bays_revision=1&device_id=MST&targets_revision=1&bay_id=' + $scope.bayid + '&num_shots=1'
					}
					var options = {
						playerid : $scope.selectedPlayer.MSTID,
						roundNo: $scope.selectedRound,
						bay_id: $scope.bayid,
						host:			hostStr,
						path: pathStr,
						optionid: 2
					};
					$scope.io.emit('getTopTracerAPI', options);
				}
		}; 

		$scope.pollForShots = function(obj) {
				//long polling 
				var pathstr = '';
				if ($scope.allbays === true) {
					pathstr = 'poll?app_type=MST&bays_revision=' + obj.bays_revision + '&device_id=MST&targets_revision=' + obj.targets_revision + '&num_shots=1';
				} else {
					pathstr = 'poll?app_type=MST&bays_revision=' + obj.bays_revision + '&device_id=MST&targets_revision=' + obj.targets_revision + ' &bay_id=' + $scope.bayid + '&num_shots=1';
				}
				if ($scope.config.pagination_min_id ==   true)
				{
					if (obj.shot_pagination.next_min_id == null)
					{

					}
					else
					{
						pathstr = pathstr + '&pagination_min_id=' + obj.shot_pagination.next_min_id;
					}
				}

				if ($scope.isPolling == true)
				{
					if ($scope.allbays === true) {
						$scope.bayid = obj.shots[0].bay_id;
					}
					var options = {
						playerid : $scope.selectedPlayer.MSTID,
						roundNo: $scope.selectedRound,
						bay_id: $scope.bayid,
						host:			hostStr,
						path: pathstr,
						optionid: 3
					};
					pollObject = obj;
					$scope.io.emit('getTopTracerAPI', options);
					$scope.shotdatatxt  =  $scope.shotdatatxt + JSON.stringify(obj);
					$scope.$apply();
				}
		}

		$scope.changePlayerList = function(mst_id) {
			for(var i=0; i<$scope.drawlist.length; i++)
			{
				if ($scope.drawlist[i].MSTID == mst_id)
				{
					$scope.selectedPlayer = $scope.drawlist[i];
					$scope.selectedListPlayer = i;
				//	$scope.drawlist = $scope.selectedPlayer;
				//	$scope.selectedListPlayer = $scope.drawlist[i];
				}
			}
			$scope.$apply();
		}

		$scope.findShot = function(mst_id, shotid) {
					//console.log ('playerid=' + $scope.selectedPlayer.MSTID)
					//test player
					//changePlayerList(41288);
					$scope.isPolling = true;
					var options = {
						playerid : $scope.selectedPlayer.MSTID,
						roundNo: $scope.selectedRound,
						bay_id: $scope.bayid,
						host:			hostStr,
						path: 'shot?app_type=MST&device_id=MST&shot_id=' + shotid + '&tournament_data=true',
						optionid: 4

					};
					timer = setTimeout(function ()  {
						//wait 2 sec then pull API again.
						if ($scope.isPolling == true)
						{
							$scope.io.emit('getTopTracerAPI', options);
						}
					}
					, 1000);		
		}; 

		$scope.selectPlayer = function(selectPlayer) {
			$scope.selectedPlayer = JSON.parse(selectPlayer);
			$scope.changePlayerList($scope.selectedPlayer.MSTID);
			$scope.$apply();
	//		$scope.io.emit('changePlayer', player);
		}
		$scope.io.on('r-changePlayer', function(obj) {
			//$scope.selectedPlayer = obj;
			//$scope.$apply();
		}); 	

		$scope.io.on('r-TopTracerAPI', function(obj, options) {
			if (options.optionid == 2)
			{
				//long polling 
				$scope.pollForShots(obj);
				//$scope.$apply();	

			}
			if (options.optionid == 3)
			{
				//senttoscreen = false;
				if (obj.shots.length > 0 )
				{
					var arrayLength = obj.shots.length;
					for (var i = 0; i < arrayLength; i++) {
						if (obj.shots[i].pagination_id == pollObject.shot_pagination.next_min_id || $scope.config.pagination_min_id == false) 
						{
							if ($scope.config.manual_poll == true)
							{
								$scope.isPolling = false;
							}
							//recieved live shot
							var x = 0;
						//	$scope.shotdata  =  $scope.shotdata + JSON.stringify(obj);
							$scope.findShot(obj.shots[i].mst_id, obj.shots[i].pagination_id);
							//wait for new show
							$scope.findLongPoll();
						}
						else
						{
							var y = 0;
							$scope.pollForShots(pollObject);
						}
						//Do something
					}
				}
				else
				{
					//no shots
					senttoscreen = false;
					var x = 0;
					$scope.pollForShots(pollObject);
				}
			}
			
			if (options.optionid == 4)
			{    //get shot data
				hasShot = true;
				options.postsql = false;
				options.playerid = 0;

				if (obj.tournament_data.mst_id > 0)
				{
						options.postsql = true;
						//$scope.selectedPlayer.MSTID = obj.tournament_data.mst_id;
						$scope.changePlayerList(obj.tournament_data.mst_id);
						options.playerid = obj.tournament_data.mst_id;
						$scope.$apply();
				}
				
				$scope.shotdatatxt  =  $scope.shotdatatxt + JSON.stringify(obj);
			//	if ($scope.posted_MSTID != $scope.selectedPlayer.MSTID)
			//	{
					$scope.io.emit('postTopTracerShot', obj, options);
					$scope.$apply();

					lastobj = obj;
					lastoptions = options;
			//	}

				//reset for next shot
				options.optionid = -1;
				$scope.posted_MSTID = $scope.selectedPlayer.MSTID ;
				if ($scope.config.manual_poll == true)
				{
					$scope.isPolling = false;
				}
				//$scope.findLongPoll();
			}

			});
			
			$scope.io.on('r-getDrawOrder', function(obj) {
				//console.log('drawOrder=' + obj);
				$scope.drawlist = obj;
				$scope.$apply();
			});

			$scope.io.on('r-postTopTracerShot', function(obj, options) {
				$scope.shotdata = obj;
				$scope.selectedPlayer.MSTID = options.playerid;
				$scope.changePlayerList($scope.selectedPlayer.MSTID);
				//make readable values
				$scope.shotdata.stats.ball_speed_mph = ($scope.shotdata.stats.ball_speed * 2.23694).toFixed(1);
				$scope.shotdata.stats.ball_speed_kph = ($scope.shotdata.stats.ball_speed * 3.6).toFixed(1);
				$scope.shotdata.stats.flat_carry_yds = ($scope.shotdata.stats.flat_carry * 1.09361).toFixed(1);
				$scope.shotdata.stats.height_ft = ($scope.shotdata.stats.height * 3.28084).toFixed(1);
				$scope.shotdata.stats.flight_time = $scope.shotdata.stats.hang_time * 1000;
				$scope.$apply();
				if (isShotLive == false && (parseInt($scope.shotdata.stats.ball_speed_kph) > 99))
				{
					startDistanceCount();
					if (senttoscreen == false && (parseInt($scope.shotdata.stats.ball_speed_kph) > 99)) {
						$scope.buildSpeedDisplay();
						$scope.driveVaporEngine('speeddisplay', 'speeddisplay', 'animate');
						senttoscreen = true;
					}
					lastKph = parseInt($scope.shotdata.stats.ball_speed_kph)
				}

			});

			startDistanceCount = function() {
				var distanceCount = 0;
				var timeCounter = 0;
				var distanceValue = parseFloat($scope.shotdata.stats.flat_carry_yds);
				isShotLive = true;
				$scope.$apply();
				myCounter = setInterval(
					function()
					{ 
						distanceCount = (distanceCount + 0.5);
						$scope.distanceCount = distanceCount.toFixed(0);
					//	$scope.distanceCount.
						timeCounter = timeCounter + 10;
						if ((timeCounter > $scope.shotdata.stats.flight_time) || (distanceCount > distanceValue ) )
						{
							clearInterval(myCounter);
							isShotLive = false;
							$scope.distanceCount = $scope.shotdata.stats.flat_carry_yds;
						}
						$scope.$apply();
					}, 10
				);
			}

			$scope.io.on('r-getProjectConfig', function(obj) {
				// console.log('getConfig=' + obj);
				$scope.config = obj;
				if ($scope.config.testmode == 1)
				{
					hostStr = $scope.config.toptracerurl;
				} 
				else
				{
					hostStr = 'http://' + $scope.config.toptracerip + ':' + $scope.config.toptracerport + '/';
				}	

				if ($scope.config.connect_vaporCG) {
					$scope.vaporio = io.connect($scope.config.vaporCG);
				}
				$scope.io.emit('getCurrentRoundDrawOrder');
				$scope.$apply();
			});

			
			$scope.io.on('r-translatedReply', function(reply) {
				console.log('reply:' + reply);
				$scope.myTextarea += reply + '\n';
				$scope.$apply();
			});

			// fetch hole.json to get keyframes data
			function getJSON(cb) {
				const xhr = new XMLHttpRequest();
				xhr.open('GET', `/holetestdata/hole8shotdata.json`, true);
				xhr.onload = function(e) {
				console.log('got', this.status);
					if (this.status == 200) {
					cb(JSON.parse(this.responseText));
					}
				};
				xhr.onerror = function(e) {
				console.log('error???', e);
				};
				xhr.send();
			
			}
			
			$scope.testShot = function() {
				var timerCounter = 0;
				senttoscreen = false;
				setTimeout(
					function()
					{ 
						isShotLive = false;
						timerCounter++;
					//	if (timerCounter > 10) {
						//	clearInterval(myTestCounter);
					//	}
					    if ($scope.selectedPlayer.MSTID == undefined) {
							var player = {
								selectedRound: $scope.selectedRound,
								bayid: $scope.bayid,
								MSTID: 0}
						} else {
							var player = $scope.selectedPlayer;
						}
						
						player.selectedRound = $scope.selectedRound;
						player.bayid = $scope.bayid;   
						getJSON((shotdata) => {
							var x = 8;
							var options = {
							//	playerid : 9486,
								playerid : player.MSTID,
								round: player.selectedRound,
								bay_id: player.bayid,
								host: hostStr,
								path: '',
								optionid: 4, 
								roundNo:player.selectedRound,
								postsql: true
							};
							$scope.changePlayerList(options.playerid);
							$scope.io.emit('postTopTracerShot', shotdata, options);
							// data = shotdata;
							$scope.$apply();
						});
				
					}, 500
				);

			}

			$scope.changeRound = function(selectedRound) {
				$scope.isPolling = false;
				$scope.io.emit('getDrawOrder', selectedRound);
				$scope.$apply();
			};

			getProjectConfig = function(selectdound) {
				$scope.io.emit('getProjectConfig');
			};

			$scope.buildSpeedDisplay = function() {
				var theGraphic = {
						graphic:"speeddisplay",
						type:"speeddisplay",
						action:"preview",
						data: {
							SPEED: '185',
							UNIT: 'KM/H',
							shotdata: $scope.shotdata
						},
						images: {},
						movies: {},
						properties: {}
				};
				// send preview to server
				$scope.vaporio.emit('grp.gfx-command', {
						hubChannel: 'HUB-A',
						gfxCommand: theGraphic
				});
		 }

		 $scope.buildLogo = function() {
			var theGraphic = {
					graphic:"logo",
					type:"logo",
					action:"preview",
					data: {},
					images: {},
					movies: {},
					properties: {}
			};
			// send preview to server
			$scope.vaporio.emit('grp.gfx-command', {
					hubChannel: 'HUB-A',
					gfxCommand: theGraphic
			});
	 }

			$scope.driveVaporEngine = function(GFX, type, action) {
				var vaporDesktop = true;

				// send animate to server
				if ( vaporDesktop == true )
				{
					$scope.vaporio.emit('grp.gfx-command', {
						hubChannel: 'HUB-A',
						gfxCommand: {
							action: action,
							graphic: GFX,
							type: type
						}
					});
				}
			}
		
	}]);


