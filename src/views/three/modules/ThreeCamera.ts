import * as THREE from "three"

export default class ThreeCamera {
  
  public camera: THREE.PerspectiveCamera

  constructor(renderer: THREE.WebGLRenderer) {

    const { innerWidth, innerHeight } = window

    // Create and position a Perspective Camera
    this.camera = new THREE.PerspectiveCamera(
      45,
      innerWidth / innerHeight,
      1,
      2000
    )
    this.camera.position.set(0, 0, 0);
    this.updateSize(renderer)
  }

  updateSize(renderer: THREE.WebGLRenderer) {
    this.camera.aspect = renderer.domElement.width / renderer.domElement.height
    this.camera.updateProjectionMatrix()
  }
}