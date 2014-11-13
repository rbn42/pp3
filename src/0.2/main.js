"use strict";
var canvas, gl;
var shader_main, shader_plain, shader_plain_texture;
var frameCounter;
//var unimap,attrmap;
var eyePosition;
var worldMatrix, normalMatrix, viewMatrix, projectMatrix, viewNormalMatrix;
var updateInterval;
var gridplanes;
var spiritTextureWall, spiritTextureBall;
var boxSize = vec3.fromValues(11, 7, 15);
var obj_ball;
var obj_pad1, obj_pad2;
var mousePosition;
init();
//setTimeout(update, 1000 / 60);
__update();
animate();

function initBall() {
	obj_ball = gl_object();
	obj_ball.mesh = MESH_SPHERE;
	obj_ball.size = .03 * boxSize[1] / boxSize[2];
	obj_ball.rotation=null;// vec4.fromValues();
	 obj_ball.quaternion= quat.create();
	//obj_ball.rotationMatrix=mat4.create() ;
	for (var i = 0; i < 3; i++)
		obj_ball.scale[i] = obj_ball.size / 75;
	return obj_ball;
}

function initPad(position) {
	var obj_Pad = gl_object(position);
	obj_Pad.mesh = MESH_PLANE;
	obj_Pad.size = [.23 * boxSize[1] / boxSize[2], .23 * boxSize[1] / boxSize[2]];
	for (var i = 0; i < 2; i++)
		obj_Pad.scale[i] = obj_Pad.size[i] / 100 / 2;
	obj_Pad.destination = vec2.fromValues();
	obj_Pad.trackHistroy = [];
	return obj_Pad;
}

function setWNMatrix(gl, obj) {
	// Make a worldMatrix
	mat4.identity(worldMatrix);
	mat4.translate(worldMatrix, worldMatrix, obj.position);
	if (obj.rotation) {
		mat4.rotateX(worldMatrix, worldMatrix, obj.rotation[0]);
		mat4.rotateY(worldMatrix, worldMatrix, obj.rotation[1]);
		mat4.rotateZ(worldMatrix, worldMatrix, obj.rotation[2]);
	}
	if (obj.quaternion) {
		var temp=mat4.create() ; 
		mat4.fromQuat(temp,obj.quaternion);
		mat4.multiply(worldMatrix,worldMatrix,temp); 
	}
	mat4.scale(worldMatrix, worldMatrix, obj.scale);
	// Make a normalMatrix
	mat3.normalFromMat4(normalMatrix, worldMatrix);
}

function setCameraMatrix() {
	var fovy = 80 / 180 * Math.PI;
	var dist = boxSize[1] / boxSize[2] / 2 / Math.tan(fovy / 2);
	eyePosition = [0, 0, 1 / 2 + dist];
	// Make a viewMatrix
	mat4.lookAt(viewMatrix, eyePosition, [0, 0, 0], [0, -1, 0]);
	// Make a normalMatrix
	mat3.normalFromMat4(viewNormalMatrix, viewMatrix);
	// Make a projectMatrix
	mat4.perspective(projectMatrix, fovy, boxSize[0] / boxSize[1], dist - 0.001, dist + 1.001);
}

function setGridPlanes() {
	var edgewidth = .01;
	var x = boxSize[0] / boxSize[2];
	var y = boxSize[1] / boxSize[2];
	gridplanes[0] = obj_gridplane([boxSize[2], boxSize[1]], edgewidth);
	gridplanes[1] = obj_gridplane([boxSize[2], boxSize[1]], edgewidth);
	gridplanes[2] = obj_gridplane([boxSize[0], boxSize[2]], edgewidth);
	gridplanes[3] = obj_gridplane([boxSize[0], boxSize[2]], edgewidth);

	gridplanes[0].scale = [1, y, 1];
	gridplanes[1].scale = [1, y, 1];
	gridplanes[2].scale = [x, 1, 1];
	gridplanes[3].scale = [x, 1, 1];

	gridplanes[0].position = [-x / 2, 0, 0];
	gridplanes[1].position = [x / 2, 0, 0];
	gridplanes[2].position = [0, -y / 2, 0];
	gridplanes[3].position = [0, y / 2, 0];

	gridplanes[0].rotation = [Math.PI / 2, [0, 1, 0]];
	gridplanes[1].rotation = [Math.PI * 3 / 2, [0, 1, 0]];
	gridplanes[2].rotation = [Math.PI * 3 / 2, [1, 0, 0]];
	gridplanes[3].rotation = [Math.PI / 2, [1, 0, 0]];

	for (var i = 0; i < gridplanes.length; i++) {
		var obj = gridplanes[i];
		// Set up all the vertex attributes for vertices, normals and texCoords
		mesh_init(gl, obj.mesh, shader_main.attrmap);
		obj.worldMatrix = new Float32Array(16);
		obj.normalMatrix = new Float32Array(9);

		// Make a worldMatrix
		mat4.identity(obj.worldMatrix);
		mat4.translate(obj.worldMatrix, obj.worldMatrix, obj.position);
		mat4.rotate(obj.worldMatrix, obj.worldMatrix, obj.rotation[0], obj.rotation[1]);
		mat4.scale(obj.worldMatrix, obj.worldMatrix, obj.scale);
		// Make a normalMatrix
		mat3.normalFromMat4(obj.normalMatrix, obj.worldMatrix);
	}

}

