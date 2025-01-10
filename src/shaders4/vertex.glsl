export default /*glsl*/`

varying vec3 vNormal;
varying vec2 vUv;

void main() {
gl_PointSize = 5.0;
gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
vNormal = normal;
vUv = uv;
}
`