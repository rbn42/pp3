if (!Detector.webgl)
	Detector.addGetWebGLMessage();
if (screen.lockOrientation) {
	screen.lockOrientation("portrait");
	alert(1);
}
var scene = new THREE.Scene();
var renderer = new THREE.WebGLRenderer({
	antialias : true
});
//var clock = new THREE.Clock();
var container = document.getElementById('container');
// document.getElementById('container');

var stats;

var camera;

var mesh;
var ball, ballPointlight;
var ballcolor = 0xcccccc;

//var v3 = new THREE.Vector3();

//var mousePadPosition_fgawefwfawe = new THREE.Vector3(0, 0, 0);
var mousePadPositionDest_fasdfawefwae = vec2.fromValues(0, 0);

var boxZ = 1;
var boxX = boxZ / 15 * 10;
var boxY = boxZ / 15 * 6;

var box3dmjiafowejf = vec3.fromValues(boxX, boxY, boxZ);
//var padsize_fawijefiawefwe = boxY / 3;
var C_ballSize = .05 * boxY;
var padsize_fwaefaweffawijefiawefwe = vec2.fromValues(boxY *.2, boxY *.2);

var plane;
var materials;
var pads;
var padvs = [];
var padDestinations = [];
init();
render();
var updateInterval = 1 / 60;
setTimeout(__update, updateInterval);

launchIntoFullscreen(document.body);
function init() {

	onWindowResize();
	//	renderer.setSize(window.innerWidth, window.innerHeight);
	initObjects();
	var alpha = 55;
	camera = new THREE.PerspectiveCamera(alpha, boxX / boxY, boxY / 2 - 0.1, 10);
	camera.position.z = boxZ / 2 + boxY / 2 / Math.tan(alpha / 2 / 180 * Math.PI);

	initLights();

	stats = new Stats();
	stats.domElement.style.position = 'absolute';
	stats.domElement.style.top = '0px';

	container.appendChild(renderer.domElement);
	container.appendChild(stats.domElement);

	window.addEventListener('resize', onWindowResize, false);
	renderer.domElement.addEventListener('mousemove', onDocumentMouseMove, false);

	renderer.domElement.addEventListener('touchstart', onDocumentTouchMove, false);
	renderer.domElement.addEventListener('touchmove', onDocumentTouchMove, false);

}

function initMaterials() {
//	var imgTexture2 = THREE.ImageUtils.loadTexture("images/moon_1024.jpg");
//	imgTexture2.wrapS = imgTexture2.wrapT = THREE.RepeatWrapping;
//	imgTexture2.anisotropy = 16;

	var u = "images/moon_1024.jpg";
	var u = 'images/bw.png';
	var imgTexture = THREE.ImageUtils.loadTexture(u);
	imgTexture.repeat.set(4, 2);
	imgTexture.wrapS = imgTexture.wrapT = THREE.RepeatWrapping;
	imgTexture.anisotropy = 16;

	var shininess = 50, specular = 0xdddddd, bumpScale = 1, shading = THREE.SmoothShading;
	materials = [];

	materials.push(new THREE.MeshPhongMaterial({
		map : imgTexture,
		bumpMap : imgTexture,
		bumpScale : bumpScale,
		color : 0xffffff,
		ambient : 0xeeeeee,
		specular : specular,
		shininess : shininess,
		shading : shading
	}));

}

