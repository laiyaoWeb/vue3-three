import * as THREE from "three";

export default class ThreeLight {

  private lightMap: Map<number, THREE.PointLight> = new Map<number, THREE.PointLight>();
  public scene: THREE.Scene;

  constructor(scene: THREE.Scene) {
    this.scene = scene
    this.init()
  }

  init() {
    let spotLight = new THREE.SpotLight(0xffffff, 1)
    spotLight.position.set(0, 800, -800)
    spotLight.angle = 104.05
    spotLight.penumbra = 0.05
    spotLight.decay = 3
    spotLight.distance = 1000000
    spotLight.castShadow = true
    spotLight.intensity = 0.5
    let spotLightHelper = new THREE.SpotLightHelper(spotLight)
    spotLightHelper.visible = false
    this.scene.add(spotLight);
    this.scene.add(spotLightHelper);

    const ambientLight = new THREE.AmbientLight(0x444444, 2); // soft white light
    this.scene.add( ambientLight );
  }

  createPointerLight(key:number, x: number, y: number, z: number ) {
    const pointLight = new THREE.PointLight(0xffffff, 0.5, 120, 3 );
    pointLight.position.set(x, y, z);
    pointLight.castShadow = true;
    this.lightMap.set(key, pointLight)
    pointLight.decay = 0.1

    let helper = new THREE.PointLightHelper(pointLight);
    this.scene.add(helper);
  }


  addLight(key: number) {
    const light = this.lightMap.get(key);
    if (light) {
      this.scene.add(light);
    }
  }

  removeLight(key: number) {
    const light = this.lightMap.get(key);
    if (light) {
      this.scene.remove(light);
    }
  }

 

}