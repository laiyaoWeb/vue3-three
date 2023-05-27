import * as THREE from "three";
import EventManager from "./EventManager";
import ThreeLight from "./ThreeLight";
import ThreeCamera from "./ThreeCamera";
import ThreeLoader from "./ThreeLoader";
import ThreeControls from "./ThreeControls";
import ThreeGround from "./ThreeGround";
import TWEEN from "@tweenjs/tween.js"
import { Color } from "three";
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js'
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js'
import { OutlinePass } from 'three/examples/jsm/postprocessing/OutlinePass.js'
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js';
import { FXAAShader } from 'three/examples/jsm/shaders/FXAAShader.js'

import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader';

export default class ViewEntry {

  public dom: HTMLElement;
  public scene: THREE.Scene;
  public camera: THREE.PerspectiveCamera;
  public renderer: THREE.WebGLRenderer;

  public mixer: THREE.AnimationMixer;
  public clock: THREE.Clock
  public composer: EffectComposer
  public outlinePass: OutlinePass
  public threeLight: ThreeLight
  public threeControls: ThreeControls
  public animations: THREE.AnimationClip[] = []
  public threeLoader: ThreeLoader

  constructor(dom: HTMLElement) {
    this.dom = dom;
    this.scene = new THREE.Scene();
    // this.scene.background = new THREE.Color('black')
    this.renderer = new THREE.WebGLRenderer({ 
      antialias: true,
      alpha: true,

    });
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setSize(dom.offsetWidth, dom.offsetHeight);
    this.renderer.shadowMap.enabled = true;
    this.dom.appendChild(this.renderer.domElement);

    this.camera = new THREE.PerspectiveCamera( 45, dom.offsetWidth / dom.offsetHeight, 1, 2000 );
		this.camera.position.set( 100, 200, 300 );

     // 光线
    this.threeLight = new ThreeLight(this.scene)
    // 加载器
    this.threeLoader = new ThreeLoader(this.scene, this.renderer)
    
    this.composer = new EffectComposer(this.renderer)
    this.outlinePass = new OutlinePass(
      new THREE.Vector2(dom.offsetWidth, dom.offsetHeight),
      this.scene,
      this.camera
    )
    this.mixer = new THREE.AnimationMixer(new THREE.Object3D());
    this.clock = new THREE.Clock();
    this.threeControls = new ThreeControls(this.renderer.domElement, this.camera, this.renderer)
    this.init();
  }

  async init() {
    // 场景背景颜色
    // this.scene.background = new Color(0xffffff)
    // 场景烟雾效果
    // this.scene.fog = new THREE.Fog(0xa0a0a0, 200, 1000);
    
    new ThreeGround(this.scene)
    const pmremGenerator = new THREE.PMREMGenerator(this.renderer); // 使用hdr作为背景色
    pmremGenerator.compileEquirectangularShader();

    const scene = this.scene;
    new RGBELoader().load('/environment/footprint_court_2k.hdr', (texture) => {
        const envMap = pmremGenerator.fromEquirectangular(texture).texture;
        // envMap.isPmremTexture = true;
        pmremGenerator.dispose();
        scene.environment = envMap; // 给场景添加环境光效果
        // scene.background = envMap; // 给场景添加背景图
    });
    

    new EventManager({
      dom: this.renderer.domElement,
      scene: this.scene,
      camera: this.camera,
      renderer: this.renderer,
      outlinePass: this.outlinePass
    });
    
    this.useEffectComposer();
    this.animate();

    this.useAxesHelper();
  }

  useAxesHelper() {
    const axesHelper = new THREE.AxesHelper(300);
    axesHelper.position.x = 10;
    this.scene.add(axesHelper);
  }

  useEffectComposer() {
    const renderPass = new RenderPass(this.scene, this.camera)
    this.composer.addPass(renderPass)
    this.outlinePass.visibleEdgeColor.set('#00a426')
    this.outlinePass.hiddenEdgeColor.set('#4d4542')
    this.outlinePass.edgeStrength = 5 // 强度
    this.outlinePass.edgeGlow = 2     // 微光强度
    this.outlinePass.edgeThickness = 1 // 浓度
    this.outlinePass.pulsePeriod = 2  // 闪烁频率,默认0,值越大频率越低
    this.composer.addPass(this.outlinePass)

    // 去掉锯齿
    const FXAAShaderPass = new ShaderPass(FXAAShader);
    FXAAShaderPass.uniforms['resolution'].value.set(1 / window.innerWidth, 1 / window.innerHeight);
    FXAAShaderPass.renderToScreen = true;
    this.composer.addPass(FXAAShaderPass);
  }

  animationPaly(names: string | string[], timeScale: number = 1, loop: THREE.AnimationActionLoopStyles = THREE.LoopRepeat, clampWhenFinished: boolean = false) {
    let arr: string[] = [];
    if (typeof names === "string") {
      arr.push(names)
    } else if (Array.isArray(names)) {
      arr = names;
    }
    arr.forEach(name =>{
      const animation = this.animations.find(animation => animation.name == name);
      if (animation) {
        let animationAction = this.mixer.clipAction(animation);
        animationAction.timeScale = timeScale
        animationAction.loop = loop;
        animationAction.clampWhenFinished = clampWhenFinished;
        animationAction.play()
      }
    })
  }

  animationStop(names: string | string[]) {
    let arr: string[] = [];
    if (typeof names === "string") {
      arr.push(names)
    } else if (Array.isArray(names)) {
      arr = names;
    }
    arr.forEach(name =>{
      const animation = this.animations.find(animation => animation.name == name);
      if (animation) {
        let animationAction = this.mixer.clipAction(animation);
        animationAction.stop()
      }
    })
  }

  addOutLine(object: THREE.Object3D |  THREE.Object3D[]) {
    if (Array.isArray(object)) {
      this.outlinePass.selectedObjects = [...this.outlinePass.selectedObjects, ...object];
    } else {
      this.outlinePass.selectedObjects.push(object)
    }
  }

  animate() {
    const delta = this.clock.getDelta();
    if (this.mixer) this.mixer.update(delta);
    this.composer.render(delta);
    this.threeControls.controls.update();
    TWEEN.update();
    requestAnimationFrame(this.animate.bind(this));
  }

  clearCache() {
    THREE.Cache.clear();  
    this.renderer.dispose();  
    this.renderer.forceContextLoss(); 
  }

  addScene(object: THREE.Object3D) {
    this.scene.add(object);
  }
  
  removeScene(object: THREE.Object3D) {
    this.scene.remove(object);
  }

}