var crossLine;
function initObjects() {
	initMaterials();
	////////////////////////////////////////////////////////////////
	var ballmaterial = new THREE.MeshBasicMaterial({
		//	color : ballcolor
	});
	ballmaterial = materials[0];
	///////////////////////
	ball = new THREE.Mesh(new THREE.SphereGeometry(1, 32, 32), ballmaterial);
	ball.scale.multiplyScalar(C_ballSize);
	scene.add(ball);

	// SUPER SIMPLE GLOW EFFECT
	// use sprite because it appears the same from all angles
	var spriteMaterial = new THREE.SpriteMaterial({
		map : new THREE.ImageUtils.loadTexture('images/glow.png'),
		useScreenCoordinates : false,
		//alignment : THREE.SpriteAlignment.center,
		color : 0x777777,
		transparent : false,
		blending : THREE.AdditiveBlending
	});
	var sprite = new THREE.Sprite(spriteMaterial);
	sprite.scale.set(C_ballSize * 4, C_ballSize * 4, C_ballSize * 4);
	ball.add(sprite);
	// this centers the glow at the mesh

	var material = new THREE.MeshPhongMaterial({
		color : 0x666666
	});

	/////////////////////////////////////////////////////////////////
	pads = [];
	var padgeometry = new THREE.PlaneGeometry(1, 1);

	var padMaterial = new THREE.MeshBasicMaterial({
		color : 0x22eeee,
		transparent : true,
		opacity : 0.5
	});
	for ( i = 0; i < 2; i++) {
		pads[i] = new THREE.Mesh(padgeometry, padMaterial);
		scene.add(pads[i]);
		pads[i].scale.y = padsize_fwaefaweffawijefiawefwe[1];
		pads[i].scale.x = padsize_fwaefaweffawijefiawefwe[0];

		padvs[i] = new THREE.Vector3();
	}
	pads[0].position.z = -boxZ / 2;
	pads[1].position.z = boxZ / 2;
	// pads[1].scale.y = boxY;
	// pads[1].position.z =  boxZ / 2;
	/////////////////////////////////////////////////////////////////
	var geometry = new THREE.PlaneGeometry(1, 1);
	plane = [];
	for ( i = 0; i < 4; i++) {
		plane[i] = new THREE.Mesh(geometry, material);
		scene.add(plane[i]);
	}

	plane[0].scale.x = boxZ;
	plane[1].scale.x = boxZ;
	plane[2].scale.y = boxZ;
	plane[3].scale.y = boxZ;

	plane[0].scale.y = boxY;
	plane[1].scale.y = boxY;
	plane[2].scale.x = boxX;
	plane[3].scale.x = boxX;

	plane[0].position.x = -boxX / 2;
	plane[1].position.x = boxX / 2;
	plane[2].position.y = -boxY / 2;
	plane[3].position.y = boxY / 2;

	plane[0].rotation.y = Math.PI / 2;
	plane[1].rotation.y = Math.PI * 3 / 2;
	plane[2].rotation.x = Math.PI * 3 / 2;
	plane[3].rotation.x = Math.PI / 2;

	var linematerial = new THREE.LineBasicMaterial({
		color : 0x777777
	});
	var linegeometry = new THREE.Geometry();
	linegeometry.vertices.push(new THREE.Vector3(-10, 0, 0));
	linegeometry.vertices.push(new THREE.Vector3(0, 0, 0));
	linegeometry.vertices.push(new THREE.Vector3(10, 0, 0));
	linegeometry.vertices.push(new THREE.Vector3(0, 0, 0));
	linegeometry.vertices.push(new THREE.Vector3(0, -10, 0));
	linegeometry.vertices.push(new THREE.Vector3(0, 0, 0));
	linegeometry.vertices.push(new THREE.Vector3(0, 10, 0));
	linegeometry.vertices.push(new THREE.Vector3(0, 0, 0));

	crossLine = new THREE.Line(linegeometry, linematerial);
	scene.add(crossLine);

}

function initLights() {

	// LIGHTS

	//hemiLight = new THREE.HemisphereLight(0xffffff, 0xffffff, 0.6);
	//hemiLight.color.setHSL(0.6,0.6, 0.6);
	//	hemiLight.groundColor.setHSL(0.75, 0.75, 0.75);
	//	hemiLight.position.set(0, 500, 0);
	//scene.add(hemiLight);

	var light = new THREE.AmbientLight(0x888888);
	scene.add(light);

	var directionalLight = new THREE.DirectionalLight(0xffffff, 2);
	directionalLight.position.set(0, 0, 1);
	//scene.add(directionalLight);

	ballPointlight = new THREE.PointLight(ballcolor, .7, 100);
	ballPointlight.position.set(0, 0, 0);
	scene.add(ballPointlight);
}