function setObjectMatrix(position, rotaion, scale) {
	return;
}

function initShader(gl, src) {
	var vertexShaderSrc = src[0];
	// document.getElementById('vshader').textContent;
	var fragmentShaderSrc = src[1];
	// document.getElementById('fshader').textContent;
	var program = gl_build(gl, vertexShaderSrc, fragmentShaderSrc);
	var unimap = gl_uniformLocations(gl, program);
	var attrmap = gl_attributeLocations(gl, program);
	return {
		program : program,
		unimap : unimap,
		attrmap : attrmap
	};
}

function init() {
	worldMatrix = new Float32Array(16);
	normalMatrix = new Float32Array(9);
	viewMatrix = new Float32Array(16);
	projectMatrix = new Float32Array(16);
	viewNormalMatrix = new Float32Array(9);
	updateInterval = 1 / 200;
	frameCounter = [];
	gridplanes = [null, null, null, null];
	for (var i = 0; i < 120; i++)
		frameCounter.push(0);

	canvas = document.getElementById('my_canvas');
	gl = getGL(canvas);
	//gl.clearColor(0.0, 0.0, 1.0, 1.0);

	shader_main = initShader(gl, glsl_main);
	shader_plain = initShader(gl, glsl_plain);
	shader_plain_texture = initShader(gl, glsl_plain_texture);

	gl.enableVertexAttribArray(shader_main.attrmap["a_normal"]);
	gl.enableVertexAttribArray(shader_main.attrmap["a_position"]);
	gl.enableVertexAttribArray(shader_main.attrmap["a_texCoord"]);
	gl.enableVertexAttribArray(shader_plain.attrmap["a_position"]);
	gl.enableVertexAttribArray(shader_plain_texture.attrmap["a_position"]);
	gl.enableVertexAttribArray(shader_plain_texture.attrmap["a_texCoord"]);
	//gl.enableVertexAttribArray(shader_plain.attrmap["a_normal"]);
	//gl.enableVertexAttribArray(shader_plain.attrmap["a_texCoord"]);
	spiritTextureWall = loadImageTexture(gl, "spirit.png");
	spiritTextureBall = loadImageTexture(gl, "ball.png");
	//gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
	//	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);

	setCameraMatrix();
	setGridPlanes();
	mesh_init(gl, MESH_SPHERE);
	mesh_init(gl, MESH_PLANE);
	initBall();
	obj_pad1 = initPad(vec3.fromValues(0, 0, 1 / 2));
	obj_pad2 = initPad(vec3.fromValues(0, 0, -1 / 2));
	obj_pad1.speed = 4;
	obj_pad2.speed = .4;
	gl.useProgram(shader_main.program);
	gl.uniform1f(shader_main.unimap["u_lightSource0Strenth"], 1 / 400);
	gl.uniform3fv(shader_main.unimap["u_eyePosition"], eyePosition);

	mousePosition = initMouseBind(canvas);

}

