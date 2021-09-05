#extension GL_OES_standard_derivatives : enable

#ifdef GL_ES
precision highp float;
#endif




#define PI 3.1415968

uniform float u_time;
uniform vec2 u_resolution;



void main(void)
{

    vec2 uv = (2.*gl_FragCoord.xy)/u_resolution-vec2(1.);
    uv += 0.3*sin(uv.x*2.*3.14+u_time*0.5);
    uv.y += 0.8*sin(uv.x*2.*3.14+2.*u_time+PI/2.);
    uv.x += 0.7*cos(uv.y*2.*3.14+2.+u_time);
    float dist = mix(0.1,1.,sin(1.0*length(uv)));
    gl_FragColor = dist*vec4(
        abs(sin(cos(u_time+8.*uv.y*2.0)*2.*uv.x*uv.x+u_time*3.0)),
        abs(cos(sin(u_time+3.*uv.x*uv.y)*3.*uv.y+u_time)),
        abs(cos(sin(u_time+8.*uv.x*uv.y)*3.*uv.y*uv.x+u_time)) ,
        1.0);
}


// #define PI acos(-1.)
// #define TAU (PI * 2.)

// uniform float u_time;
// uniform vec2 u_resolution;

// vec2 rotate(vec2 v, float a) {
//     float s = sin(a);
//     float c = cos(a);
//     mat2 m = mat2(c, -s, s, c);
//     return m * v;
// }

// vec2 rot2(vec2 st, float a) {
//     st = mat2(cos(a), -sin(a), cos(a), sin(a))*(st); 
//     return st;;
// }
// float aastep(float threshold, float value) {

//     float afwidth = length(vec2(dFdx(value), dFdy(value))) * 0.70710678118654757;
//     return smoothstep(threshold-afwidth, threshold+afwidth, value);

// }

// float stroke(float x, float s, float w){
//     float d = aastep(s,x +w*.5) - step(s,x - w*.5);
//     return clamp(d , 0.,1.);
// }

// float random (in vec2 st) {
//     return fract(sin(dot(st.xy,
//                          vec2(12.9898,78.233)))
//                  * 43758.5453123);
// }

// float circleSDF(vec2 st) {
//     return length(st )*2.;
//  }
 
//  float fill(float x, float size) {
//  return 1. -step(size,x);
// }

// float rectSDF(vec2 st, vec2 s) {
// st = st*2.-1.;
//     return max(abs(st.x/s.x), abs(st.y/s.y));
// }

// float crossSDF(vec2 st, float s){
//     vec2 size = vec2(.5, s);
//     return min(rectSDF(st,size.xy),
//             rectSDF(st,size.yx));
// }

// float flip(float v, float pct) {
//     return mix(v, 1.-v, pct);
// }

// vec2 tile(vec2 _st, float _zoom){
//     _st *= _zoom;
//     return fract(_st);
// }

// vec2 brickXY(vec2 _st, float _zoom){
//     _st *= _zoom;
//     _st.x += step(1., mod(_st.y, 2.0)) *-.5;
//     _st.y += step(1., mod(_st.x, 2.0)) *-.5;
//     return fract(_st);
// }

// vec2 brickMOD(vec2 _st, float _zoom){
//     _st *= _zoom;
//     _st.x += step(1., mod(_st.y, 3.0)) *-.5;
//     _st.y += step(1., mod(_st.x, 3.0)) *-.5;
//     return fract(_st);
// }
// vec2 brickX(vec2 _st, float _zoom){
//     _st *= _zoom;
//     _st.x += step(1., mod(_st.y, 2.0)) *-.5;

//     return fract(_st);
// }

// mat2 rotate(float angle) {
//   return mat2(cos(angle), -sin(angle), sin(angle), cos(angle));
// }

// float Xor(float a, float b) {
//     return a*(1.-b) + b * (1.-a);
// }

// float HexDist(vec2 p){
//     p = abs(p);
//     float c = dot(p,normalize(vec2(1.,1.73)));
//     c = max(c, p.x); 
//     return c;
// }

// float dBox(vec2 pos, vec2 size){
//     pos = abs(pos);
//     float dx = pos.x -size.x;
//     float dy = pos.y - size.y;
//     return max(dx,dy);
// }   

// vec2 toPolarCoords(vec2 rectCoords){
//     return vec2(length(rectCoords),atan(rectCoords.y,rectCoords.x));
// }

