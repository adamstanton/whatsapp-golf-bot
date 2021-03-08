const HOLE = 15;
curves = [];
const balls3D = [];
var data = {

};
var renderer, scene, camera,
	video = document.querySelector("video"),
	cubes = new THREE.Object3D(),
	ww = window.innerWidth,
	wh = window.innerHeight,
	width = height = 0;
function init(){

	if(ww > wh){
		height = wh;
		width = 1920/(1080/wh);
	}
	else{
		width = ww;
		height = 1080/(1920/ww);
	}
	width = 1920;
	height = 1080;
	video.style.width = width+"px";
	video.style.height = height+"px";

	renderer = new THREE.WebGLRenderer({canvas : document.querySelector("canvas"), alpha:true});
	renderer.setSize(width,height);

	scene = new THREE.Scene();

	//camera = new THREE.PerspectiveCamera(47.43, width/height, 0.1, 40000 );
	camera = new THREE.PerspectiveCamera(50, width/height, 0.1, 40000 );
	scene.add(camera);

   // initCurve(scene);
    const size = 10;
    const geom = new THREE.SphereGeometry(size,size,size);
    const material = new THREE.MeshLambertMaterial({ color:0xffffff, wireframe:false, transparent:true });
    const ball3d = new THREE.Mesh(geom, material);

    // old method
    // ball3d.position.x = scaleTo(normalizedX, minX, maxX);
    // ball3d.position.z = -scaleTo(normalizedY, minZ, maxZ);
    // ball3d.position.y = minY - 1500; // offset is determined via stetson-harrison method
    // "triangulation" based
	
	//tee
   // ball3d.position.x = 991.844;
   // ball3d.position.z =  825.07;
   // ball3d.position.y = -1665.48; // offset is hand picked and very difficult to choose. I was not albe to make this work well

 	//LEFT EDGE OF LEFT BUNKER
    ball3d.position.x = 1084.95;
    ball3d.position.z =  1595.62;
    ball3d.position.y = -500; // offset is hand picked and very difficult to choose. I was not albe to make this work well

	 	//LEFT EDGE OF LEFT BUNKER
   // ball3d.position.x = 500.95;
   // ball3d.position.z =  -595.62;
	// ball3d.position.y = 12267.2; // offset is hand picked and very difficult to choose. I was not albe to make this work well
	
    scene.add(ball3d);
    balls3D.push(ball3d);

	directionalLight = new THREE.DirectionalLight( 0xFFEFDA, 3 );
	directionalLight.position.set( 8060,4000,-20000 );
	directionalLight.target = camera;
	scene.add( directionalLight );

	var spotLight = new THREE.SpotLight( 0xFFD5D2, 0.6, 50000 );
	spotLight.position.set( 18000, 7000, -30000 );
	spotLight.target = camera;
	scene.add(spotLight)

	light = new THREE.HemisphereLight( 0x9CA1AF, 0xAF8D7E, 0.8);
	scene.add( light );

	//Create timeline
	generateTimelines();

	var xhr = new XMLHttpRequest();
  xhr.withCredentials = true;
	xhr.open('GET', `/hellacam/5_slab.mp4`, true);
	xhr.responseType = 'blob';
	xhr.onprogress  = function(e) {
		document.querySelector(".percent").innerHTML = parseInt((e.loaded/e.total)*1000)/10 + "%";
		document.querySelector(".loaded").innerHTML = Math.round(e.loaded/100000)/10 + "MB";
		document.querySelector(".total").innerHTML = Math.round(e.total/100000)/10 + "MB";
	}
	xhr.onload = function(e) {
		if (this.status == 200) {
			var myBlob = this.response;
			var vid = URL.createObjectURL(myBlob);
			video.src = vid;
			document.querySelector(".loading").classList.add("hidden");
      document.querySelector(".play").addEventListener("click", playAll);
			document.querySelector(".play").classList.remove("hidden");
         //   requestAnimationFrame(render);
             fps.start();
		}
	}
	xhr.send();
}

function playAll(){
  document.querySelector(".play").classList.add("hidden");
	position.play();
	orientationTL.play();
    video.play();
}

var position = new TimelineMax({
		paused:true,
		onComplete : function(){
			video.pause();
			video.currentTime=0;
			position.pause().time(0);
			orientationTL.pause().time(0);
			setTimeout(function(){
				playAll();
			}, 1000);
		}
	});
var orientationTL = new TimelineMax({paused:true});
function generateTimelines(){
   // data.header.unitsPerSecond = 25;
	position.set(camera.position,{
		x:data.position[0].x,
		y:-data.position[0].y,
		z:-data.position[0].z,
		ease: Linear.easeNone
	});
	for(var i=1;i<data.position.length-1;i++){
      //  const time = 0;
        const time = ((data.position[i].frame / data.header.unitsPerSecond) - (data.position[i-1].frame / data.header.unitsPerSecond));
     //  const time = 0.41;
        // const time = ((data.orientation[i].frame / data.header.unitsPerSecond) - (data.orientation[i-1].frame / data.header.unitsPerSecond));
		position.to(camera.position,time,{
			x:data.position[i+1].x,
			y:-data.position[i+1].y,
			z:-data.position[i+1].z,
			ease: Linear.easeNone
		});
	}

	var x = Math.abs(data.orientation.x*(Math.PI/180));
	var y = Math.abs(-data.orientation.y*(Math.PI/180));
	var z = Math.abs(-data.orientation.z*(Math.PI/180));
	if(x > Math.PI){x = (Math.PI*2)-x;}
	if(y > Math.PI){y = (Math.PI*2)-y;}
	orientationTL.set(camera.rotation,{
		x: x,
		y: y,
		z: z,
		ease: Linear.easeNone
	});
	for(var i=1;i<data.orientation.length-1;i++){
		const time = ((data.orientation[i].frame / data.header.unitsPerSecond) - (data.orientation[i-1].frame / data.header.unitsPerSecond));
        //const time = 0.41;
        let x = Math.abs(data.orientation[i].x*(Math.PI/180));
        let y = Math.abs(-data.orientation[i].y*(Math.PI/180));
        let z = Math.abs(-data.orientation[i].z*(Math.PI/180));
		if(x > Math.PI){
			x = (Math.PI*2)-x;
		}
		if(y > Math.PI){
			y = (Math.PI*2)-y;
		}
		orientationTL.to(camera.rotation,time,{
			x:x,
			y:y,
			z:z,
			ease: Linear.easeNone
		});
	}
}