function draw() {
	// Clear the canvas
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
	gl.useProgram(shader_main.program);
	gl.uniform3fv(shader_main.unimap["u_lightSource0"], obj_ball.position);
	gl.uniformMatrix4fv(shader_main.unimap["u_projectMatrix"], gl.FALSE, projectMatrix);
	gl.uniformMatrix4fv(shader_main.unimap["u_viewMatrix"], gl.FALSE, viewMatrix);
	gl.uniformMatrix3fv(shader_main.unimap["u_viewNormalMatrix"], gl.FALSE, viewNormalMatrix);

	var a4 = vec4.fromValues();
	var b4 = vec4.fromValues();
	var a3 = vec3.fromValues();
	var b3 = vec3.fromValues();

	vec4.copy(a4, obj_pad1.position);
	a4[3] = 1;
	vec4.transformMat4(b4, a4, viewMatrix);
	for (var i = 0; i < 3; i++)
		a3[i] = b4[i] / b4[3];
	gl.uniform3fv(shader_main.unimap["u_arealight1ViewPosition"], a3);
	vec4.copy(a4, obj_pad2.position);
	a4[3] = 1;
	vec4.transformMat4(b4, a4, viewMatrix);
	for (var i = 0; i < 3; i++)
		a3[i] = b4[i] / b4[3];
	gl.uniform3fv(shader_main.unimap["u_arealight2ViewPosition"], a3);

	vec3.transformMat3(a3, [0, 0, -1], viewNormalMatrix);
	vec3.normalize(b3, a3);
	gl.uniform3fv(shader_main.unimap["u_arealight1ViewNormal"], b3);
	vec3.transformMat3(a3, [0, 0, 1], viewNormalMatrix);
	vec3.normalize(b3, a3);
	gl.uniform3fv(shader_main.unimap["u_arealight2ViewNormal"], b3);

	vec3.transformMat3(a3, [-1, 0, 0], viewNormalMatrix);
	vec3.normalize(b3, a3);
	gl.uniform3fv(shader_main.unimap["u_arealight1ViewRight"], b3);
	vec3.transformMat3(a3, [1, 0, 0], viewNormalMatrix);
	vec3.normalize(b3, a3);
	gl.uniform3fv(shader_main.unimap["u_arealight2ViewRight"], b3);

	vec3.transformMat3(a3, [0, 1, 0], viewNormalMatrix);
	vec3.normalize(b3, a3);
	gl.uniform3fv(shader_main.unimap["u_arealight1ViewUp"], b3);
	vec3.transformMat3(a3, [0, 1, 0], viewNormalMatrix);
	vec3.normalize(b3, a3);
	gl.uniform3fv(shader_main.unimap["u_arealight2ViewUp"], b3);

	gl.uniform1f(shader_main.unimap["u_arealight1Width"], obj_pad1.size[0]);
	gl.uniform1f(shader_main.unimap["u_arealight1Height"], obj_pad1.size[1]);
	gl.uniform1f(shader_main.unimap["u_arealight1Shininess"], 4400);
	gl.uniform1f(shader_main.unimap["u_arealight2Width"], obj_pad2.size[0]);
	gl.uniform1f(shader_main.unimap["u_arealight2Height"], obj_pad2.size[1]);
	gl.uniform1f(shader_main.unimap["u_arealight2Shininess"], 4400);
	/////////////////////////////////////////////
	gl.bindTexture(gl.TEXTURE_2D, spiritTextureWall);
	for (var i in gridplanes ) {
		var obj = gridplanes[i];
		gl.uniformMatrix4fv(shader_main.unimap["u_worldMatrix"], gl.FALSE, obj.worldMatrix);
		gl.uniformMatrix3fv(shader_main.unimap["u_normalMatrix"], gl.FALSE, obj.normalMatrix);
		mesh_draw(gl, obj.mesh, shader_main.attrmap);
	}
	gl.bindTexture(gl.TEXTURE_2D, spiritTextureBall);
	gl.useProgram(shader_plain_texture.program);
	gl.uniformMatrix4fv(shader_plain_texture.unimap["u_projectMatrix"], gl.FALSE, projectMatrix);
	gl.uniformMatrix4fv(shader_plain_texture.unimap["u_viewMatrix"], gl.FALSE, viewMatrix);
	gl.uniformMatrix3fv(shader_plain_texture.unimap["u_viewNormalMatrix"], gl.FALSE, viewNormalMatrix);
	setWNMatrix(gl, obj_ball);
	gl.uniformMatrix4fv(shader_plain_texture.unimap["u_worldMatrix"], gl.FALSE, worldMatrix);
	gl.uniformMatrix3fv(shader_plain_texture.unimap["u_normalMatrix"], gl.FALSE, normalMatrix);
	mesh_draw(gl, obj_ball.mesh, shader_plain_texture.attrmap);

	gl.useProgram(shader_plain.program);
	gl.uniformMatrix4fv(shader_plain.unimap["u_projectMatrix"], gl.FALSE, projectMatrix);
	gl.uniformMatrix4fv(shader_plain.unimap["u_viewMatrix"], gl.FALSE, viewMatrix);
	gl.uniformMatrix3fv(shader_plain.unimap["u_viewNormalMatrix"], gl.FALSE, viewNormalMatrix);
	gl.uniform4fv(shader_plain.unimap["u_color"], [1, 1, 1, .3]);
	setWNMatrix(gl, obj_pad2);
	gl.uniformMatrix4fv(shader_plain.unimap["u_worldMatrix"], gl.FALSE, worldMatrix);
	gl.uniformMatrix3fv(shader_plain.unimap["u_normalMatrix"], gl.FALSE, normalMatrix);
	mesh_draw(gl, obj_pad2.mesh, shader_plain.attrmap);

	setWNMatrix(gl, obj_pad1);
	gl.uniformMatrix4fv(shader_plain.unimap["u_worldMatrix"], gl.FALSE, worldMatrix);
	gl.uniformMatrix3fv(shader_plain.unimap["u_normalMatrix"], gl.FALSE, normalMatrix);
	mesh_draw(gl, obj_pad1.mesh, shader_plain.attrmap);
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
function update(intv) {
	fps();
	//	return
	randomdepth();
	ai();
	switch(state) {
	case STATE_START:
		waitingForStartup(intv);
		break;
	case STATE_GAME:
		physicfawefwaefawfeawf(intv, obj_ball);
		break;
	case STATE_END:
		gameEndState(intv);
		break;
	}
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

function gameEndState(delta) {
	return;
}

function initGame() {
	ballspeedLimitfjaiwoejfiweaf = .71;
	ballSpinVectorfawefweafaef = vec4.fromValues(1, 0, 0, 0.0);
	ballRotationfjw0oajwfioef = quat.fromValues();
	quat.identity(ballRotationfjw0oajwfioef);

	ballSpeedVectorj8g9awjefwae = [];
	vec3.subtract(ballSpeedVectorj8g9awjefwae, obj_pad1.position, obj_ball.position);
	v_mul(ballSpeedVectorj8g9awjefwae, ballspeedLimitfjaiwoejfiweaf / vec3.length(ballSpeedVectorj8g9awjefwae));
}


$("canvas").click(onCanvasClick);

function ai() {
	vec2.copy(obj_pad2.destination, obj_ball.position);

	obj_pad1.destination[0] = (1 / 2 - mousePosition[0]   ) * boxSize[0] / boxSize[2];
	obj_pad1.destination[1] = (mousePosition[1] - 1 / 2) * boxSize[1] / boxSize[2];

}

function resize() {
	var w = boxSize[0];
	var h = boxSize[1];

	var rate_c = 150;
	var cw = rate_c * w;
	var ch = rate_c * h;
	$(canvas).attr('width', cw);
	$(canvas).attr('height', ch);
	gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

	var ww = $(window).width();
	var wh = $(window).height();
	if (ww / wh > w / h)
		ww = w * wh / h;
	else
		wh = h * ww / w;
	$(canvas).css('width', ww);
	$(canvas).css('height', wh);
}


$(window).resize(resize);
$(window).resize();
function randomdepth() {
	var obj = gridplanes[parseInt(gridplanes.length * Math.random())];
	var position = [Math.random(), Math.random()];
	var d = obj_gridplane_get(obj, position);
	//debugger
	if (d > 0) {
		var depth = Math.random() * .003;
		depth = depth > d ? 0 : d - depth;
		obj_gridplane_set(gl, obj.mesh.position.buffer, obj, position, depth);
		return;
	}

}

function knockOnGrid(wall, position) {
	var maxdepth = .02;
	var mindepth = .005;
	var i;
	var x = position[0] * boxSize[2] / boxSize[0];
	var y = position[1] * boxSize[2] / boxSize[1];
	var z = position[2];
	switch(wall) {
	case '-x':
		i = 0;
		x = -z;
		break;
	case '+x':
		i = 1;
		x = z;
		break;
	case '-y':
		i = 2;
		y = -z;
		break;
	case '+y':
		i = 3;
		y = z;
		break;
	}
	var obj = gridplanes[i];
	var position = [x, y];
	var d = obj_gridplane_get(obj, position);
	if (!d)
		d = mindepth;
	var depth = (maxdepth - d) * Math.random() + d;
	obj_gridplane_set(gl, obj.mesh.position.buffer, obj, position, depth);
}

function fps() {
	if (frameCounter[0]) {
		var t = frameCounter.length;
		var f = 1000 * t / (frameCounter[t - 1] - frameCounter[0]);
		consoleinfo("<table><tr><td>fps</td><td>{0}</td>".format(Math.floor(f)));
	}
}

function consoleinfo(s) {
	$("div").html(s);
}

function animate(time) {
	draw();
	frameCounter.shift();
	frameCounter.push(time);
	requestAnimationFrame(animate);
};

