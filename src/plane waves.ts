import { Timer } from "three/examples/jsm/Addons.js";
import { Init } from "./init";
import * as THREE from "three";
// import GUI from "lil-gui";
import fragmentShader from "./shaders2/fragment.glsl";
import vertexShader from "./shaders2/vertex.glsl";

//wavy plane

/**
 * INITIAL SETUP
 */
const canvas: HTMLCanvasElement | null = document.querySelector("canvas");

let three: Init | null = null;

if (canvas) {
  three = new Init(canvas);
}

three?.render();

three?.light(0.8, {
  x: -3,
  y: 10,
  z: 0,
});
three?.camera.position.set(0, 0, 2);
three?.control();
three?.resize();

/**
 * OBJECT
 */

const planeGeo = new THREE.PlaneGeometry(0.75, 0.75, 64, 64);
const planeMat = new THREE.RawShaderMaterial({
  side: THREE.DoubleSide,
  vertexShader,
  fragmentShader,
  uniforms: {
    uTime: { value: 0 },
    uAmplitude: { value: 12.0 },
    uColour: { value: 0 },
  },
});
const plane = new THREE.Mesh(planeGeo, planeMat);

const quantity = planeGeo.attributes.position.count;
// console.log(quantity);
const points = new Float32Array(quantity);

for (let i = 0; i < points.length; i++) {
  points[i] = Math.random() * 0.2;
}

planeGeo.setAttribute("points", new THREE.BufferAttribute(points, 1));

three?.addToScene(plane);

/**
 * GUI
 */
// const gui = new GUI();

//Timer
const timer = new Timer();
const animate = (timestamp: number) => {
  const delta = three?.setTimer(timer, timestamp);

  //update uTime
  if (delta) {
    planeMat.uniforms.uTime.value = timestamp / 100;
    planeMat.uniforms.uColour.value = timestamp / 100;
  }
  requestAnimationFrame(animate);
};

requestAnimationFrame(animate);
