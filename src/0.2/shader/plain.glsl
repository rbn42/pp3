

uniform mat4 u_worldMatrix; 
uniform mat4 u_viewMatrix;
uniform mat4 u_projectMatrix; 

attribute vec3 a_normal;
attribute vec2 a_texCoord;
attribute vec4 a_position; 

void main()
{
    vec4 wp= u_worldMatrix* a_position;   
    gl_Position = u_projectMatrix*u_viewMatrix *wp; 
} 
///////////////////////glsl-split///////////////////////////////////////////
precision mediump float; 

uniform vec4 u_color; 
void main()
{ 
    vec4 color=vec4(1.0,1.0,1.0,.4);
    gl_FragColor = u_color; 
}
