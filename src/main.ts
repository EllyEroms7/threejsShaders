import { Timer } from "three/examples/jsm/Addons.js";
import { Init } from "./init";
import * as THREE from "three";
// import GUI from "lil-gui";
// import fragmentShader from "./shaders/fragment.glsl";
// import vertexShader from "./shaders/vertex.glsl";

//Organic ball

/**
 * INITIAL SETUP
 */
const canvas: HTMLCanvasElement | null = document.querySelector("canvas");

let three: Init | null = null;

if (canvas) {
  three = new Init(canvas);
}

three?.render();
three?.renderer.setClearColor(0x0000f);

three?.light(0.8, {
  x: -3,
  y: 10,
  z: 0,
});
three?.camera.position.set(0, 0, 4);
three?.control();
three?.resize();

/**
 * OBJECT
 */
const icoGeo = new THREE.IcosahedronGeometry(1, 120);
const icoMat = new THREE.MeshStandardMaterial({
  onBeforeCompile: (shader: any) => {
    icoMat.userData.shader = shader;
    shader.uniforms.uTime = { value: 0 };
  },
});

// icoMat.uniforms.uTime = { value: 0 };

const ico = new THREE.Mesh(icoGeo, icoMat);
three?.addToScene(ico);

/**
 * GUI
 */
// const gui = new GUI();

let timer: Timer = new Timer();
const animate = (timestamp: number) => {
  requestAnimationFrame(animate);
  timer = timer.update(timestamp);
  // const delta = timer.getDelta();

  icoMat.userData.shader.uniforms.uTime.value = timestamp / 1000;
};
requestAnimationFrame(animate);
