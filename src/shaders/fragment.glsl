export default /* glsl */ `
uniform float uTime;

varying vec3 vPosition;
varying vec3 vNormal;
varying vec2 vUv;
varying float vDisplacement;

void main() {

gl_FragColor = vec4(vec2(vDisplacement), 1, 1.0);

} `///
