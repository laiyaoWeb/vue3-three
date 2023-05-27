import * as THREE from "three";
import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader.js";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader";
// import { SVGLoader, SVGResult } from "three/examples/jsm/loaders/SVGLoader";
import { GLTFLoader, GLTF } from "three/examples/jsm/loaders/GLTFLoader.js";
import { KTX2Loader } from 'three/examples/jsm/loaders/KTX2Loader.js';
// @ts-ignore
import { MeshoptDecoder } from 'three/examples/jsm/libs/meshopt_decoder.module.js';

import { NOOP } from '@/utils/index'

const MANAGER = new THREE.LoadingManager();
// const THREE_PATH = `https://unpkg.com/three@0.${THREE.REVISION}.x`
const DRACO_LOADER = new DRACOLoader( MANAGER ).setDecoderPath( `/libs/draco/gltf/` );
const KTX2_LOADER = new KTX2Loader( MANAGER ).setTranscoderPath( `/libs/basis/` );

export default class ThreeLoader {
  public gltfLoader: GLTFLoader
  public fbxLoader: FBXLoader
  public textureLoader: THREE.TextureLoader
  public scene: THREE.Scene
  public renderer: THREE.WebGLRenderer

  constructor(scene: THREE.Scene, renderer: THREE.WebGLRenderer) {
    this.scene = scene
    this.renderer = renderer
    this.fbxLoader = new FBXLoader();
    this.gltfLoader = new GLTFLoader( MANAGER )
    .setCrossOrigin('anonymous')
    .setDRACOLoader( DRACO_LOADER )
    .setKTX2Loader( KTX2_LOADER.detectSupport( this.renderer ) )
    .setMeshoptDecoder( MeshoptDecoder );
    this.textureLoader = new THREE.TextureLoader();
  }

  public async GLTFLoaders(
    url: string, 
    onProgress: (event: ProgressEvent) => void = NOOP, 
    onError: (event: ErrorEvent) => void = NOOP
  ): Promise<GLTF> {
      // 定义解析加载器
    // const dracoLoader = new DRACOLoader();
    // dracoLoader.setDecoderPath('/draco/gltf/'); // 存放draco文件的路径
    // // dracoLoader.preload();
    // this.gltfLoader.setDRACOLoader(dracoLoader)

    const objects: GLTF = await new Promise((resolve, reject) => {
      this.gltfLoader.load(url,  ( gltf: GLTF ) => {
        this.scene.add(gltf.scene)
        resolve(gltf)
      }, 
      (event: ProgressEvent) => {
       onProgress(event)
      },
      (event: ErrorEvent) => {
        reject(event)
      })
    });

    return objects;
  }

  public async FBXLoaders(url: string): Promise<THREE.Object3D> {
    const objects: THREE.Group = await new Promise((resolve, reject) => {
      this.fbxLoader.load(url, (objects) => {  
        this.scene.add(objects)
        resolve(objects)
      })
    })
    return objects
  }

  async textureLoaders(url: string): Promise<THREE.Texture> {
    const texture: THREE.Texture = await new Promise(resolve => {
      this.textureLoader.load(url, (texture: THREE.Texture) => {
        resolve(texture)
      });
    });
    return texture;
  }

  // async loadSVG( url: string ): Promise<THREE.Group> {
  //   const loader = new SVGLoader();
  //   const data: SVGResult = await loader.loadAsync( url )
  //     const paths = data.paths;
  //     const group = new THREE.Group();
  //     group.scale.multiplyScalar( 0.008 );
  //     // group.position.set(34, 68, 72)
  //     // group.rotation.y = Math.PI / 2;
  //     console.log(paths)
  //     for ( let i = 0; i < paths.length; i ++ ) {
  //       const path = paths[ i ];
  //       const fillColor = path.userData.style.fill;
  //       const material01 = new THREE.MeshBasicMaterial( {
  //         color: new THREE.Color().setStyle( fillColor ).convertSRGBToLinear(),
  //         opacity: path.userData.style.fillOpacity,
  //         transparent: true,
  //         side: THREE.DoubleSide,
  //         depthWrite: false,
  //         wireframe: false
  //       });

  //       const shapes = SVGLoader.createShapes( path );
  //       for ( let j = 0; j < shapes.length; j ++ ) {
  //         const shape = shapes[ j ];
  //         const geometry = new THREE.ShapeGeometry( shape );
  //         const mesh = new THREE.Mesh( geometry, material01 );
  //         group.add( mesh );
  //       }

  //       const strokeColor = path.userData.style.stroke;
  //       const material = new THREE.MeshBasicMaterial( {
  //         color: new THREE.Color().setStyle( strokeColor ).convertSRGBToLinear(),
  //         opacity: path.userData.style.strokeOpacity,
  //         transparent: true,
  //         side: THREE.DoubleSide,
  //         depthWrite: false,
  //         wireframe: false
  //       } );

  //       for ( let j = 0, jl = path.subPaths.length; j < jl; j ++ ) {
  //         const subPath = path.subPaths[ j ];
  //         const geometry = SVGLoader.pointsToStroke( subPath.getPoints(), path.userData.style );
  //         if ( geometry ) {
  //           const mesh = new THREE.Mesh( geometry, material );
  //           group.add( mesh );
  //         }
  //       }
  //     }
  //     this.scene.add(group)
  //     return group
  // }
}