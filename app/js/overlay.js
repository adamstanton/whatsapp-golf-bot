//import * as THREE from 'three';
//import { SpriteText2D, textAlign } from 'three-text2d';

const HOLE = 15;

const balls = [];
const balls3D = [];

// 3D and 2D start and end position coordinates
// TODO: these are map specific, there should be like an admin panel to pinpoin these or something and load up all the maps and their metadata, maybe from an embedded database for now
// these are noly the values applicable to hole 15. easiest way to record these for now is to open the dev server and click roughly at the start point and end point of the course on the map
// then open developer console and looking at the console.log outputs for the clicks, they will contain these necessary x, y and z values, as well as the 2D x and y values and they can be moved over here to the code
const first3D = { x: 988.379, y: 748.592, z: -2897.07 };
const last3D = { x: 965.598, y: -339.403, z: 1355 };

const first2D = { x: 166.109375, y: 469.5 };
const last2D = { x: 163.109375, y: 44.5 };

// Distance from start to end in both dimensionalities, this will be used to scale the estimated ball position from 2D to 3D space
const dst3D = pointDst(first3D, last3D);
const dst2D = pointDst(first2D, last2D);

// Distance from point p1 to point p2 in each dimension, results in object with e.g. { x: 1, y: -2 }. This is an absolute value for scaling
function pointDst(pnt1, pnt2) {
  return Object.keys(pnt1).reduce((acc, key) => {
    return Object.assign(acc, { [key]: Math.abs(pnt2[key] - pnt1[key]) });
  }, {});
}

// Axis difference from point p1 to point p2 in each dimension, results in object with e.g. { x: 1, y: -2 }
function dstTo(pnt1, pnt2) {
  return Object.keys(pnt1).reduce((acc, key) => {
    return Object.assign(acc, { [key]: pnt2[key] - pnt1[key] });
  }, {});
}

// This is responsible for drawing the minimap in the top-right corner to pick individual balls' positions in 2d
function drawMap(mapEl, ctx, mapWidth, mapHeight, data) {
  mapEl.addEventListener('mousedown', function(e) {
    var rect = mapEl.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    ctx.fillStyle = 'red';
    const rectSize = 10;

    // Draw rect as middle of rect in click psoition
    ctx.fillRect(
      x - (rectSize /2),
      y - (rectSize / 2),
      rectSize,
      rectSize
    );

    balls.push({
      x,
      y,
      name: window.prompt('Player name')
    });

    console.log('Updated ball positions', balls);
  });

  ctx.globalAlpha = 0.7;

  const imgEl = new window.Image(mapWidth, mapHeight);
  imgEl.src = `/hellacam/${HOLE}.png`;
  imgEl.addEventListener('load', () => {
    ctx.drawImage(imgEl, 0, 0, mapWidth, mapHeight);
   // drawTrace();
  });
}

// Used in old coordinate transformation logic
function normalize(value, min, max) {
  return Math.abs((value - min) / (max - min));
}

// Used in old coordinate transformation logic
function scaleTo(normalized, min, max) {
  return normalized * (Math.abs(max - min) + min);
}

function drawTrace(scene) {
   // var renderer = new THREE.WebGLRenderer();
   // renderer.setSize( window.innerWidth, window.innerHeight );
   // document.body.appendChild( renderer.domElement );

    //var camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 1, 500 );
    //camera.position.set( 0, 0, 100 );
    //camera.lookAt( 0, 0, 0 );

//    var scene = new THREE.Scene();

     const size = 0.03;
   // const geom = new THREE.BoxBufferGeometry(size,size,size);
    //const material = new THREE.MeshLambertMaterial({ color:0xffffff, wireframe:false, transparent:true });
   // const material = new THREE.LineBasicMaterial( { color: 0x0000ff , wireframe:false, transparent:false } );
   // const ball3d = new THREE.Mesh(geom, material);
   // scene.add(ball3d);

    // - - - - points
    geometry = new THREE.Geometry();
    material = new THREE.PointsMaterial( { size:size } );
    for (i1=1; i1<=10; i1+=1) {
      var x1 = Math.random()*2-1;
      var y1 = Math.random()*2-1;
      var z1 = Math.random()*2-1;
      geometry.vertices.push(new THREE.Vector3(x1,y1,z1));
    }
    object3d = new THREE.Points(geometry, material);
    scene.add(object3d);


    //var material = new THREE.LineBasicMaterial( { color: 0x0000ff , wireframe:false, transparent:true } );
    //var geometry = new THREE.Geometry();
    //const size = 50;
   // const geom = new THREE.SphereGeometry(size,size,size);
   // const material = new THREE.MeshLambertMaterial({ color:0xffffff, wireframe:false, transparent:true });
    //create a blue LineBasicMaterial
    //var material = new THREE.LineBasicMaterial( { color: 0x0000ff } );
   // const geometry = new THREE.Mesh(geom, material);
    //geometry.vertices.push(new THREE.Vector3( -10, 0, 0) );
   //geometry.vertices.push(new THREE.Vector3( 0, 10, 0) );
    //geometry.vertices.push(new THREE.Vector3( 100, 0, 0) );

    //var line = new THREE.Line( geometry, material );
    //scene.add( line );
    //balls3D.push(li1ne);

}