function onWindowResize() {
	//camera.aspect = window.innerWidth / window.innerHeight;
	//camera.updateProjectionMatrix();
	var w = window.innerWidth;
	var h = window.innerHeight;
	w = 1280;
	h = 720;
	if (w > h * boxX / boxY)
		renderer.setSize(h * boxX / boxY, h);
	else
		renderer.setSize(w, w * boxY / boxX);
}

function aidest(pad) {
	vec2.copy(pad, ballPositionfawefawf); 
}

padDestinations[0] = [];
function ai() {
	//vec2.random(a)
	//padDestinations[0] = new Float32Array([ballPositionfawefawf[0], ballPositionfawefawf[1]]);
	aidest(padDestinations[0]);
	// ball.position;
	padDestinations[1] = mousePadPositionDest_fasdfawefwae;
	//mousePadPosition_fgawefwfawe;
}

function movePad_Dst(x, y) {
	x *= devicePixelRatio;
	y *= devicePixelRatio;
	//mousePadPosition_fgawefwfawe.x = boxX * (x / renderer.domElement.width - 1 / 2);
	//mousePadPosition_fgawefwfawe.y = boxY * (1 / 2 - y / renderer.domElement.height	 );
	mousePadPositionDest_fasdfawefwae[0] = box3dmjiafowejf[0] * (x / renderer.domElement.width - 1 / 2);
	mousePadPositionDest_fasdfawefwae[1] = box3dmjiafowejf[1] * (1 / 2 - y / renderer.domElement.height	 );
	// event.clientY /renderer.domElement.height  ;
}

function onDocumentMouseMove(event) {
	movePad_Dst(event.clientX, event.clientY);
	// event.clientY /renderer.domElement.height  ;
}

function onDocumentTouchMove(event) {
	if (event.touches.length == 1) {
		event.preventDefault();
		movePad_Dst(event.touches[0].clientX, event.touches[0].clientY);
	}
}

var ballSpeedfjawioejidjaqwdqawd = new THREE.Vector3(1 / 6, 1 / 7, 1 / 8);
var ballSpeedVectorj8g9awjefwae;
// = vec3.fromValues(1 / 6, 1 / 7, 1 / 8);
var ballPositionfawefawf = vec3.fromValues(0, 0, 0);

//var magnusv3x2fawevsefcafsdfa = vec3.fromValues(2, 2, 2);

var tmp_v3fawevsefasdcafsdfa = vec3.fromValues(0, 0, 0);
// var v3xzvvasdseffafewfafsdfa = vec3.fromValues(0, 0, 0);
// var v3asfvscsdefawefawefcafsdfa = vec3.fromValues(0, 0, 0);
function v_mul(v, n) {
	for ( i = 0; i < v.length; i++)
		v[i] *= n;
}

function v_add(v, n) {
	for ( i = 0; i < v.length; i++)
		v[i] += n;
}

var ballSpinVectorfawefweafaef;
// = vec3.fromValues(0.1, 0.3, .2);
var ballspeedLimitfjaiwoejfiweaf;
// = .2;
var padspeedlimitfawehsftageraef = 2;
var pad2peedlimitfawehsftafawefgeraef = .2;

function moveBallAlongPad() {
	ballPositionfawefawf[0] = pads[1].position.x;
	ballPositionfawefawf[1] = pads[1].position.y;
	ballPositionfawefawf[2] = pads[1].position.z - C_ballSize;

	ball.position.x = ballPositionfawefawf[0];
	ball.position.y = ballPositionfawefawf[1];
	ball.position.z = ballPositionfawefawf[2];

	ballPointlight.position.copy(ball.position);
	crossLine.position.copy(ball.position);
}

function waitingForStartup(delta) {
	movePads_jfiuwoaeofjawe(delta);
	//	moveBallAlongPad();
	ballPositionfawefawf[0] = 0;
	// pads[1].position.x;
	ballPositionfawefawf[1] = box3dmjiafowejf[1] / 2 - C_ballSize;
	ballPositionfawefawf[2] = 0;
	// pads[1].position.z - C_ballSize;

	ball.position.x = ballPositionfawefawf[0];
	ball.position.y = ballPositionfawefawf[1];
	ball.position.z = ballPositionfawefawf[2];

	ballPointlight.position.copy(ball.position);
	crossLine.position.copy(ball.position);
}

