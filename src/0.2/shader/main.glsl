

uniform mat4 u_worldMatrix;
uniform mat3 u_normalMatrix;
uniform mat3 u_viewNormalMatrix;
uniform mat4 u_viewMatrix;
uniform mat4 u_projectMatrix;

uniform vec3 u_lightSource0;
uniform vec3 u_lightSource1;
uniform vec3 u_eyePosition;

attribute vec3 a_normal;
attribute vec2 a_texCoord;
attribute vec4 a_position;

varying vec2 v_texCoord; 
varying vec3 v_normal, v_lightDir0,v_eyeVec;//, lightDir1, eyeVec;
varying float v_diffuseFactor;
varying vec3 v_worldPosition;
varying vec3 v_viewPosition;
varying vec3 v_worldNormal;
varying vec3 v_viewNormal;

void main()
{
    vec4 wp= u_worldMatrix* a_position; 
    // vec3 worldPosition=wp.xyz/wp.w;
    vec4 vp=u_viewMatrix * wp;
    // vec3 viewPosition=vp.xyz/vp.w;
    v_worldPosition=wp.xyz/wp.w;
    v_viewPosition=vp.xyz/vp.w;

    v_worldNormal= u_normalMatrix *a_normal;
    v_viewNormal=u_viewNormalMatrix*v_worldNormal;
    gl_Position = u_projectMatrix*vp;

    v_lightDir0= v_worldPosition-u_lightSource0; 
    v_texCoord = a_texCoord;
    v_eyeVec= u_eyePosition- v_worldPosition;
    v_normal= u_normalMatrix *a_normal;
    //v_diffuseFactor=max(dot(v_normal, -v_lightDir0), 0.0); 


} 
///////////////////////glsl-split///////////////////////////////////////////
precision mediump float;
uniform float u_lightSource0Strenth; 


uniform sampler2D sampler2d;

varying vec2 v_texCoord;

varying vec3 v_normal, v_lightDir0,v_eyeVec;//, lightDir1, eyeVec;
varying vec3 v_worldPosition;
varying vec3 v_viewPosition;
varying vec3 v_worldNormal;
varying vec3 v_viewNormal;

float constantAttenuation=1.5; 
float		linearAttenuation=0.5 ;
float quadraticAttenuation=0.1;
vec3		lightColor=vec3(1.,1.,1.);
float		lightIntensity=1.0; 
uniform float u_shininess;//=3399.0;

uniform float u_lightWidth;//=.2;
uniform float u_lightHeight;//k=0.2;
uniform vec3 u_lightViewPosition;//=vec3(.0,.0,.0);
uniform vec3 u_lightViewNormal;//=vec3(.0,.0,1.);
uniform vec3 u_lightViewRight;//=vec3(1.,.0,.0);
uniform vec3 u_lightViewUp;//=vec3(.0,1.,.0);

vec3 projectOnPlane( vec3 point1, vec3 planeCenter, vec3 planeNorm ) { 
    return point1 - dot( point1 - planeCenter, planeNorm ) * planeNorm; 
}

vec3 linePlaneIntersect( vec3 lp, vec3 lv, vec3 pc, vec3 pn ) { 
    return lp + lv * ( dot( pn, pc - lp ) / dot( pn, lv ) ); 
}
float calculateAttenuation( float dist ) { 
    return ( 1.0 / ( constantAttenuation + linearAttenuation * dist + quadraticAttenuation * dist * dist ) ); 
} 
void main()
{
    //area light/////////////
    vec3 viewNormal=normalize(v_viewNormal);
    vec3 viewPosition=v_viewPosition;
    float w=u_lightWidth/2.0;
    float h=u_lightHeight/2.0;
    vec3 proj=projectOnPlane(viewPosition,u_lightViewPosition,u_lightViewNormal);
    vec3 dir=proj-viewPosition;
    vec2 diagonal=vec2(dot(dir,u_lightViewRight),dot(dir,u_lightViewUp));
    vec2 nearest2D=vec2(clamp(diagonal.x,-w,w),clamp(diagonal.y,-h,h));
    vec3 nearestPointInside=u_lightViewPosition+u_lightViewRight*nearest2D.x+u_lightViewUp*nearest2D.y;

    vec3 lightDir = normalize( nearestPointInside - viewPosition ); 
    float NdotL = max( dot( u_lightViewNormal, -lightDir ), .0 ); 
    float NdotL2 = max( dot( viewNormal, lightDir ), .0 ); 
    NdotL=dot( u_lightViewNormal, viewPosition -u_lightViewPosition ) ;
    vec3 areaLight;
    if ( NdotL2 * NdotL >.0){ 
        float t=sqrt( NdotL * NdotL2 );
        //jvec3 diffuse = vec3( t ,t ,t );
        float diffuse=t;
        // j vec3 specular = vec3( .0,.0,.0 ); 
        float specular=.0;
        vec3 R = reflect( normalize( -viewPosition ), viewNormal ); 

        float specAngle = dot( R, u_lightViewNormal ); 
        if ( specAngle > 0.0 ) {
            vec3 E = linePlaneIntersect( viewPosition, R, u_lightViewPosition , u_lightViewNormal ); 
            vec3 dirSpec = E - vec3( u_lightViewPosition ); 
            vec2 dirSpec2D = vec2( dot( dirSpec, u_lightViewRight ), dot( dirSpec, u_lightViewUp ) );
            vec2 nearestSpec2D = vec2( clamp( dirSpec2D.x, -w, w ), clamp( dirSpec2D.y, -h, h ) );
            float specFactor = 1.0 - clamp( length( nearestSpec2D - dirSpec2D )
            * 0.05 * u_shininess, 0.0, 1.0 );
            specular = specFactor * specAngle * diffuse; 
        } 

        vec4 color = texture2D(sampler2d, v_texCoord); 
        //gl_FragColor= vec4( color.xyz* ( .2+ .4 * diffuse + .4* specular ), 1.);//attenuation ); 
        areaLight= color.xyz* (  .4 * diffuse + .4* specular );//, 1.);//attenuation ); 
    } else{
        // return float4(lightColor*.2,1); 
        //gl_FragColor=vec4(1.,0.,0.,1.); 
        areaLight= vec3(.0,.0,.0);//color.xyz* ( .2+ .4 * diffuse + .4* specular );//, 1.);//attenuation ); 
    }
    // point light ///////////////////////////////////////
    vec2 texCoord = vec2(v_texCoord.s, 1.0 - v_texCoord.t);
    vec4 color = texture2D(sampler2d, texCoord); 
    vec3 n=normalize(v_normal);
    vec3 nl=normalize(v_lightDir0);
    vec3 ne=normalize(v_eyeVec);
    float diffuse=max(dot(n,-nl),0.0);
    vec3 nh=normalize(ne-nl);
    float blinn=pow(max(dot(nh,n),0.0),800.0);

    float pointLightStrenth=length(v_lightDir0);
    pointLightStrenth=u_lightSource0Strenth/pointLightStrenth/pointLightStrenth;

    //color.xyz*=pointLightStrenth*(0.2+0.4*diffuse+25.7*blinn);
    // color.y=.0;
    color.xyz*=(0.2+0.4*diffuse+.4*blinn);
    color.xyz+=areaLight;
    gl_FragColor = color;//vec4(u_ambientColor+color.xyz * 	v_diffuseFactor, color.a); 
}

