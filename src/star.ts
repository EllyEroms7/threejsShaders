import { Init } from "./init";
import * as THREE from "three";
import { Timer } from "three/addons/misc/Timer.js";

const canvas: HTMLCanvasElement | null = document.querySelector("canvas");

let three: Init | null = null;
if (canvas) {
  three = new Init(canvas);
}

three?.render();
three?.resize();
three?.control();
three?.light(0.8, { x: -1, y: 2, z: 1 });
three?.camera.position.set(0, 0, 3);

/**
 * PARTICLES
 */
/**There are 3 branches placed at an angle of 120 degrees from each other(360/3)
 * To get the position of particles around a branch i will need a random radius (max:3m)
 * then understanding the position around a circle(x = r*cos(theta))
 * theta will start from 120 * i (trial and error)
 *
 */

//Creating the geometry

const quantity: number = 30000;
const branches: number = 3;
const size = 0.005;
const radius = 10;
const spin = 1;
const randomness = 0.5;
const randomnessPower = 4;
const insideColor = "#ff6030";
const outsideColor = "#1b3984";

const particleGeo: THREE.BufferGeometry = new THREE.BufferGeometry();

const points = new Float32Array(quantity * 3);
const colors = new Float32Array(quantity * 3);

const insideColors = new THREE.Color(insideColor);
const outsideColors = new THREE.Color(outsideColor);

for (let i = 0; i < points.length; i++) {
  const i3 = i * 3;

  //Position
  const randomRadius = Math.random() * radius;

  const branchAngle = ((i % branches) / branches) * Math.PI * 2; //we use % to make the division of i and branches be in 0 and 3

  const randomX =
    Math.pow(Math.random(), randomnessPower) *
    (Math.random() < 0.5 ? 1 : -1) *
    randomness *
    randomRadius;

  const randomY =
    Math.pow(Math.random(), randomnessPower) *
    (Math.random() < 0.5 ? 1 : -1) *
    randomness *
    randomRadius;

  const randomZ =
    Math.pow(Math.random(), randomnessPower) *
    (Math.random() < 0.5 ? 1 : -1) *
    randomness *
    randomRadius;

  points[i3] = Math.cos(branchAngle) * randomRadius * randomX;
  points[i3 + 1] = randomY;
  points[i3 + 2] = Math.sin(branchAngle) * randomRadius + randomZ;

  // Color
  const mixedColor = insideColors.clone();
  mixedColor.lerp(outsideColors, randomRadius / radius);

  colors[i3] = mixedColor.r;
  colors[i3 + 1] = mixedColor.g;
  colors[i3 + 2] = mixedColor.b;
}

particleGeo.setAttribute("color", new THREE.BufferAttribute(colors, 3));
particleGeo.setAttribute("position", new THREE.BufferAttribute(points, 3));

const particleMat: THREE.PointsMaterial = new THREE.PointsMaterial({
  depthTest: true,
  depthWrite: true,
  blending: THREE.AdditiveBlending,
  size: size,
  sizeAttenuation: true,
  vertexColors: true,
});

const particles = new THREE.Points(particleGeo, particleMat);
three?.addToScene(particles);

//Timer
const timer = new Timer();
const animate = (timestamp: number) => {
  const delta = three?.setTimer(timer, timestamp);

  particles.rotation.y += 0.4 * (delta as number);
  requestAnimationFrame(animate);
};

requestAnimationFrame(animate);
