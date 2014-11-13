function gl_compile(gl, type, shaderSrc) {
	var shader = gl.createShader(type);
	gl.shaderSource(shader, shaderSrc);
	gl.compileShader(shader);

	if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
		throw new Error(gl.getShaderInfoLog(shader));
	}

	return shader;
};
function gl_link(gl, vertexShader, fragmentShader) {
	var program = gl.createProgram();
	gl.attachShader(program, vertexShader);
	gl.attachShader(program, fragmentShader);
	gl.linkProgram(program);

	if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
		throw new Error(gl.getProgramInfoLog(program));
	}

	return program;
};

function gl_build(gl, vertexShaderSrc, fragmentShaderSrc) {
	var vertexShader = gl_compile(gl, gl.VERTEX_SHADER, vertexShaderSrc);
	var fragmentShader = gl_compile(gl, gl.FRAGMENT_SHADER, fragmentShaderSrc);
	var program = gl_link(gl, vertexShader, fragmentShader);
	return program;
}

function getGL(canvas) {

	//	var canvas = document.getElementById(id);
	var gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
	if (!gl)
		throw new Error('browser may not support webgl');

	gl.clearColor(0.0, 0.0, 0.0, 1.0);
	gl.clear(gl.COLOR_BUFFER_BIT);
	gl.enable(gl.DEPTH_TEST);
	gl.enable(gl.BLEND);
	gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
	return gl;
}  