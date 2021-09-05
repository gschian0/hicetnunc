#extension GL_OES_standard_derivatives : enable

#ifdef GL_ES
precision mediump float;
#endif


//uniform vec2 u_resolution;
//uniform vec2 u_mouse;
//uniform float u_time;
//
//void main() {
//    
//    gl_FragColor = vec4(st.x,st.y,0.0,1.0);
//}


#define PI acos(-1.)
#define TAU (PI * 2.)

uniform float u_time;
uniform vec2 u_resolution;
uniform vec2 mouse;
uniform vec3 spectrum;



//varying vec3 v_normal;
//varying vec2 v_texcoord;

vec3 rgb2hsb( in vec3 c ){
    vec4 K = vec4(0.0, -1.0 / 3.0, 2.0 / 3.0, -1.0);
    vec4 p = mix(vec4(c.bg, K.wz),
                 vec4(c.gb, K.xy),
                 step(c.b, c.g));
    vec4 q = mix(vec4(p.xyw, c.r),
                 vec4(c.r, p.yzx),
                 step(p.x, c.r));
    float d = q.x - min(q.w, q.y);
    float e = 1.0e-10;
    return vec3(abs(q.z + (q.w - q.y) / (6.0 * d + e)),
                d / (q.x + e),
                q.x);
}

//  Function from Iñigo Quiles
//  https://www.shadertoy.com/view/MsS3Wc
vec3 hsb2rgb( in vec3 c ){
    vec3 rgb = clamp(abs(mod(c.x*6.0+vec3(0.0,4.0,2.0),
                             6.0)-3.0)-1.0,
                     0.0,
                     1.0 );
    rgb = rgb*rgb*(3.0-2.0*rgb);
    return c.z * mix(vec3(1.0), rgb, c.y);
}

vec2 rotate(vec2 v, float a) {
    float s = sin(a);
    float c = cos(a);
    mat2 m = mat2(c, -s, s, c);
    return m * v;
}
float aastep(float threshold, float value) {

    float afwidth = length(vec2(dFdx(value), dFdy(value))) * 0.70710678118654757;
    return smoothstep(threshold-afwidth, threshold+afwidth, value);

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

vec2 twirl(vec2 st, float amt,float time) {
    float angle = atan(st.y,st.x);
    float radius = length(st);
    angle += radius * amt;
    vec2 shifted = radius *vec2(cos(angle+time),sin(angle+time));
    return vec2(shifted);
}

vec3 rainbow(float level)
{
    /*
        Target colors
        =============
        
        L  x   color
        0  0.0 vec4(1.0, 0.0, 0.0, 1.0);
        1  0.2 vec4(1.0, 0.5, 0.0, 1.0);
        2  0.4 vec4(1.0, 1.0, 0.0, 1.0);
        3  0.6 vec4(0.0, 0.5, 0.0, 1.0);
        4  0.8 vec4(0.0, 0.0, 1.0, 1.0);
        5  1.0 vec4(0.5, 0.0, 0.5, 1.0);
    */
    
    float r = float(level <= 2.0) + float(level > 4.0) * 0.5;
    float g = max(1.0 - abs(level - 2.0) * 0.5, 0.0);
    float b = (1.0 - (level - 4.0) * 0.5) * float(level >= 4.0);
    return vec3(r, g, b);
}

vec3 smoothRainbow (float x)
{
    float level1 = floor(x*6.0);
    float level2 = min(6.0, floor(x*6.0) + 1.0);
    
    vec3 a = rainbow(level1);
    vec3 b = rainbow(level2);
    
    return mix(a, b, fract(x*6.0));
}

vec3 makePattern(vec2 st) {
    float amt = 1.*sin(u_time*.4);
    float refs = 8.;
    st = kaleidioREF(st,refs);
  st = twirl(st,amt, u_time);
    st = kaleidioREF(st,refs);
    vec3 color = vec3(0.0);
    vec3 comp = vec3(0.0);
    float line = 0.;
    for(int i = 0; i <= 12; i ++){
    float wave = stroke(waver(.1, 3., st.y, u_time),st.x,0.04);
    st = rotate(st, PI/8.*float(i));  
    line += stroke(0.3,st.x, 0.02);
    line += wave;
    }
    //float repeat = fract(u_time*.2);
    float circ =step( length(st)*1.,.1);
    comp += line;
   // comp *=min( 1.-circ,line);
   
    color += comp;
    color.r = sin(20.*st.x-st.y+color.r*TAU);
    color.g += sin(200.*st.x*st.x+color.g*TAU);
   color.b += sin(100.*st.y+color.g*TAU);
   return color;
}
float rhombSDF(vec2 st) {
    return max(triSDF(st), triSDF(vec2(st.x, 1.-st.y)));
}


vec3 makeRhombus(vec2 st){
    vec3 color = vec3(0.);
    float sdf = rhombSDF(st+.5);
    float inc = 0.;
    //color += fill(sdf,.425);
    
    for(float i = .0; i<5.; i+= .3) {
    
    vec2 sdfR = rotate(st,inc+u_time);
    float sdf2 = rhombSDF(sdfR+.5);
   // color += stroke(sdf, .5,.05);
    color += stroke(sdf2, .01+i,.02);
   // color += stroke(sdf2, .0+i,0.03);
    inc += PI/36.;
    }

    return color;;
}

void main(void)
{
    vec2 st = 2.*gl_FragCoord.xy/u_resolution-vec2(1.);
    st.x *= u_resolution.x/u_resolution.y; 
    st.x += 0.1*sin(TAU*st.y+u_time);
    st.y += 0.1*sin(TAU*st.x+u_time);
   vec2 kern = vec2(0.002,0.0);

   vec3 color = vec3(0.);
    
    vec3 finalCol = makeRhombus(st-kern);;
      finalCol += makeRhombus(st+kern);
     finalCol += makeRhombus(st-kern.yx);
     finalCol += makeRhombus(st+kern.yx);
     finalCol += makeRhombus(st+kern.yx);;
    finalCol += makeRhombus(st-kern.yx);;
    finalCol += makeRhombus(st+kern.yx*2.);;
    finalCol += makeRhombus(st-kern.yx*2.);;
    finalCol /= 8.;
    finalCol.g = vec3(rgb2hsb(finalCol-abs(st.y*4.))).r;
    finalCol.r = vec3(rgb2hsb(finalCol-abs(st.x*2.))).b;
   // finalCol += abs(rainbow(st.s));
    //finalCol -= abs(rainbow(st.t));
    gl_FragColor = vec4(finalCol,1.0);
}


