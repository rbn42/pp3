function obj_gridplane(size,edgewidth) {
    var depth=1;
	var  _normals =new Float32Array(
		[  0, 0, 1,   0, 0, 1,   0, 0, 1,   0, 0, 1,     // v0-v1-v2-v3 front
		   1, 0, 0,   1, 0, 0,   1, 0, 0,   1, 0, 0,     // v0-v3-v4-v5 right
		   0, 1, 0,   0, 1, 0,   0, 1, 0,   0, 1, 0,     // v0-v5-v6-v1 top
		  -1, 0, 0,  -1, 0, 0,  -1, 0, 0,  -1, 0, 0,     // v1-v6-v7-v2 left
		 0,-1, 0,   0,-1, 0,   0,-1, 0,   0,-1, 0,     // v7-v4-v3-v2 bottom
		  0, 0,-1,   0, 0,-1,   0, 0,-1,   0, 0,-1 ]    // v4-v7-v6-v5 back
  	);
	var   _indices = new Uint16Array(
	[  0, 1, 2,   0, 2, 3,    // front
 	  4, 5, 6,   4, 6, 7,    // right
	   8, 9,10,   8,10,11,    // top
	  12,13,14,  12,14,15,    // left
	  16,17,18,  16,18,19]//,    // bottom
	//  20,21,22,  20,22,23 ]   // back
  	) ;

   var   _texCoords=new Float32Array(
        [  1, 1,   0, 1,   0, 0,   1, 0,    // v0-v1-v2-v3 front
           0, 1,   0, 0,   1, 0,   1, 1,    // v0-v3-v4-v5 right
           1, 0,   1, 1,   0, 1,   0, 0,    // v0-v5-v6-v1 top
           1, 1,   0, 1,   0, 0,   1, 0,    // v1-v6-v7-v2 left
           0, 0,   1, 0,   1, 1,   0, 1,    // v7-v4-v3-v2 bottom
           0, 0,   1, 0,   1, 1,   0, 1 ]   // v4-v7-v6-v5 back
     ); 
  	size=new Uint8Array(size);
	//var gridsize=new Float32Array([1/size[0],1/size[1]]);
	var _size = size[0] * size[1];
	var vertices = new Float32Array(6 * 4 * 3 * _size+4*3);
	var normals = new Float32Array(6 * 4 * 3 * _size+4*3);
	var texCoords = new Float32Array(6 * 4* 2 * _size+4*2);
	var indices = new Uint16Array(6 * 2 * 3 * _size+2*3); 
	var v_index=0,n_index=0,t_index=0,i_index=0;
	
	var depths=new Float32Array( _size); 
	
	for (var x = 0; x < size[0]; x++)
		for (var y = 0; y < size[1]; y++) { 
			//var _index = x + y * size[0]; 
			var _vertices=new Float32Array(
		        [  (1/2-edgewidth), (1/2-edgewidth), 0,  -(1/2-edgewidth), (1/2-edgewidth), 0,  -(1/2-edgewidth),-(1/2-edgewidth),0,   (1/2-edgewidth),-(1/2-edgewidth), 0,    // v0-v1-v2-v3 front
		           (1/2-edgewidth), (1/2-edgewidth),0,   (1/2-edgewidth),-(1/2-edgewidth), 0,   (1/2-edgewidth),-(1/2-edgewidth),-depth,   (1/2-edgewidth), (1/2-edgewidth),-depth,    // v0-v3-v4-v5 right
		           (1/2-edgewidth), (1/2-edgewidth), 0,   (1/2-edgewidth), (1/2-edgewidth),-depth,  -(1/2-edgewidth), (1/2-edgewidth),-depth,  -(1/2-edgewidth), (1/2-edgewidth), 0,    // v0-v5-v6-v1 top
		          -(1/2-edgewidth), (1/2-edgewidth), 0,  -(1/2-edgewidth), (1/2-edgewidth),-depth,  -(1/2-edgewidth),-(1/2-edgewidth),-depth,  -(1/2-edgewidth),-(1/2-edgewidth), 0,    // v1-v6-v7-v2 left
		          -(1/2-edgewidth),-(1/2-edgewidth),-depth,   (1/2-edgewidth),-(1/2-edgewidth),-depth,   (1/2-edgewidth),-(1/2-edgewidth), 0,  -(1/2-edgewidth),-(1/2-edgewidth), 0,    // v7-v4-v3-v2 bottom
		           (1/2-edgewidth),-(1/2-edgewidth),-depth,  -(1/2-edgewidth),-(1/2-edgewidth),-depth ,  -(1/2-edgewidth), (1/2-edgewidth),-depth,   (1/2-edgewidth), (1/2-edgewidth),-depth ]   // v4-v7-v6-v5 back
   			);
   			for(var i=0;i<6 * 4;i++ ){
   				
   				_vertices[3*i]=(_vertices[3*i]+x+1/2)/size[0]-1/2;
   				_vertices[3*i+1]=(_vertices[3*i+1]+y+1/2)/size[1]-1/2;
   			}  
   			
			vertices.subarray(v_index, (v_index += _vertices.length)).set(_vertices);
			normals.subarray(n_index, (n_index += _normals.length)).set(_normals);
			texCoords.subarray(t_index, (t_index += _texCoords.length)).set(_texCoords);
			indices.subarray(i_index, (i_index += _indices.length)).set(_indices);

			for(var i=0;i<_indices.length;i++)
				_indices[i]+=_vertices.length/3;
			
		}

	_normals = _normals.subarray(0,4 * 3);
	_texCoords = _texCoords.subarray(0,2 * 4);
	_indices = _indices.subarray(0,2 * 3);
	_vertices = new Float32Array([ 1/2,-1/2,-depth,  -1/2,-1/2,-depth ,  -1/2, 1/2,-depth,   1/2, 1/2,-depth]);
	vertices.subarray(v_index, (v_index += _vertices.length)).set(_vertices);
	normals.subarray(n_index, (n_index += _normals.length)).set(_normals);
	texCoords.subarray(t_index, (t_index += _texCoords.length)).set(_texCoords);
	indices.subarray(i_index, (i_index += _indices.length)).set(_indices);

	return { 
		size : size,
		e : edgewidth, 
		d:depths ,
		mesh:{
	        position:{
	            data: vertices,
				size: 3, 
	            buffer: null, 
	            target: null 
	        },
	        normal:{
	            data: normals,
				size: 3, 
	            buffer: null, 
	            target: null 
	        },
	        texCoord:{
	            data: texCoords ,
				size: 2, 
	            buffer: null, 
	            target: null 
	        }, 
	        indice: {
	            data:indices,
				buffer:null
	        }
       }
	};

} 


