export default /*glsl*/`
precision highp float;
varying float vr;
varying vec2 v_uv;

uniform float uTime;
uniform float uAudioFreq;

struct Colour {
vec3 c;
float position; // Range: 0 -> 1
};

// Function to simulate a Blender-like colour ramp
vec3 getColourRamp(Colour inputColour[4], int len, float inputPosition) {
int index = 0;

    // Find the appropriate range for interpolation
for (int i = 0;
i < len - 1;
i ++) {
Colour currentColour = inputColour[i];
Colour nextColour = inputColour[i + 1];

bool pointsExist = currentColour.position <= inputPosition && inputPosition <= nextColour.position;

if (pointsExist) {
index = i;
break;
}
}

Colour currentColour = inputColour[index];
Colour nextColour = inputColour[index + 1];

vec3 c1 = currentColour.c;
vec3 c2 = nextColour.c;

float range = nextColour.position - currentColour.position;
float lerpFactor = (inputPosition - currentColour.position) / range;

return mix(c1, c2, lerpFactor);
}

void main() {
vec3 colour;
float time = uTime * (1.0 + uAudioFreq) * 10.0;

vec3 mainColour = mix(vec3(1.0, 1.0, 1.0), vec3(1), uAudioFreq);

mainColour.rgb = vec3(0.8 + 0.2 * sin(time + 0.0),   // Red channel oscillates between 0.8 and 1.0
0.1 + 0.1 * sin(time + 0.0),   // Green channel oscillates between 0.1 and 0.2 (adds a subtle orange tint)
0.0                            // Blue stays at 0
);

// mainColour.rgb += 0.1;

Colour colours[4] = Colour[](Colour(vec3(0.0, 0.0, 0.0), 0.0), Colour(vec3(0.4, 0.0, 0.0), 0.01), Colour(mainColour, 0.1), Colour(vec3(1.0, 0.5, 0.0), 1.0));

colour = getColourRamp(colours, 4, vr);
gl_FragColor = vec4(colour, 1.0);
}`