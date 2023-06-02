import * as THREE from "three";


export default class ThreeGround {

  public scene: THREE.Scene;

  constructor(scene: THREE.Scene) {
    this.scene = scene;
    this.addGround();
  }
  
  addGround() {
    const floor: THREE.Mesh = new THREE.Mesh(
      new THREE.BoxGeometry(500, 500, 0.1),
      new THREE.MeshBasicMaterial({
        color: 0xffffff,
        depthWrite: true,
      })
    );
    floor.rotation.x = -Math.PI / 2;
    floor.position.y = -2;
    floor.receiveShadow = true;
    this.scene.add(floor);

    // 网格
    const grid = new THREE.GridHelper(500, 20, 0x000000, 0x000000);
    // @ts-ignore
    grid.material.opacity = 0.2;
    // @ts-ignore
    grid.material.transparent = true;
    grid.position.y = -1;
    this.scene.add(grid);
    
    // console.log('grid: ' + grid)
  }
}