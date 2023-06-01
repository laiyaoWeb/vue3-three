<template>
  <div class="w-full h-full bg-black/50" ref="viewerRef"></div>
</template>
<script lang='ts' setup>
import { ref, onMounted, Ref } from 'vue';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { GUI } from 'dat.gui';

const { innerWidth, innerHeight } = window;
console.log(innerWidth, innerHeight);

const aspect = innerWidth / innerHeight
const camera = new THREE.PerspectiveCamera(75, aspect, 1, 1000);
camera.position.set( 0, 0, 500 );
const scene = new THREE.Scene()
const renderer = new THREE.WebGLRenderer({
  antialias: true,
});
renderer.setSize(innerWidth, innerHeight);

const geometry = new THREE.BoxGeometry( 100, 100, 100 );
const material = new THREE.MeshLambertMaterial( { color: 0x00ff00, side: THREE.DoubleSide } );
const cube = new THREE.Mesh( geometry, material );

cube.position.set(0, 0, 0);
scene.add( cube );


const line = new THREE.Line(geometry, material);
line.position.set(200, 0, 0);
scene.add( line );

const line2 = new THREE.Line(geometry, material);
line2.position.set(100, 0, 0);
scene.add( line2 );


console.log(camera);
console.log(scene);
const viewerRef: Ref<HTMLDivElement | undefined> = ref<HTMLDivElement>();

// 辅助观察坐标系
const axesHelper = new THREE.AxesHelper(300);
scene.add(axesHelper);

// 
const controls = new OrbitControls(camera, renderer.domElement);
controls.addEventListener('change', function () {
  renderer.render(scene, camera); //执行渲染操作
});//监听鼠标、键盘事件


// 添加点光源
// const sportLight = new THREE.SpotLight(0xffffff, 1.0, 200);
// sportLight.position.set(200, 200, 100);

// let helper = new THREE.SpotLightHelper(sportLight);
// scene.add(helper);


const ambientLight = new THREE.AmbientLight(0xffffff, 0.2); // soft white light
scene.add( ambientLight );

// let ambientLightHelper = new THREE.AmbientLightHelper(ambientLight);
// scene.add(ambientLightHelper);

const geometry02= new THREE.PlaneGeometry( 100, 100, 100, 100 );
const material02 = new THREE.MeshBasicMaterial( {color: 0xffff00, side: THREE.DoubleSide} );
const plane = new THREE.Mesh( geometry02, material02 );

plane.position.set(200, 0, 0)
scene.add( plane );

// onresize 事件会在窗口被调整大小时发生
window.onresize = function () {
  // 重置渲染器输出画布canvas尺寸
  renderer.setSize(window.innerWidth, window.innerHeight);
  // 全屏情况下：设置观察范围长宽比aspect为窗口宽高比
  camera.aspect = window.innerWidth / window.innerHeight;
  // 渲染器执行render方法的时候会读取相机对象的投影矩阵属性projectionMatrix
  // 但是不会每渲染一帧，就通过相机的属性计算投影矩阵(节约计算资源)
  // 如果相机的一些属性发生了变化，需要执行updateProjectionMatrix ()方法更新相机的投影矩阵
  camera.updateProjectionMatrix();
};



const gui = new GUI();
// gui.add(ambientLight, 'intensity', 0, 2.0);
gui.add(cube.position, 'x', 0, 180);
gui.add(cube.position, 'y', 0, 180);
gui.add(cube.position, 'z', 0, 180);

onMounted(() => {
  console.log(viewerRef.value);
  (viewerRef.value as HTMLDivElement).appendChild(renderer.domElement);
});

(function animate() {
  requestAnimationFrame( animate );
  // cube.rotation.x += 0.01;
  // cube.rotation.y += 0.01;
  renderer.render( scene, camera );
})();



</script>
<style>
 
</style>