// vec2 toRectCoords(vec2 polarCoords){
//     return vec2(polarCoords.x * cos(polarCoords.y), polarCoords.x * sin(polarCoords.y));
// }

// vec2 pMod2(inout vec2 p, vec2 size){
//     vec2 c = floor((p + size*0.5)/size);
//     p = mod(p+size*0.5,size) - size *0.5;
//     return c;
// }

// vec2 kaleidio(vec2 coords, float div){
//     vec2 outCoords = toPolarCoords(coords);
//     outCoords.y = mod(outCoords.y, 2.*PI/div);
//     outCoords = toRectCoords(outCoords);
//     return outCoords;
// }

// vec2 kaleidioREF(vec2 coords, float div){
//     vec2 outCoords = toPolarCoords(coords);
//     float a = 2.*PI/div;
//     float np = outCoords.y/a;
//     outCoords.y = mod(np, a);
//     float m2 = mod(np,2.);
//     if(m2 > 1.0) {
//         outCoords.y = a - outCoords.y;
//     }
//     outCoords = toRectCoords(outCoords);
//     return outCoords;
// }
// float triSDF(vec2 st) {
//     st = (st*2.-1.)*2.;
//     return max(abs(st.x) * 0.866025 + st.y * 0.5, -st.y*0.5);
// }

// vec4 not(vec4 a) {
//   return 1.0 - a;
// }

// vec4 or(vec4 a, vec4 b) {
//   return min(a + b, 1.0);
// }

// float waver(float amp,float freq, float axis, float u_time){
//     return amp*sin(TAU*freq*axis+u_time);
// }

// float pm(float waver, float waver2){
//     return sin(waver + waver);
// }

// float fm(float waver, float waver2){
//     return sin(waver + waver);
// }

// vec2 twirl(vec2 st, float amt,float u_time) {
//     float angle = atan(st.y,st.x);
//     float radius = length(st);
//     angle += radius * amt;
//     vec2 shifted = radius *vec2(cos(angle+u_time),sin(angle+u_time));
//     return vec2(shifted);
// }

// vec3 rainbowTwirl(vec2 st){
//     st = twirl(st, 10., u_time);
//     vec3 color = vec3(0.0);
//     vec3 comp = vec3(0.0);
//     float line = 0.;
//     for(int i = 0; i < 8; i ++){
//     st = rotate(st, PI/8.*float(i));

//     line += stroke(0.,st.x, 0.01);
    
//     }
//     float circ =step( length(st)*1.,.1);
//     comp += line;
//     comp*=min( 1.-circ,line);
   
//     color += comp;
//     color.r = sin(3.*st.x+color.r*TAU);
//     color.g += sin(st.y+color.g*TAU);
//     color.b -= sin(st.y+color.g*TAU);
//     return color;
// }

// float rhombSDF(vec2 st){
//     return max(triSDF(st),triSDF(vec2(st.x+.5,0.1-st.y)));
// }


// void main(void)
// {
//     vec2 uv = 10.*gl_FragCoord.xy/u_resolution.y-vec2(5.);
//     //uv += kaleidio(uv,20.);
//     uv *= twirl(uv,3.,u_time);
//     uv.x += .7*sin(1.*PI*uv.y+u_time);
//     uv.y += 0.7*sin(1.*PI*uv.x+u_time*2.);
//     vec3 col = vec3(0.0);
//     for(float i = 0.; i < 5.0; i += .1){
//     col += sin(2.*step(rhombSDF(uv-vec2(-.25+i,0.0-i)),1.));
//     col -= step(rhombSDF(uv+vec2(-.25-i,0.0-i)),1.);
//     col += step(rhombSDF(uv.yx-vec2(-.0+i,0.0-i)),1.);
//     col += step(rhombSDF(uv.yx-vec2(-.0-i,0.0+i)),1.);
//     col += step(triSDF(uv.yx-vec2(-.0+i,0.0+i)),1.);
//     col -= step(triSDF(uv.yx-vec2(-.0+i,0.0+i)),1.);
//     }
    
//     col.r += sin(col.r);
//     col.b *= sin(2.*col.b+u_time);
//     col.g = sin(2.*col.b+u_time);
//     col += sin(PI+uv.y*2.*col+u_time);
//     gl_FragColor = vec4(col,1.0);
// }


