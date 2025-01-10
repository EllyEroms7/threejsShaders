import { Init } from "./init";
import * as THREE from "three";
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

three.camera.position.set(0, 0, 2);
// three.cube(1.1, 0xff532f);

/**
 * PARTICLES
 */

const quantity = 7500;
const particleGeo = new THREE.BufferGeometry();

//custom shapes point generation

const radius = 0.7;

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

//CONE
const coneParticles = (
  radius: number,
  height: number,
  particleCount: number,
  baseParticleCount: number
) => {
  // Create a Float32Array with a size for both the cone and base points
  const points = new Float32Array((particleCount + baseParticleCount) * 3);

  // Generate points for the cone
  for (let i = 0; i < particleCount; i++) {
    // Random height along the cone's axis
    const h = Math.random() * height;

    // Scale the radius at this height (linear interpolation from base to tip)
    const r = (1 - h / height) * radius;

    // Generate random polar coordinates
    const phi = Math.random() * Math.PI * 2; // Azimuthal angle [0, 2π]

    // Convert polar coordinates to Cartesian coordinates
    const x = r * Math.cos(phi);
    const z = r * Math.sin(phi);
    const y = h; // Height along the cone's axis

    // Store the coordinates in the Float32Array
    points[i * 3] = x;
    points[i * 3 + 1] = y;
    points[i * 3 + 2] = z;
  }

  // Generate points for the base
  for (let i = 0; i < baseParticleCount; i++) {
    // Random radius within the base circle
    const r = Math.sqrt(Math.random()) * radius; // Square root for uniform distribution
    const phi = Math.random() * Math.PI * 2; // Azimuthal angle [0, 2π]

    // Convert polar coordinates to Cartesian coordinates
    const x = r * Math.cos(phi);
    const z = r * Math.sin(phi);
    const y = 0; // Base is at height 0

    // Store the coordinates in the Float32Array
    const baseIndex = (particleCount + i) * 3;
    points[baseIndex] = x;
    points[baseIndex + 1] = y;
    points[baseIndex + 2] = z;
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

let points = torusParticles(0.7, 0.4, 64, quantity);

particleGeo.setAttribute("position", new THREE.BufferAttribute(points, 3));

const particleMat = new THREE.ShaderMaterial({
  vertexShader,
  fragmentShader,
  transparent: true,
});

const particles = new THREE.Points(particleGeo, particleMat);
three.addToScene(particles);
