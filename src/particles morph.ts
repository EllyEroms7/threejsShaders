import { Init } from "./init";
import * as THREE from "three";
import { Timer } from "three/examples/jsm/Addons.js";
import vertexShader from "./shaders4/vertex.glsl";
import fragmentShader from "./shaders4/fragment.glsl";

//SETUP

const canvas = document.querySelector("canvas");
const three = new Init(canvas as HTMLCanvasElement);

three.render();
three.resize();
three.control();
three.light(1.4, {
  x: -1,
  y: 3,
  z: 0,
});

three.camera.position.set(0, 0, 1.6);

/**
 * PARTICLES
 */
const radius = 0.7;

const quantity = 20000;
const particleGeo = new THREE.BufferGeometry();

//custom shapes point generation

//SPHERE
const sphereParticles = (radius: number, particleCount: number) => {
  // Create a Float32Array with a size of particleCount * 3 (x, y, z for each particle)
  const points = new Float32Array(particleCount * 3);

  for (let i = 0; i < particleCount; i++) {
    // Generate random spherical coordinates
    const r = Math.cbrt(Math.random()) * radius; // Random radius (cube root for uniform distribution)
    const phi = Math.random() * Math.PI * 2; // Azimuthal angle [0, 2π]
    const theta = Math.acos(2 * Math.random() - 1); // Polar angle [0, π]

    // Convert spherical coordinates to Cartesian coordinates
    const x = r * Math.sin(theta) * Math.cos(phi);
    const y = r * Math.sin(theta) * Math.sin(phi);
    const z = r * Math.cos(theta);

    // Store the coordinates in the Float32Array
    points[i * 3] = x;
    points[i * 3 + 1] = y;
    points[i * 3 + 2] = z;
  }

  return points;
};

//CUBE
const cubeParticles = (radius: number, particleCount: number) => {
  const points = new Float32Array(particleCount * 3);
  for (let i = 0; i < particleCount * 3; i++) {
    const x = Math.random() * 2 * radius - radius;
    const y = Math.random() * 2 * radius - radius;
    const z = Math.random() * 2 * radius - radius;
    points[i] = x;
    points[i + 1] = y;
    points[i + 2] = z;
  }
  return points;
};

//Torus
const torusParticles = (
  radius: number,
  tubeRadius: number,
  knotComplexity: number,
  particleCount: number
) => {
  const points = new Float32Array(particleCount * 3);

  // Create the TorusKnot geometry
  const geometry = new THREE.TorusKnotGeometry(
    radius,
    tubeRadius,
    knotComplexity,
    knotComplexity
  );

  // Access the position attribute
  const positionAttribute = geometry.attributes
    .position as THREE.BufferAttribute;

  // Generate points within the torus knot
  for (let i = 0; i < particleCount; i++) {
    // Random parameter for the radial angle (theta)
    const theta = Math.random() * Math.PI * 2;

    // Random parameter for the vertical angle (phi) within the tube
    const phi = Math.random() * Math.PI * 2;

    // Convert to 3D position using the parametric equations for a torus knot
    const x =
      (radius + tubeRadius * Math.cos(knotComplexity * theta)) * Math.cos(phi);
    const y =
      (radius + tubeRadius * Math.cos(knotComplexity * theta)) * Math.sin(phi);
    const z = tubeRadius * Math.sin(knotComplexity * theta);

    // Push the computed point to the points array
    points[i * 3] = x;
    points[i * 3 + 1] = y;
    points[i * 3 + 2] = z;
  }

  return points;
};

const torusPoints = torusParticles(radius, 0.4, 64, quantity * 4);
const cubePoints = cubeParticles(radius, quantity * 7);
const spherePoints = sphereParticles(radius * 1.5, quantity * 2);

particleGeo.setAttribute(
  "torusPoints",
  new THREE.BufferAttribute(torusPoints, 3)
);

particleGeo.setAttribute(
  "spherePoints",
  new THREE.BufferAttribute(spherePoints, 3)
);

particleGeo.setAttribute(
  "cubePoints",
  new THREE.BufferAttribute(cubePoints, 3)
);

particleGeo.setAttribute("position", new THREE.BufferAttribute(torusPoints, 3));

const particleMat = new THREE.ShaderMaterial({
  vertexShader,
  fragmentShader,
  uniforms: {
    morphFactor1: { value: 0.0 }, // Interpolation factor between torus and cube
    morphFactor2: { value: 0.0 }, // Interpolation factor between cube and sphere
    morphFactor3: { value: 0.0 }, // Interpolation factor between sphere and cone
    time: { value: 0.0 },
  },
  transparent: true,
});

particleMat.depthWrite = false; // Disable writing to the depth buffer
particleMat.depthTest = true; // Enable depth testing
particleMat.blending = THREE.AdditiveBlending; // Use additive blending for glowing effect
particleMat.side = THREE.DoubleSide; // Render both sides of the particles

const particles = new THREE.Points(particleGeo, particleMat);
three.addToScene(particles);

/**
 * CAMERA CONTROLLER
 */
const cube = three.cube(0.1, 0xffffff, 0);
const camera = three.camera;
cube.add(camera);

// Animation Loop
let morphFactor1 = 0.0;
let morphFactor2 = 0.0;
let morphFactor3 = 0.0;

let morphDirection1 = 1;
let morphDirection2 = 1;
let morphDirection3 = 1;

let currentMorph = 1; // Current morph stage (1, 2, or 3)
let delayTime = 1200; // Delay in milliseconds
let lastSwitchTime = Date.now();

const timer: Timer = new Timer();
const animate = (timestamp: number) => {
  requestAnimationFrame(animate);
  const delta = three.setTimer(timer, timestamp);

  let currentTime = Date.now();
  if (currentTime - lastSwitchTime > delayTime) {
    three.renderer.render(three.scene, three.camera);
    lastSwitchTime = currentTime;
  }

  // Update morph factors based on the current morph stage
  if (currentMorph === 1) {
    morphFactor1 += morphDirection1 * 0.01;

    if (morphFactor1 >= 1.0 || morphFactor1 <= 0.0) {
      morphDirection1 *= -1; // Reverse direction
      currentMorph = 2; // Move to the next morph stage
      lastSwitchTime = currentTime; // Reset the delay timer
    }
  } else if (currentMorph === 2) {
    morphFactor2 += morphDirection2 * 0.01;
    if (morphFactor2 >= 1.0 || morphFactor2 <= 0.0) {
      morphDirection2 *= -1; // Reverse direction
      currentMorph = 3; // Move to the next morph stage
      lastSwitchTime = currentTime; // Reset the delay timer
    }
  } else if (currentMorph === 3) {
    morphFactor3 += morphDirection3 * 0.01;

    if (morphFactor3 >= 1.0 || morphFactor3 <= 0.0) {
      morphDirection3 *= -1; // Reverse direction
      currentMorph = 1; // Loop back to the first morph stage
      lastSwitchTime = currentTime; // Reset the delay timer
    }
  }

  //assign the values to the shaders on every frame
  particleMat.uniforms.morphFactor1.value = morphFactor1;
  particleMat.uniforms.morphFactor2.value = morphFactor2;
  particleMat.uniforms.morphFactor3.value = morphFactor3;
  particleMat.uniforms.time.value += delta * 0.3;

  // particles.rotation.y += delta * 0.3 * 0.31;
  // particles.rotation.x += (Math.random() - 0.5) * delta * 0.3 * 0.31;
  // particles.rotation.z += delta * 1.5 * 0.31;

  cube.rotation.y += delta * 0.2;
  cube.rotation.x -= delta * 0.3;
};

requestAnimationFrame(animate);