function createBalls(data, scene, position, orientation, mapWidth, mapHeight) {
  const xs = data.position.map(p => p.x);
  const ys = data.position.map(p => p.y);
  const zs = data.position.map(p => p.z);

  const minX = xs.reduce((min, x) => Math.min(min, x));
  const maxX = xs.reduce((max, x) => Math.max(max, x));
  const minY = ys.reduce((min, y) => Math.min(min, y));
  const maxY = ys.reduce((max, y) => Math.max(max, y));
  const minZ = zs.reduce((min, z) => Math.min(min, z));
  const maxZ = zs.reduce((max, z) => Math.max(max, z));

  for (const ball of balls) {
    const normalizedX = normalize(ball.x, 0, mapWidth);
    const normalizedY = normalize(ball.y, 0, mapHeight);

    const size = 50;
    const geom = new THREE.SphereGeometry(size,size,size);
    const material = new THREE.MeshLambertMaterial({ color:0xffffff, wireframe:false, transparent:true });
    const ball3d = new THREE.Mesh(geom, material);

    // old method
    // ball3d.position.x = scaleTo(normalizedX, minX, maxX);
    // ball3d.position.z = -scaleTo(normalizedY, minZ, maxZ);
    // ball3d.position.y = minY - 1500; // offset is determined via stetson-harrison method
    // "triangulation" based
    const dists = dstTo(ball, last2D);
    ball3d.position.x = last3D.x - ((dists.x / dst2D.x) * dst3D.x);
    ball3d.position.z = - last3D.z - ((dists.y / dst2D.y) * dst3D.z);
    ball3d.position.y = minY - 500; // offset is hand picked and very difficult to choose. I was not albe to make this work well

    console.log('original position', ball.x, ball.y, ball.z);
    console.log('transformed position', ball3d.position.x, ball3d.position.y, ball3d.position.z);

    scene.add(ball3d);
   // balls3D.push(ball3d);

   // const sprite = new SpriteText2D(ball.name, {
   //   align: textAlign.center,
   //   font: '40px Arial',
   //   fillStyle: '#000000',
   //   antialias: false
  //  });
   // sprite.position.x = ball3d.position.x;
  //  sprite.position.y = ball3d.position.y + 70 + 50;
  //  sprite.position.z = ball3d.position.z + 70 + 40 + 50; // ballsize + font size + offset
  //  sprite.scale.set(1.5, 1.5, 1.5);

  //  scene.add(sprite);
  }
}

function getVideoAndStart(data, scene, renderer, position, orientation, mapWidth, mapHeight) {
  const xhr = new XMLHttpRequest();
  xhr.open('GET', `/hellacam/${HOLE}.mp4`, true);
  xhr.responseType = 'blob';
  xhr.setRequestHeader('Content-Type', 'video/mp4');
  xhr.onprogress  = function(e) {
    document.querySelector('.percent').innerHTML = parseInt((e.loaded/e.total)*1000)/10 + '%';
    document.querySelector('.loaded').innerHTML = Math.round(e.loaded/100000)/10 + 'MB';
    document.querySelector('.total').innerHTML = Math.round(e.total/100000)/10 + 'MB';
  };
  xhr.onload = function(e) {
    if (this.status == 200) {
      const video = document.querySelector("video");
      const myBlob = this.response;
      const vid = URL.createObjectURL(myBlob);
      video.src = vid;
      document.querySelector('.loading').classList.add('hidden');
      document.querySelector('.play').addEventListener('click', () => {
      // createBalls(data, scene, position, orientation, mapWidth, mapHeight);
       drawTrace(scene);
        playAll(video, position, orientation);
       
      });
      document.querySelector('.play').classList.remove('hidden');
      requestAnimationFrame(renderer);
    }
  };
  xhr.send();
}