var tobeUpdateTime = 0;
var lastUpdateTime = Date.now();
function __update() {
	var temp = Date.now();
	tobeUpdateTime += temp - lastUpdateTime;
	lastUpdateTime = temp;
	while (tobeUpdateTime > updateInterval * 1000) {
		tobeUpdateTime -= updateInterval * 1000;
		update(updateInterval);
	}
	setTimeout(__update, updateInterval);
}

var STATE_START = 1;
var STATE_GAME = 2;
var STATE_END = 3;
var state = STATE_START;
var padPosition2_jgviufawefaorjfiojwf = vec3.fromValues(0, 0, -box3dmjiafowejf[2] / 2);
var padPosition1_jgasdfviuaorjfiojwf = vec3.fromValues(0, 0, box3dmjiafowejf[2] / 2);
var ballRotationfjw0oajwfioef = vec4.fromValues();
function update(intv) {
	ai();
	switch(state) {
	case STATE_START:
		waitingForStartup(intv);
		break;
	case STATE_GAME:
		physicfawefwaefawfeawf(intv);
		break;
	case STATE_END:
		gameEndState(intv);
		break;
	}
}

// var endcountfjawieofjiwae = 0;
function gameEndState(delta) {
	return; 
}

var C_magnusFactor = 30;
function magnus(delta) {
	vec3.cross(tmp_v3fawevsefasdcafsdfa, ballSpinVectorfawefweafaef, ballSpeedVectorj8g9awjefwae);
	v_mul(tmp_v3fawevsefasdcafsdfa, C_magnusFactor * C_ballSize * delta * ballSpinVectorfawefweafaef[3]);
	vec3.add(ballSpeedVectorj8g9awjefwae, tmp_v3fawevsefasdcafsdfa, ballSpeedVectorj8g9awjefwae);
	v_mul(ballSpeedVectorj8g9awjefwae, ballspeedLimitfjaiwoejfiweaf / vec3.length(ballSpeedVectorj8g9awjefwae));

}

