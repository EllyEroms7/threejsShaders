export default /*glsl*/`

varying vec2 v_uv;
varying float vr;
uniform float uTime;
uniform float uAudioFreq;

#define PI 3.14159265358979

int windows = 0;
vec2 m = vec2(.7, .8);

float hash(in vec2 p) {
return fract(sin(p.x * 15.32 + p.y * 5.78) * 43758.236237153);
}

vec2 hash2(vec2 p) {
return vec2(hash(p * .754), hash(1.5743 * p.yx + 4.5891)) - .5;
}

// Gabor/Voronoi mix 3x3 kernel (some artifacts for v=1.)
float gavoronoi3(in vec2 p) {

    //time
float time = uTime;

vec2 ip = floor(p);
vec2 fp = fract(p);
float f = 3. * PI;//frequency
float v = 1.;//cell variability <1.
float dv = .0;//direction variability <1.
vec2 dir = vec2(1.3) + sin(time);//vec2(.7,.7);
float va = 0.0;
float wt = 0.0;
for (int i = - 1;
i <= 1;
i ++) for (int j = - 1;
j <= 1;
j ++) {
vec2 o = vec2(i, j) - .5;
vec2 h = hash2(ip - o);
vec2 pp = fp + o;
float d = dot(pp, pp);
float w = exp(- d * 4.);
wt += w;
h = dv * h + dir;//h=normalize(h+dir);
va += cos(dot(pp, h) * f / v) * w;
}
return va / wt;
}

float noise(vec2 p) {
return gavoronoi3(p);
}

float map(vec2 p) {
return 2. * abs(noise(p * 2.));
}

vec3 nor(in vec2 p) {
const vec2 e = vec2(0.1, 0.0);
return - normalize(vec3(map(p + e.xy) - map(p - e.xy), map(p + e.yx) - map(p - e.yx), 1.));
}

void main() {

vec3 light = normalize(vec3(3., 2., - 1.));
float r;
r = dot(nor(uv), light);
vr = r;

//in order to move the vertices we need the direction(position + normal) and the displacement (how far we should push it)

float displacement = clamp(1.0 - r, 0., .1);
vec3 newPosition = position + normal * (displacement + uAudioFreq / 2.0);
gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);
v_uv = uv;
}`