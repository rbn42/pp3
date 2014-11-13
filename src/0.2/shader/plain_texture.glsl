

uniform mat4 u_worldMatrix; 
uniform mat4 u_viewMatrix;
uniform mat4 u_projectMatrix; 

attribute vec3 a_normal;
attribute vec2 a_texCoord;
attribute vec4 a_position; 
varying vec2 v_texCoord;

void main()
{ 
    gl_Position = u_projectMatrix*u_viewMatrix * u_worldMatrix* a_position; 
    v_texCoord = a_texCoord;
} 
///////////////////////glsl-split///////////////////////////////////////////
precision mediump float; 

uniform sampler2D sampler2d;  
varying vec2 v_texCoord;
void main()
{   
    vec4 color = texture2D(sampler2d, v_texCoord); 
    gl_FragColor = color; 
}