var C_SPIN_DECAY_FACTOR = 1;
var C_BALL_SPEED_INCREASE = 0.03;
var C_PAD_SPEED_INCREASE = 0.001;
var C_FRICTION_FACTOR_WALL = .1;
var C_FRICTION_FACTOR_PAD = .6;
var C_FRICTION_FACTOR_SPECIAL = .6;
var C_SPIN_FACTOR = 3;
var C_PAD_TRACK_HISTROY_SIZE = .2;
function physicfawefwaefawfeawf(delta) {

	//decrease rate of spin
	ballSpinVectorfawefweafaef[3] *= Math.pow(Math.E, -C_SPIN_DECAY_FACTOR * delta);
	//increase rate of speed
	ballspeedLimitfjaiwoejfiweaf += C_BALL_SPEED_INCREASE * delta;
	padspeedlimitfawehsftageraef += C_PAD_SPEED_INCREASE * delta;

	//Magnus effect
	magnus(delta);
	//bounce

	//move test
	var tmp_ballposition_fhuawiefjaw = [];
	vec3.copy(tmp_ballposition_fhuawiefjaw, ballSpeedVectorj8g9awjefwae);
	v_mul(tmp_ballposition_fhuawiefjaw, delta);
	vec3.add(tmp_ballposition_fhuawiefjaw, ballPositionfawefawf, tmp_ballposition_fhuawiefjaw);

	for ( i = 0; i < 3; i++) {
		var tempv = 0;
		var tmp_frictionfactor = C_FRICTION_FACTOR_WALL;
		var tmp_padvector_fjhuawiehfaw = [0, 0, 0];
		if (tmp_ballposition_fhuawiefjaw[i] > box3dmjiafowejf[i] / 2 - C_ballSize) {
			if (i == 2) {
				if (!checkInPadfjawioejfawoief(padPosition1_jgasdfviuaorjfiojwf, ballPositionfawefawf, padsize_fwaefaweffawijefiawefwe))
					state = STATE_END;
				else {
					var tmp_frictionfactor = C_FRICTION_FACTOR_PAD;
					vec2.subtract(tmp_padvector_fjhuawiehfaw, padPosition1_jgasdfviuaorjfiojwf, pad2histroy_fgsergawjiowaejfiowaf);

				}
			}
			tempv = -1; 

		} else if (tmp_ballposition_fhuawiefjaw[i] < -box3dmjiafowejf[i] / 2 + C_ballSize) {
			if (i == 2) {
				if (!checkInPadfjawioejfawoief(padPosition2_jgviufawefaorjfiojwf, ballPositionfawefawf, padsize_fwaefaweffawijefiawefwe))
					state = STATE_END;
				else {
					var tmp_frictionfactor = C_FRICTION_FACTOR_PAD;
					vec2.subtract(tmp_padvector_fjhuawiehfaw, padPosition2_jgviufawefaorjfiojwf, pad1histroy_fjiowaejfiowaf);

				}
			}
			tempv = 1; 
		}
		if (tempv) { 

			var tmp_normalBounce_fjawiefjiwoeaf = [0, 0, 0];
			tmp_normalBounce_fjawiefjiwoeaf[i] = tempv;

			var tmp_speedSpin_fjiawoejfiowajefwaf = [0, 0, 0];
			//vec3.cross(tmp_speedSpin_fjiawoejfiowajefwaf, ballSpinVectorfawefweafaef, tmp_normalBounce_fjawiefjiwoeaf);
			//v_mul(tmp_speedSpin_fjiawoejfiowajefwaf, C_ballSize * ballSpinVectorfawefweafaef[3]);

			var tmp_normalSpeed = vec3.dot(ballSpeedVectorj8g9awjefwae, tmp_normalBounce_fjawiefjiwoeaf);
			var tmp_normalSpeedvector_fhuwiaehfwe = [];
			vec3.copy(tmp_normalSpeedvector_fhuwiaehfwe, tmp_normalBounce_fjawiefjiwoeaf);
			v_mul(tmp_normalSpeedvector_fhuwiaehfwe, tmp_normalSpeed);

			v_mul(tmp_padvector_fjhuawiehfaw, 1 / C_PAD_TRACK_HISTROY_SIZE);

			var tmp_tangentSpeed_fhuiawef = [];
			vec3.subtract(tmp_tangentSpeed_fhuiawef, ballSpeedVectorj8g9awjefwae, tmp_normalSpeedvector_fhuwiaehfwe);

			var tmp_friction_fjiawoejfiawoef = [];
			vec3.add(tmp_friction_fjiawoejfiawoef, tmp_tangentSpeed_fhuiawef, tmp_speedSpin_fjiawoejfiowajefwaf);
			vec3.subtract(tmp_friction_fjiawoejfiawoef, tmp_friction_fjiawoejfiawoef, tmp_padvector_fjhuawiehfaw);
			v_mul(tmp_friction_fjiawoejfiawoef, tmp_frictionfactor * tmp_normalSpeed);

			//vec3.add(ballSpinVectorfawefweafaef,ballSpinVectorfawefweafaef,tmp_speedSpin_fjiawoejfiowajefwaf);

			//	vec3.add(tmp_normalBounce_fjawiefjiwoeaf, tmp_normalBounce_fjawiefjiwoeaf, tmp_speedSpin_fjiawoejfiowajefwaf);
			//v_mul(tmp_normalBounce_fjawiefjiwoeaf,1);
			vec3.subtract(ballSpeedVectorj8g9awjefwae, ballSpeedVectorj8g9awjefwae, tmp_normalSpeedvector_fhuwiaehfwe);
			vec3.subtract(ballSpeedVectorj8g9awjefwae, ballSpeedVectorj8g9awjefwae, tmp_normalSpeedvector_fhuwiaehfwe);
			vec3.add(ballSpeedVectorj8g9awjefwae, ballSpeedVectorj8g9awjefwae, tmp_friction_fjiawoejfiawoef);

			var tmp_deltaSpinVector_fawefawef = [];
			vec3.cross(tmp_deltaSpinVector_fawefawef, tmp_friction_fjiawoejfiawoef, tmp_normalBounce_fjawiefjiwoeaf);
			v_mul(tmp_deltaSpinVector_fawefawef, C_SPIN_FACTOR);

			var tmp_SpinVector_fewafew = [];
			vec3.copy(tmp_SpinVector_fewafew, ballSpinVectorfawefweafaef);
			v_mul(tmp_SpinVector_fewafew, ballSpinVectorfawefweafaef[3]);
			vec3.add(tmp_SpinVector_fewafew, tmp_SpinVector_fewafew, tmp_deltaSpinVector_fawefawef);
			ballSpinVectorfawefweafaef[3] = vec3.length(tmp_SpinVector_fewafew);
			vec3.normalize(ballSpinVectorfawefweafaef, tmp_SpinVector_fewafew);

			v_mul(ballSpeedVectorj8g9awjefwae, ballspeedLimitfjaiwoejfiweaf / vec3.length(ballSpeedVectorj8g9awjefwae));

		}
	}
	//move
	vec3.copy(tmp_v3fawevsefasdcafsdfa, ballSpeedVectorj8g9awjefwae);
	v_mul(tmp_v3fawevsefasdcafsdfa, delta);
	vec3.add(ballPositionfawefawf, ballPositionfawefawf, tmp_v3fawevsefasdcafsdfa);

	//vec3.transformQuat(ballRotationfjw0oajwfioef, ballRotationfjw0oajwfioef, ballSpinVectorfawefweafaef) ;
	var out = [];
	//var t1 = [];
	//vec3.normalize(t1, ballSpinVectorfawefweafaef);

	quat.setAxisAngle(out, ballSpinVectorfawefweafaef, ballSpinVectorfawefweafaef[3]);
	quat.multiply(ballRotationfjw0oajwfioef, ballRotationfjw0oajwfioef, out);
	var quaternion = new THREE.Quaternion();
	quaternion.set(ballRotationfjw0oajwfioef[0], ballRotationfjw0oajwfioef[1], ballRotationfjw0oajwfioef[2], ballRotationfjw0oajwfioef[3]);
	ball.rotation.setFromQuaternion(quaternion);

	ball.position.x = ballPositionfawefawf[0];
	ball.position.y = ballPositionfawefawf[1];
	ball.position.z = ballPositionfawefawf[2];

	ballPointlight.position.copy(ball.position);
	crossLine.position.copy(ball.position);
	// ball.rotation.x += delta;
	// ball.rotation.y += delta / 2;
	// ball.rotation.x = ballRotationfjw0oajwfioef[0];
	// ball.rotation.y = ballRotationfjw0oajwfioef[1];
	// ball.rotation.z = ballRotationfjw0oajwfioef[2];
	movePads_jfiuwoaeofjawe(delta);
}

