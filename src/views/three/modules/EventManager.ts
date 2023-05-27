import * as THREE from "three";
import { Intersection, Object3D } from "three";
import { OutlinePass } from 'three/examples/jsm/postprocessing/OutlinePass.js'

interface EventManagerOptions {
  dom: HTMLElement;
  scene: THREE.Scene;
  camera: THREE.PerspectiveCamera;
  renderer: THREE.WebGLRenderer;
  outlinePass: OutlinePass
}

export default class EventManager extends THREE.EventDispatcher {

  private dom: HTMLElement;
  private scene: THREE.Scene;
  private camera: THREE.PerspectiveCamera;
  private pointer: THREE.Vector2 = new THREE.Vector2();
  private raycaster: THREE.Raycaster = new THREE.Raycaster();
  private renderer: THREE.WebGLRenderer;
  private outlinePass: OutlinePass

  constructor ({dom, scene, camera, renderer, outlinePass}: EventManagerOptions) {
    super();
    this.dom = dom;
    this.scene = scene;
    this.camera = camera;
    this.renderer = renderer;
    this.outlinePass = outlinePass;

    this.addRegistrationListener();
  }

  addRegistrationListener() {
    this.dom.addEventListener('pointerdown', this.onPointerdown.bind(this));
    this.dom.addEventListener('pointermove', this.onPointermove.bind(this));
    this.dom.addEventListener('pointerup', this.onPointerup.bind(this));
    this.dom.addEventListener('click', this.onClick.bind(this));

    window.addEventListener("resize", this.onWindowResize.bind(this));
  }

  onPointerdown(event: PointerEvent) {
    // this.eventHandler('pointerdown', event);
  }

  onPointermove(event: PointerEvent) {
    // 将鼠标位置归一化为设备坐标。x 和 y 方向的取值范围是 (-1 to +1)
    this.pointer.x = ( event.clientX / window.innerWidth ) * 2 - 1;
	  this.pointer.y = - ( event.clientY / window.innerHeight ) * 2 + 1;

    // intersects.forEach(obj => (obj.object.material as THREE.MeshStandardMaterial).color.set( 0xff0000 ))

  }

  onPointerup(event: PointerEvent) { 
    // this.eventHandler('pointerUp', event);
  }

  onClick(event: MouseEvent) {
    this.eventHandler('click', event);
  }

  eventHandler(eventType: string, event: any): void {
    // 通过摄像机和鼠标的位置更新射线
    this.raycaster.setFromCamera(this.pointer, this.camera);
    // 计算物体和射线的焦点
    const intersects: Intersection[] = this.raycaster.intersectObjects(this.scene.children);
    
    if (intersects.length) {
      // this.outlinePass.selectedObjects = [intersects[0].object];
      const object = intersects[0].object;
      object.dispatchEvent({ type: eventType, event });
    }
  }

  onWindowResize() {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }
}