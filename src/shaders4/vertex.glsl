export default /*glsl*/`

attribute vec3 torusPoints;
attribute vec3 spherePoints;
attribute vec3 cubePoints;

uniform float morphFactor1;
uniform float morphFactor2;
uniform float morphFactor3;

varying vec3 vNormal;
varying vec2 vUv;
varying vec3 vPosition;

void main() {
// Interpolate between positions
vec3 position1 = mix(torusPoints, cubePoints, morphFactor1);
vec3 position2 = mix(torusPoints, spherePoints, morphFactor2);
vec3 mixedPosition = mix(position1, position2, morphFactor3);

  // Set the point size and position
gl_PointSize = 1.1;
gl_Position = projectionMatrix * modelViewMatrix * vec4(mixedPosition, 1.0);

vPosition = mixedPosition;
vNormal = normal;
vUv = uv;
}
`