function movePad_fjiaowejfwaf(pad, dest, delta, padMoveHistroy, speedlimit) {
	if (padMoveHistroy.length > 2 * C_PAD_TRACK_HISTROY_SIZE / updateInterval) {
		padMoveHistroy.shift();
		padMoveHistroy.shift();
	}
	for (var i = 0; i < 2; i++)
		padMoveHistroy.push(pad[i]);
	var speedv = tmp_v3fawevsefasdcafsdfa;

	vec2.sub(speedv, dest, pad);
	var ds = speedlimit * delta / vec2.length(speedv);
	if (ds > 1)
		ds = 1;
	v_mul(speedv, ds);
	vec2.add(pad, pad, speedv);
	for (var i = 0; i < 2; i++) {
		var lx = box3dmjiafowejf[i] / 2 - padsize_fwaefaweffawijefiawefwe[i] / 2;
		pad[i] = pad[i] > lx ? lx : pad[i];
		pad[i] = pad[i] < -lx ? -lx : pad[i];
	}
}

function checkInPadfjawioejfawoief(pad, ball, padsize) {
	for (var i = 0; i < 2; i++) {
		if (pad[i] + padsize[i] < ball[i])
			return false;
		if (pad[i] - padsize[i] > ball[i])
			return false;
	}
	return true;
}