// fetch hole.json to get keyframes data
function getJSON(cb) {
  const xhr = new XMLHttpRequest();
  xhr.open('GET', `/hellacam/hole${HOLE}.json`, true);
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

function playAll(video, position, orientation) {
  document.querySelector(".play").classList.add("hidden");
  position.play();
  orientation.play();
  video.play();
}

// Coordinates render loop
function createRenderLoop(renderer, scene, camera) {
  return function render(a) {
    requestAnimationFrame(render);

    for (const ball of balls3D) {
       var distance = ball.position.distanceTo(camera.position);
       ball.material.opacity = Math.max(0,Math.min(1,1-(distance-2000)/2000));
    }

    renderer.render(scene, camera);
  };
}

// Creates "shadow videos" of keyframes data that we can play at the same as the actual video and get the positions at each actual rendered frame
// these basically change camera position based on every single actually animated frame and its relation to the frame in keyframes data in separate orientation and position timelines
function generateTimelines(camera, data){
  const position = new TimelineMax({ paused:true });
  const orientation = new TimelineMax({ paused:true, onComplete: () => {
    orientation.pause();
    position.pause();
    console.log('DONE');
  }});

  console.log('first pos', data.position[0]);
  console.log('last pos', data.position[data.position.length - 1]);
  position.set(camera.position, Object.assign(data.position[0], { ease: Linear.easeNone }));
  for (let i = 1; i < data.position.length; i++){
    const time = ((data.orientation[i].frame / data.header.unitsPerSecond) - (data.orientation[i-1].frame / data.header.unitsPerSecond));
    position.to(camera.position, time, {
      x: data.position[i].x,
      y:-data.position[i].y,
      z:-data.position[i].z,
      ease: Linear.easeNone
    });
  }

  let x = Math.abs(data.orientation[0].x*(Math.PI/180));
  let y = Math.abs(-data.orientation[0].y*(Math.PI/180));
  let z = Math.abs(-data.orientation[0].z*(Math.PI/180));
  if (x > Math.PI) x = (Math.PI*2) - x;
  if (y > Math.PI) y = (Math.PI*2) - y;

  orientation.set(camera.rotation, {
    x,
    y,
    z,
    ease: Linear.easeNone
  });

  for (let i = 1; i < data.orientation.length; i++) {
    const time = ((data.orientation[i].frame / data.header.unitsPerSecond) - (data.orientation[i-1].frame / data.header.unitsPerSecond));
    let x = Math.abs(data.orientation[i].x*(Math.PI/180));
    let y = Math.abs(-data.orientation[i].y*(Math.PI/180));
    let z = Math.abs(-data.orientation[i].z*(Math.PI/180));
    if(x > Math.PI){
      x = (Math.PI*2)-x;
    }
    if(y > Math.PI){
      y = (Math.PI*2)-y;
    }
    orientation.to(camera.rotation, time, {
      x,
      y,
      z,
      ease: Linear.easeNone
    });
  }

  return { position, orientation };
}

const height = window.innerHeight >= window.innerWidth ?
      window.innerHight :
      1080/(1920/window.innerWidth);

const width = window.innerWidth > window.innerHeight ?
      1920/(1080/window.innerHeight) :
      window.innerWidth;

const video = document.querySelector('video');
video.style.width = width + 'px';
video.style.height = height + 'px';

const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector('canvas#graphics'),
  alpha: true
});
renderer.setSize(width, height);

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(50, width/height, 0.1, 4000);
scene.add(camera);

scene.add(new THREE.AxesHelper(1000));

// hardcode lighting, this may help if you are successful at tweaking it more than I was
const directionalLight = new THREE.DirectionalLight(0xFFEFDA, 3);
directionalLight.position.set( 8060,4000,-20000 );
directionalLight.target = camera;
scene.add(directionalLight);

// same as above ^
const spotLight = new THREE.SpotLight(0xFFD5D2, 0.6, 50000);
spotLight.position.set(18000, 7000, -30000);
spotLight.target = camera;
scene.add(spotLight);

// same as above ^
const light = new THREE.HemisphereLight(0x9CA1AF, 0xAF8D7E, 0.8);
scene.add(light);

const mapEl = document.querySelector('canvas#map');
const mapCtx = mapEl.getContext('2d');
//drawTrace();

getJSON((data) => {
  //drawMap(mapEl, mapCtx, mapEl.width, mapEl.height, data);
  const { position, orientation } = generateTimelines(camera, data);
  const renderLoop = createRenderLoop(renderer, scene, camera);
  getVideoAndStart(data, scene, renderLoop, position, orientation, mapEl.width, mapEl.height);
  drawTrace(scene);
});
