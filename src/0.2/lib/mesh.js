function mesh_init(gl, mesh ) {
	for (var i in mesh) {
		//mesh[i].target = attrmap['a_' + i];
		mesh[i].buffer = gl.createBuffer();
		if ('indice' == i) {
			gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, mesh[i].buffer);
			gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, mesh[i].data, gl.STATIC_DRAW);
		} else {
			gl.bindBuffer(gl.ARRAY_BUFFER, mesh[i].buffer);
			gl.bufferData(gl.ARRAY_BUFFER, mesh[i].data, gl.STATIC_DRAW);
		}

	}
}

function mesh_draw(gl, mesh, attrmap) {
	for (var i in mesh) {
		var target=attrmap['a_' + i];
		if (undefined != target) {
			gl.bindBuffer(gl.ARRAY_BUFFER, mesh[i].buffer);
			gl.vertexAttribPointer( target, mesh[i].size, gl.FLOAT, false, 0, 0);
		}
	}
	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, mesh['indice'].buffer);
	gl.drawElements(gl.TRIANGLES, mesh['indice'].data.length, gl.UNSIGNED_SHORT, 0);
}