function initCurve(scene) {
  //scene = new THREE.Scene();
  //camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 1, 10000);
 // camera.position.z = 500;
  //scene.add(camera);
  initTrail(scene);
  addCurve(scene);
  //renderer = new THREE.WebGLRenderer();
  //renderer.setSize(window.innerWidth, window.innerHeight);
  //document.body.appendChild(renderer.domElement);
}

function addCurve(scene) {
  testPoint = 0;
  curve = new THREE.CubicBezierCurve3(
    new THREE.Vector3( testPoint, 0, 0 ),
    new THREE.Vector3( -5, 150, 0 ),
    new THREE.Vector3( 20, 150, 0 ),
    new THREE.Vector3( 10, 0, 0 )
  );
  curveGeometry = new THREE.Geometry();
  curveGeometry.vertices = curve.getPoints( 50 );
  curveMaterial = new THREE.LineBasicMaterial( { linewidth: 50, color : 0xff0000 } );
  curveLine = new THREE.Line( curveGeometry, curveMaterial );
  scene.add(curveLine);

    // EDITED
  curves.push(curveLine); // Add curve to curves array
  curveLine.curve = curve; // Link curve object to this curveLine
}

function updateCurve() {
  testPoint ++;
  
  // EDITED
  for (var i = 0, l = curves.length; i < l; i++) {
    var curveLine = curves[i];
    
    // Update x value of v0 vector
    curveLine.curve.v0.x = testPoint;
    // Update vertices
    curveLine.geometry.vertices = curveLine.curve.getPoints( 50 ); 
    // Let's three.js know that vertices are changed
    curveLine.geometry.verticesNeedUpdate = true;
  }
}

initTrail = function (scene) {
                    boid = new Boid();
					boid.position.x = Math.random() * 400 - 200;
					boid.position.y = Math.random() * 400 - 200;
					boid.position.z = Math.random() * 400 - 200;
					boid.velocity.x = Math.random() * 2 - 1;
					boid.velocity.y = Math.random() * 2 - 1;
					boid.velocity.z = Math.random() * 2 - 1;
					boid.setAvoidWalls( true );
					boid.setWorldSize( 1000, 1000, 1000 );

					bird = new THREE.Mesh( new Bird(), new THREE.MeshBasicMaterial( { color: 0x0000ff, side: THREE.DoubleSide, lineWidth: 5000 } ) );
					//bird.phase = Math.floor( Math.random() * 62.83 );
					scene.add( boid );
};


var fps = new FpsCtrl(25, function(e) {
   // updateCurve(scene);
   	//	boid = boids[ i ];
    //    boid.run( boids );  
  //   for (const ball of balls3D) {
     
    //}
    
    render();
})

var render = function (a) {
	//requestAnimationFrame(render);

    for (const ball of balls3D) {
      var distance = ball.position.distanceTo(camera.position);
       ball.material.opacity = Math.max(0,Math.min(1,1-(distance-2000)/2000));
    }

	   renderer.render(scene, camera);
};


// fetch hole.json to get keyframes data
function getJSON(cb) {
  const xhr = new XMLHttpRequest();
  xhr.open('GET', `/hellacam/holecj5.json`, true);
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

getJSON((shotdata) => {
    var x = 8;
    data = shotdata;
    init();
    //data.Position.keyframes = holedata.position;
   // data.Orientation.keyframes = holedata.orientation;
  //drawMap(mapEl, mapCtx, mapEl.width, mapEl.height, data);
  //const { position, orientation } = generateTimelines(camera, data);
  //const renderLoop = createRenderLoop(renderer, scene, camera);
  //getVideoAndStart(data, scene, renderLoop, position, orientation, mapEl.width, mapEl.height);
});

function FpsCtrl(fps, callback) {

	var	delay = 1000 / fps,
		time = null,
		frame = -1,
		tref;

	function loop(timestamp) {
		if (time === null) time = timestamp;
		var seg = Math.floor((timestamp - time) / delay);
		if (seg > frame) {
			frame = seg;
			callback({
				time: timestamp,
				frame: frame
			})
		}
		tref = requestAnimationFrame(loop)
	}

	this.isPlaying = false;
	
	this.frameRate = function(newfps) {
		if (!arguments.length) return fps;
		fps = newfps;
		delay = 1000 / fps;
		frame = -1;
		time = null;
	};
	
	this.start = function() {
		if (!this.isPlaying) {
			this.isPlaying = true;
			tref = requestAnimationFrame(loop);
		}
	};
	
	this.pause = function() {
		if (this.isPlaying) {
			cancelAnimationFrame(tref);
			this.isPlaying = false;
			time = null;
			frame = -1;
		}
	};
}
