var hasShot = false;
var traceCount = 0;
var wayCounter = 1;
var scene = new THREE.Scene();

var SCREEN_WIDTH = window.innerWidth,
		SCREEN_HEIGHT = window.innerHeight,
		SCREEN_WIDTH_HALF = SCREEN_WIDTH  / 2,
		SCREEN_HEIGHT_HALF = SCREEN_HEIGHT / 2;

var camera, controls, renderer,
		birds, bird;

var boid, boids;

var resolution = new THREE.Vector2( window.innerWidth, window.innerHeight );


    var heightLimit = 20;
 
 
    var flyTime = 8000;
 
 
    var lineStyle = {
        color: 0xcc0000,
        linewidth: 2
	}

// Based on http://www.openprocessing.org/visuals/?visualID=6910

	var scene = new THREE.Scene();
	var camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 0.1, 10000 );

	var renderer = new THREE.WebGLRenderer( { antialias: true, alpha: true });
	renderer.setSize( window.innerWidth, window.innerHeight );
	renderer.setPixelRatio( window.devicePixelRatio );
//	document.body.appendChild( renderer.domElement );

//	camera = new THREE.PerspectiveCamera( 40, window.innerWidth / window.innerHeight, .1, 1000 );
	camera.position.set( 0, 0, 0 );
	var container = document.getElementById( 'container' );

//	renderer = new THREE.WebGLRenderer( { antialias: true, alpha: true });
//	renderer.setSize( window.innerWidth, window.innerHeight );
//	renderer.setPixelRatio( window.devicePixelRatio );
	container.appendChild( renderer.domElement );
	

