function gl_attributeLocations(gl, program) {
	var o = {};
	for (var i = 0; i < gl.getProgramParameter(program, gl.ACTIVE_ATTRIBUTES); ++i) {
		var t = gl.getActiveAttrib(program, i);
		o[t.name] = gl.getAttribLocation(program, t.name);
	}
	return o;
}

function gl_uniformLocations(gl, program) {
	var o = {};
	for (var i = 0; i < gl.getProgramParameter(program, gl.ACTIVE_UNIFORMS); ++i) {
		var t = gl.getActiveUniform(program, i);
		o[t.name] = gl.getUniformLocation(program, t.name);
	}
	return o;
}
 
function gl_bindAttributeBuffer(gl,data){
	var buffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
	gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);  
	return buffer;
}
function gl_enableAttributeBuffer(gl,buffer,location,size){ 
	gl.bindBuffer(gl.ARRAY_BUFFER, buffer); 
 	gl.vertexAttribPointer(location, size, gl.FLOAT, false, 0, 0);
}
function gl_bindIndexObjectBuffer(ctx,data){ 
	var indexObject = ctx.createBuffer();
	ctx.bindBuffer(ctx.ELEMENT_ARRAY_BUFFER, indexObject);
	ctx.bufferData(ctx.ELEMENT_ARRAY_BUFFER, data, ctx.STATIC_DRAW);
	return indexObject;
} 

function gl_object(position){
	return {
		position:position?position:new Float32Array(3),
		rotation:new Float32Array(3),
		scale:new Float32Array(3)
	};
}

