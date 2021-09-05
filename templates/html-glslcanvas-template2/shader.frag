#ifdef GL_ES
precision mediump float;
#endif
#extension GL_OES_standard_derivatives : enable


#define PI acos(-1.)
#define TAU (PI * 2.)

uniform float u_time;
uniform vec2 u_resolution;
uniform vec2 mouse;
uniform vec3 spectrum;



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

float dBox(vec2 pos, vec2 size){
    pos = abs(pos);
    float dx = pos.x -size.x;
    float dy = pos.y - size.y;
    return max(dx,dy);
}   
float aastep(float threshold, float value) {
  #ifdef GL_OES_standard_derivatives
    float afwidth = length(vec2(dFdx(value), dFdy(value))) * 0.70710678118654757;
    return smoothstep(threshold-afwidth, threshold+afwidth, value);
  #else
    return step(threshold, value);
  #endif  
}
vec2 toPolarCoords(vec2 rectCoords){
    return vec2(length(rectCoords),atan(rectCoords.y,rectCoords.x));
}

vec2 toRectCoords(vec2 polarCoords){
    return vec2(polarCoords.x * cos(polarCoords.y), polarCoords.x * sin(polarCoords.y));
}

vec2 pMod2(inout vec2 p, vec2 size){
    vec2 c = floor((p + size*0.5)/size);
    p = mod(p+size*0.5,size) - size *0.5;
    return c;
}

vec2 kaleidio(vec2 coords, float div){
    vec2 outCoords = toPolarCoords(coords);
    outCoords.y = mod(outCoords.y, 2.*PI/div);
    outCoords = toRectCoords(outCoords);
    return outCoords;
}

vec2 kaleidioREF(vec2 coords, float div){
    vec2 outCoords = toPolarCoords(coords);
    float a = 2.*PI/div;
    float np = outCoords.y/a;
    outCoords.y = mod(np, a);
    float m2 = mod(np,2.);
    if(m2 > 1.0) {
        outCoords.y = a - outCoords.y;
    }
    outCoords = toRectCoords(outCoords);
    return outCoords;
}
float triSDF(vec2 st) {
    st = (st*2.-1.)*2.;
    return max(abs(st.x) * 0.866025 + st.y * 0.5, -st.y*0.5);
}
vec4 not(vec4 a) {
  return 1.0 - a;
}

vec4 or(vec4 a, vec4 b) {
  return min(a + b, 1.0);
}

float waver(float amp,float freq, float axis, float time){
    return amp*sin(TAU*freq*axis+time);
}

float pm(float waver, float waver2){
    return sin(waver + waver);
}

float fm(float waver, float waver2){
    return sin(waver + waver);
}


void main(void)
{
    vec2 st = (2.*gl_FragCoord.xy)/u_resolution-vec2(1.);
    st.x *= u_resolution.x/u_resolution.y;   
    vec2 uv = st;   
    st *= rotate(st*uv*2.,u_time);
   st = abs(uv*5.);
    //st = 1.*kaleidio(vec2(0.1*sin(st.x+u_time),0.31*cos(st.y+u_time)),8.);
    st.x -= 0.1*sin(st.y-u_time);
    st.y += sin(st.x+u_time);
    vec3 color = vec3(0.0);
    float wave1 = 0.5*waver(0.6, 3., st.x, u_time);
    float wave2 = .5*waver(0.5, 1., st.x, u_time);
    float wave3 = 0.5*waver(0.6, 3., st.y, u_time);
    float wave4 = 0.5*waver(0.5, 1., st.y, u_time);
     wave1 *= pm(wave2, wave4);
    wave4 += fm(wave1, wave2);
    for(float i = -0.9; i<= .9; i+= 0.1){
    color.r += 0.89*stroke(6.3*wave1+pm(wave3,wave4),st.y, .3);
    color.r += smoothstep(color.r,color.g,wave4);
    color.g += 0.6*stroke(0.1*wave1+3.1*wave2,st.y-i, .1);
    color.b += 7.4*stroke(9.61*wave3+8.1*wave4,st.x+i, .1);
    
    }
    vec3 finalCol = color;
    finalCol += fm(finalCol.r,finalCol.b);
    finalCol += pm(finalCol.b,finalCol.b);
    gl_FragColor = vec4(finalCol,1.0);
}


//    vec2 st = gl_FragCoord.xy/u_resolution-.5;
//    vec2 circ = st*2.;
//    circ.x *= u_resolution.x/u_resolution.y;
//    float d = length(circ);
//    st.x *= u_resolution.x/u_resolution.y;
//    
//    vec2 uv = 2.*st;  
//   // uv = rotate(uv,u_time);
//   
//    uv.x *= 0.5*uv.x;
//    //st.y *= st.y;
//    st.x += .3*sin(1.*TAU*st.y+u_time*.5)*.5+.5;
//    st.y *= 0.3*sin(1.*TAU*st.x+u_time*.5)*.5+.5;
//    uv.x += 0.3*sin(0.5*TAU*uv.y+u_time)*.5+.5;
//    uv.y += 0.2*sin(2.*TAU*uv.x+u_time)*.5+.5;
//    uv = abs(uv-.7);
//    st = abs(st);
//    vec3 color = vec3(0.0);
//    //float circle = 29.*circleSDF(st-vec2(.0,0.0));
//   //circle = sin(1.*circle+u_time);
//    float triangle = triSDF(uv+.5);
//    //triangle += rotate(vec2(triangle * 0.5),u_time).y;
//    //color += stroke(circle,.45,.1);
//    color += sin(2.*step(.1,cos(TAU*10.*triangle+u_time*.25)));
//    color += fill(sin(TAU*2.*triangle-u_time*.05+sin(208.*st.y+u_time)),.1);
//    float bambing = sin(567.9*st.x*TAU+u_time)*.5+.5;
//    bambing += 1.*sin(46.9*st.y*TAU-u_time)*.5+.5;
//    float bambing2 = sin(0.5*st.x*TAU+u_time)*.5+.5;
//    bambing2 += 3.*sin(0.2*st.y*TAU-u_time)*.5+.5;
//    
//    float wave = waver(1.,21.,st.y,u_time);
//    wave += waver(1.,21.,st.x,u_time);
//    wave += pm(wave, wave*2.);
//    color.r += cos(color.r*9.+u_time*.15+PI/2.+bambing+wave)*.5+.5;    
//    color.g = cos(color.r*4.-u_time*.15+PI/8.-bambing)*.5+.5;  
//    color.b = sin(color.r*4.-u_time*.15-PI/6.+bambing*2.)*.5+.5; 
//    
//    vec3 finalCol = color;
//    vec4 aint = vec4(color,1.);
//    aint = not(2.*aint);
//    //vec4 orz = or(aint,finalCol.rgbr);
//    //finalCol = 0.7*sin(orz.rgb);
////    finalCol *= 1.-smoothstep(d,d*0.,.5);
//    gl_FragColor = vec4(finalCol,1.0);