function init(shotdata) {



	birds = [];
	boids = [];
	v = [];
	if (hasShot == true)
	{
		var aCurve = createFlyLine(shotdata, heightLimit, flyTime, lineStyle)
    	scene.add(aCurve)

		//var geometry = new THREE.Geometry();
	//	var heartShape = new THREE.Shape();
	//	for(var i=0;i<shotdata.datapoints.length-1;i++)
	//	{

			//heartShape.bezierCurveTo( shotdata.datapoints[i].x, -shotdata.datapoints[i].y, shotdata.datapoints[i].z);
	//		v[i] = new THREE.Vector3( shotdata.datapoints[i].x , -shotdata.datapoints[i].y , shotdata.datapoints[i].z * 100  );
			
	//	}
	//	var curve = new THREE.SplineCurve3(v);
	//	var points = curve.getPoints( 90 );
	//	var geometry = new THREE.BufferGeometry().setFromPoints( points );
	//curve.points( v );
	//var points = curve.getPoints( 90 );
	//var geometry = new THREE.BufferGeometry().setFromPoints( points );
	//var geometry = new THREE.ShapeGeometry(heartShape);
	///var geometry = new THREE.TubeGeometry().setFromPoints( points );
	//	var geometry = new THREE.Geometry();
	//	for( var j = 0; j < Math.PI; j += 2 * Math.PI / 100 ) {
	//		var v = new THREE.Vector3( Math.cos( j ), Math.sin( j ), 0 );
	//		geometry.vertices.push( v );
	//	}

	//	var material = new THREE.LineBasicMaterial( { color : 0xff0000 } );

		// Create the final object to add to the scene
	//	var splineObject = new THREE.Line( geometry, material );
	//	scene.add( splineObject );
		//var material = new MeshLineMaterial( {
		//	color: new THREE.Color( "rgb(2, 2, 255)" ),
		//	opacity: 1,
	    ///	resolution: resolution,
		//	sizeAttenuation: 1,
		//	lineWidth: 1,
		//	near: 1,
		//	far: 100000,
		//	depthTest: false,
		//	blending: THREE.AdditiveBlending,
		//	transparent: false,
		//	side: THREE.DoubleSide
		//});

	//	traceCount++;
	//	if (traceCount == 1)
	//	{
	//		material.color =  new THREE.Color( "rgb(2, 255, 2)" );
	//	}
	//	if (traceCount == 2)
	//	{
	//		material.color =  new THREE.Color( "rgb(255, 2, 2)" );
	//	}

	//	var material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
		//var line = new MeshLine();
		//line.setGeometry( geometry );
		//var mesh = new THREE.Mesh( line.geometry, material ); // this syntax could definitely be improved!
		//scene.add( mesh );
		//animate();

		//var geometry = new THREE.BoxGeometry( 1, 1, 1 );
		//var material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
		//var cube = new THREE.Mesh( geometry, material );
		//scene.add( cube );

		camera.position.x = 0;
		camera.position.y = 100;
		camera.position.z = 300;
		animate();
	
			
	}

	//controls = new THREE.OrbitControls( camera,  renderer.domElement  );
	//controls.enableDamping = true;
	//controls.dampingFactor = 0.25;
	//controls.enableZoom = false;

	//document.addEventListener( 'mousemove', onDocumentMouseMove, false );

	//window.addEventListener( 'resize', onWindowResize, false );
	//onWindowResize();

}
//
 function createFlyLine(shotdata, heightLimit, flyTime, lineStyle) {
      //  var middleCurvePositionX = (startPoint.x + endPoint.x) / 2
       // var middleCurvePositionY = heightLimit
       // var middleCurvePositionZ = (startPoint.z + endPoint.z) / 2
 		for(var i=0;i<shotdata.datapoints.length-1;i++)
		{

			//heartShape.bezierCurveTo( shotdata.datapoints[i].x, -shotdata.datapoints[i].y, shotdata.datapoints[i].z);
			v[i] = new THREE.Vector3( shotdata.datapoints[i].x , -shotdata.datapoints[i].y , shotdata.datapoints[i].z * 100  );
			
		}
        var curveData = new THREE.CatmullRomCurve3(v);
		
        var curveModelData = curveData.getPoints(90)
 
        var curveGeometry = new THREE.Geometry()
        curveGeometry.vertices = curveModelData.slice(0, 1)
        var curveMaterial = new THREE.LineBasicMaterial({color: lineStyle.color, linewidth: lineStyle.linewidth})
        var curve = new THREE.Line(curveGeometry, curveMaterial)
 	
		var coords = { x: 0, y: 0 }; // Start at (0, 0)
		//wayCounter = 1;
		var tween = new TWEEN.Tween(coords) // Create a new tween that modifies 'coords'.
        .to( shotdata.datapoints[89].x , -shotdata.datapoints[89].y , flyTime) // Move to (300, 200) in 1 second.
        .easing(TWEEN.Easing.Quadratic.Out) // Use an easing function to make the animation smooth.
        .onUpdate(tweenHandler)
        .start(); // Start the tween immediately.
 
        return curve
 
        function tweenHandler() {
            var endPointIndex = Math.ceil(wayCounter);
 
            var curvePartialData = new THREE.CatmullRomCurve3(v);
            curve.geometry.vertices = curvePartialData.getPoints(90);
			curve.geometry.verticesNeedUpdate = true;
        }
    }



function animate() {

	requestAnimationFrame( animate );
	TWEEN.update();
	wayCounter ++;
	//controls.update();

//	for ( var i = 0, il = birds.length; i < il; i++ ) {

//		if (hasShot == true)
//		{
//			boid = boids[ i ];
//			boid.run( boids );
//		}

	//	bird = birds[ i ];
	//	bird.position.copy( boids[ i ].position );

	//	color = bird.material.color;
//					color.r = color.g = color.b = ( 500 - bird.position.z ) / 1000;

	//	if (boid.trail_initialized)
	//		boid.trail_material.uniforms.color.value = color;

		//bird.rotation.y = Math.atan2( - boid.velocity.z, boid.velocity.x );
		//bird.rotation.z = Math.asin( boid.velocity.y / boid.velocity.length() );

			//bird.phase = ( bird.phase + ( Math.max( 0, bird.rotation.z ) + 0.1 )  ) % 62.83;
		//bird.geometry.vertices[ 5 ].y = bird.geometry.vertices[ 4 ].y = Math.sin( bird.phase ) * 5;
//	}

	render();
}

function render() {
	renderer.render( scene, camera );
}

