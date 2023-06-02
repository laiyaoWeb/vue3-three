
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import Stats from "three/examples/jsm/libs/stats.module.js";

export default class ThreeControls {

  public dom: HTMLElement
  public camera: THREE.PerspectiveCamera
  public renderer: THREE.WebGLRenderer
  public controls: OrbitControls

  constructor(dom: HTMLElement, camera: THREE.PerspectiveCamera, renderer: THREE.WebGLRenderer) {
    this.dom = dom;
    this.camera = camera;
    this.renderer = renderer;
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.addControls();
    this.addStats();
  }

  addControls() {
    this.controls.target.set(0, 0, 0);
    this.controls.minDistance = 10;
    this.controls.maxDistance = 10000;
    this.controls.update();
  }

  addStats() {
    this.dom.appendChild(new Stats().dom);
  }

  
  
}