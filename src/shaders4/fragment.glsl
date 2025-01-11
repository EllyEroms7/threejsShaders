export default /*glsl*/`

varying vec3 vNormal;
varying vec2 vUv;
varying vec3 vPosition;

uniform float morphFactor3;
uniform float time;

void main() {

// Generate gradient colours using sine and cosine waves
float r = 0.5 + 0.5 * sin(vUv.x * 10.0 + time); // Red channel oscillates with x-position
float g = 0.5 + 0.5 * cos(vUv.y * 10.0 + time); // Green channel oscillates with y-position
float b = 0.5 + 0.5 * sin(vUv.x * 10.0 + vUv.y * 10.0 + morphFactor3); // Blue channel based on UV

 // Combine the channels into a final colour
vec3 colour = vec3(r, g, b);

  // Set the fragment colour
gl_FragColor = vec4(colour, 1.0);
}
`