function obj_gridplane_set(gl, vbuffer, gridplane, position, depth) { 
	var x=1/2+position[0];
	var y=1/2+position[1];
	x=parseInt(x*gridplane.size[0]);
	y=parseInt(y*gridplane.size[1]);
	var _index= (y+x*(gridplane.size[1]));  
	
	gridplane.d[_index]=depth; 
	
	var _index=6 * 4 * 3 *_index;
	var _v=gridplane.mesh.position.data.subarray(_index ,_index+6 * 4 * 3);
	 for(var i =0;i<6  ;i++)
	 	_v[3*i+2]=-depth; 
		_v[3*8+2]=-depth;
		_v[3*11+2]=-depth;
		_v[3*12+2]=-depth;
		_v[3*15+2]=-depth;
		_v[3*18+2]=-depth;
		_v[3*19+2]=-depth; 
	
	gl.bindBuffer(gl.ARRAY_BUFFER, vbuffer);
	gl.bufferSubData(gl.ARRAY_BUFFER,4*_index,_v);
	return ; 
	
} 
function obj_gridplane_get(gridplane,position){
	var x=1/2+position[0];
	var y=1/2+position[1];
	x=parseInt(x*gridplane.size[0]);
	y=parseInt(y*gridplane.size[1]);
	var _index= (y+x*(gridplane.size[1]));  
	return gridplane.d[_index] ;
	}