var pad1histroy_fjiowaejfiowaf = [];
var pad2histroy_fgsergawjiowaejfiowaf = [];
function movePads_jfiuwoaeofjawe(delta) {
	//////////////////////////////////
	movePad_fjiaowejfwaf(padPosition2_jgviufawefaorjfiojwf, padDestinations[0], delta, pad1histroy_fjiowaejfiowaf, pad2peedlimitfawehsftafawefgeraef);
	movePad_fjiaowejfwaf(padPosition1_jgasdfviuaorjfiojwf, padDestinations[1], delta, pad2histroy_fgsergawjiowaejfiowaf, padspeedlimitfawehsftageraef);
	pads[0].position.x = padPosition2_jgviufawefaorjfiojwf[0];
	pads[0].position.y = padPosition2_jgviufawefaorjfiojwf[1];
	pads[1].position.x = padPosition1_jgasdfviuaorjfiojwf[0];
	pads[1].position.y = padPosition1_jgasdfviuaorjfiojwf[1];

}
 
function initGame() {
	ballspeedLimitfjaiwoejfiweaf = .7;
	//	ballSpeedVectorj8g9awjefwae = vec3.fromValues(0, 0, ballspeedLimitfjaiwoejfiweaf);

	//ballPositionfawefawf[2] = pads[1].position.z - C_ballSize*2; 
	ballSpinVectorfawefweafaef = vec4.fromValues(1, 0, 0, 0.0);
	//ballSpinVectorfawefweafaef = vec3.fromValues(0, 0, 0);
	ballRotationfjw0oajwfioef = quat.fromValues();
	quat.identity(ballRotationfjw0oajwfioef);

	ballSpeedVectorj8g9awjefwae = [];
	vec3.subtract(ballSpeedVectorj8g9awjefwae, padPosition1_jgasdfviuaorjfiojwf, ballPositionfawefawf);
	v_mul(ballSpeedVectorj8g9awjefwae, ballspeedLimitfjaiwoejfiweaf / vec3.length(ballSpeedVectorj8g9awjefwae));
	// debugger
	//	pad1histroy_fjiowaejfiowaf = [0,0];
	//	pad2histroy_fgsergawjiowaejfiowaf = [0,0];

}

function onCanvasClick() {
	switch(state) {
	case STATE_START:
		console.log("start");
		initGame();
		state = STATE_GAME;
		break;
	case STATE_END:
		state = STATE_START;
		break;
	}
}


$("canvas").click(onCanvasClick);
ballSpeedVectorj8g9awjefwae = [1, 1, 1, 1];
function render() {
	requestAnimationFrame(render);
	renderer.render(scene, camera);
	stats.update();
	switch(state) {
	case STATE_START:
		break;
	case STATE_GAME:
		var s = "hsuiaaaaaaaaaaaaaaaaaaaaaaauh,ballSpeed:\\{0\\},\tballSpeedVector{1},ballSpinVector:{2}";
		s = s.format(ballspeedLimitfjaiwoejfiweaf, 
			ballSpeedVectorj8g9awjefwae?vec3.str(ballSpeedVectorj8g9awjefwae):0, 
			ballSpinVectorfawefweafaef?vec4.str(ballSpinVectorfawefweafaef):0);

		$("#console").text(s);
		break;
	case STATE_END:
		break;
	}
}

//render();
function launchIntoFullscreen(element) {
	if (element.requestFullscreen) {
		element.requestFullscreen();
	} else if (element.mozRequestFullScreen) {
		element.mozRequestFullScreen();
	} else if (element.webkitRequestFullscreen) {
		element.webkitRequestFullscreen();
	} else if (element.msRequestFullscreen) {
		element.msRequestFullscreen();
	}
}

