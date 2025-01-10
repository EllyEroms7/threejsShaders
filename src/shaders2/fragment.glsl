export default /*glsl*/`

precision mediump float;

varying float v_points;
uniform float uColour;

void main() {
gl_FragColor = vec4(1.0, 1.0, 1.0, 1.0);
gl_FragColor.r = 1.0 + sin(uColour);
gl_FragColor.g = cos(uColour);
gl_FragColor.b = - sin(uColour);

}`