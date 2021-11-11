#ifdef GL_ES
precision highp float;
#endif


#define PI acos(-1.)

uniform float u_time;
uniform vec2 u_resolution;
uniform vec2 mouse;
uniform vec3 spectrum;

uniform sampler2D texture0;
uniform sampler2D texture1;
uniform sampler2D texture2;
uniform sampler2D texture3;
uniform sampler2D prevFrame;
uniform sampler2D prevPass;

varying vec3 v_normal;
varying vec2 v_texcoord;


vec2 rotate(vec2 v, float a) {
    float s = sin(a);
    float c = cos(a);
    mat2 m = mat2(c, -s, s, c);
    return m * v;
}

float stroke(float x, float s, float w){
    float d = step(s,x +w*.5) - step(s,x - w*.5);
    return clamp(d , 0.,1.);
}

float random (in vec2 st) {
    return fract(sin(dot(st.xy,
                         vec2(12.9898,78.233)))
                 * 43758.5453123);
}

float circleSDF(vec2 st) {
    return length(st )*2.;
 }
 
 float fill(float x, float size) {
 return 1. -step(size,x);
}

float rectSDF(vec2 st, vec2 s) {
st = st*2.-1.;
    return max(abs(st.x/s.x), abs(st.y/s.y));
}

float crossSDF(vec2 st, float s){
    vec2 size = vec2(.5, s);
    return min(rectSDF(st,size.xy),
            rectSDF(st,size.yx));
}

float flip(float v, float pct) {
    return mix(v, 1.-v, pct);
}

vec2 tile(vec2 _st, float _zoom){
    _st *= _zoom;
    return fract(_st);
}

vec2 brickXY(vec2 _st, float _zoom){
    _st *= _zoom;
    _st.x += step(1., mod(_st.y, 2.0)) *-.5;
    _st.y += step(1., mod(_st.x, 2.0)) *-.5;
    return fract(_st);
}

vec2 brickMOD(vec2 _st, float _zoom){
    _st *= _zoom;
    _st.x += step(1., mod(_st.y, 3.0)) *-.5;
    _st.y += step(1., mod(_st.x, 3.0)) *-.5;
    return fract(_st);
}
vec2 brickX(vec2 _st, float _zoom){
    _st *= _zoom;
    _st.x += step(1., mod(_st.y, 2.0)) *-.5;

    return fract(_st);
}

mat2 rotate(float angle) {
  return mat2(cos(angle), -sin(angle), sin(angle), cos(angle));
}

float Xor(float a, float b) {
    return a*(1.-b) + b * (1.-a);
}

float HexDist(vec2 p){
    p = abs(p);
    float c = dot(p,normalize(vec2(1.,1.73)));
    c = max(c, p.x); 
    return c;
}

float vessicaSDF(vec2 st, float w) {
    vec2 offset = vec2(w*.5,0.);
    return max(circleSDF(st-offset),circleSDF(st+offset));
}

void main(void)
{
    vec2 uv =  (2.*gl_FragCoord.xy)/u_resolution.xy;
    //uv = abs(uv);;
    uv *= 10.;
    vec2 thetaphi = uv * vec2(3.1415926535897932384626433832795, 1.5707963267948966192313216916398); 
    vec3 rayDirection = vec3(cos(thetaphi.y) * cos(thetaphi.x), sin(thetaphi.y), cos(thetaphi.y) * sin(thetaphi.x));
    vec3 col = vec3(0.0,0.0,0.0);
    vec2 eggUV = 0.9*vec2(sin(5.*PI*uv.x+u_time)*.5+.5,cos(3.*PI*uv.x+u_time));
    //col += sin(step(HexDist(uv), .2));
    vec2 rotatedUV = rotate(uv,u_time);
    float sdf = vessicaSDF(eggUV+rotatedUV, 0.7);
    col += flip(fill(sdf,.2), step((uv.x+uv.y)*.7,0.));
    
    vec3 finalCol = col;
   finalCol += sin(rayDirection*PI+u_time)*.5+.5;
   finalCol.b += sin(finalCol.b+u_time);
   finalCol.r += Xor(finalCol.g, 0.);
   
   gl_FragColor = vec4(finalCol, 1.0);

}


