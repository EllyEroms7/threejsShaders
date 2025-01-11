import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/Addons.js";
import { Timer } from "three/addons/misc/Timer.js";

/**
 * Initializes the Three.js scene.
 */

interface Position {
  x: number;
  y: number;
  z: number;
}
export class Init {
  /**
   * The width of the canvas.
   */
  private width: number;

  /**
   * The height of the canvas.
   */
  private height: number;

  /**
   * The Three.js scene.
   */
  scene: THREE.Scene;

  /**
   * RENDERER
   */
  renderer: THREE.WebGLRenderer;

  /**
   * CANVAS
   */
  private canvas: HTMLCanvasElement;
  /**
   * CAMERA
   */
  camera: THREE.PerspectiveCamera;

  /**
   * CONTROLS
   */
  private controls?: OrbitControls;

  /**
   * Initializes the scene with the current window dimensions.
   */
  constructor(canvas: HTMLCanvasElement) {
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.canvas = canvas;

    //basic scene
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(
      75,
      this.width / this.height,
      0.1,
      1000
    );
    this.scene.add(this.camera);

    //rendering
    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      antialias: true,
    });
    this.renderer.setSize(this.width, this.height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  }

  /**
   * Gets the canvas.
   */
  public getCanvas(): HTMLCanvasElement {
    return this.canvas;
  }

  /**
   * Gets the width of the canvas.
   */
  public getWidth(): number {
    return this.width;
  }

  /**
   * Gets the height of the canvas.
   */
  public getHeight(): number {
    return this.height;
  }

  public control(): void {
    this.controls =
      this.controls ?? new OrbitControls(this.camera, this.canvas);
    this.controls.enableDamping = true;
  }

  //create a test cube
  public cube(
    size: number,
    colour: THREE.ColorRepresentation,
    opacity: number = 1
  ): THREE.Mesh {
    const cubeGeo = new THREE.BoxGeometry(size, size, size);
    const cubeMat = new THREE.MeshStandardMaterial({
      color: colour,
      metalness: 0.3,
      roughness: 0.5,
      transparent: true,
      opacity: opacity,
    });
    const cube = new THREE.Mesh(cubeGeo, cubeMat);
    this.scene.add(cube);
    return cube;
  }

  //create light
  public light(intensity: number, position: Position): void {
    const ambientLight = new THREE.AmbientLight(0xffffff, 1);
    const light = new THREE.DirectionalLight(0xffffff, intensity);
    light.position.set(position.x, position.y, position.z);
    this.scene.add(light, ambientLight);
  }

  //add to scene
  public addToScene(object: THREE.Object3D): void {
    this.scene.add(object);
  }

  public resize(): void {
    window.addEventListener("resize", () => {
      this.width = window.innerWidth;
      this.height = window.innerHeight;
      this.camera.aspect = this.width / this.height;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(this.width, this.height);
      this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    });
  }

  public setTimer(timer: Timer, timestamp: number): number {
    let delta = timer.update(timestamp).getDelta();
    return delta;
  }

  public render(): void {
    this.renderer.render(this.scene, this.camera);
    this.controls?.update();
    requestAnimationFrame(this.render.bind(this));
  }
}
