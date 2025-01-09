import { Init } from "./init";
import * as THREE from "three";

import { Timer } from "three/addons/misc/Timer.js";
import vertexShader from "./shaders3/vertex.glsl";
import fragmentShader from "./shaders3/fragment.glsl";
import gsap from "gsap";

//GUI DEBUG

//SOUND VISUALIZER CLASS
class SoundVisualizer {
  private mesh;
  private frequencyUniformName;
  private listener;
  private sound;
  private loader;
  private analyser;
  constructor(mesh: THREE.Mesh, frequencyUniformName: string) {
    //mesh setup
    this.mesh = mesh;
    this.frequencyUniformName = frequencyUniformName;

    //audio listener
    this.listener = new THREE.AudioListener();
    this.mesh.add(this.listener);

    //global audio source
    this.sound = new THREE.Audio(this.listener);
    this.loader = new THREE.AudioLoader();

    // audio analyser
    this.analyser = new THREE.AudioAnalyser(this.sound, 32);

    this.mesh.material.uniforms[this.frequencyUniformName] = { value: 0 };
  }

  public load(path: string) {
    this.loader.load(path, (buffer) => {
      this.sound.setBuffer(buffer);
      this.sound.setLoop(true);
      this.sound.setVolume(0.5);
      this.sound.play();
    });
  }

  public getFrequency(): number {
    return this.analyser.getAverageFrequency();
  }

  public update() {
    const freq = Math.max(this.getFrequency() - 100, 0) / 50;
    const freqUniform = this.mesh.material.uniforms[this.frequencyUniformName];

    gsap.to(freqUniform, {
      duration: 1.5,
      ease: "power2.out",
      value: freq,
      overwrite: true,
    });
    console.log(freq);
  }
}

//Initialize 3d scene

const canvas: HTMLCanvasElement | null = document.querySelector("canvas");
let three: Init | null = null;

if (canvas) {
  three = new Init(canvas);
}

three?.render();
three?.renderer.setClearColor(0x272727);

three?.resize();
three?.control();
three?.camera.position.set(0, 0, 3);

/**
 * OBJECTS
 */

const sphereGeo = new THREE.SphereGeometry(1.2, 64, 64);
const sphereMat = new THREE.ShaderMaterial({
  vertexShader,
  fragmentShader,
  uniforms: {
    uTime: { value: 0 },
  },
});
const sphere = new THREE.Mesh(sphereGeo, sphereMat);
three?.addToScene(sphere);

const wireframe = new THREE.LineSegments(sphereGeo, sphereMat);
wireframe.scale.setScalar(1.005);
sphere.add(wireframe);

/**
 * VISUALIZER
 */
const visualizer = new SoundVisualizer(sphere, "uAudioFreq");
visualizer.load("/music.mp3");

let timer = new Timer();
const animate = (timestamp: number): void => {
  three?.setTimer(timer, timestamp);
  sphereMat.uniforms.uTime.value = timestamp / 1000;
  visualizer.update();
  requestAnimationFrame(animate);
};

requestAnimationFrame(animate);
