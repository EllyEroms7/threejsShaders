export default /*glsl*/`
uniform mat4 projectionMatrix;
uniform mat4 viewMatrix;
uniform mat4 modelMatrix;
uniform float uAmplitude;
uniform float uTime;

attribute vec3 position;
attribute float points;

varying float v_points;

void main() {

vec4 modelPosition = modelMatrix * vec4(position, 1.0);
modelPosition.y += 2.0 * pow(sin(modelPosition.x * 6.0 + uTime), 2.0) * .15;

v_points = points;
gl_Position = projectionMatrix * viewMatrix * modelPosition;
}`

// void main() {

// vec4 modelPosition = modelMatrix * vec4(position, 1.0);
// modelPosition.z += points;

// v_points = points;
// gl_Position = projectionMatrix * viewMatrix * modelPosition;
// }`
