<template>
  <div class="fixed bottom-0 left-0 flex h-20 w-full bg-black/[.6] justify-center items-center">
    <button 
      class="btn"
      v-for="(item, index) of btnList" 
      :key="index" 
      @click="clickBtn(item)">
      {{ item.name }}
    </button>
  </div>  
</template>
  
<script setup lang='ts'>
import * as THREE from 'three';
import { reactive, inject } from 'vue'
import ViewEntry from '../modules/ViewEntry';
import { useAnimate } from '../useAnimate'

const viewEntryRef = inject('viewEntryRef') as {
  viewEntry: ViewEntry
};

let glassMesh: THREE.Object3D<THREE.Event>;
let rawGlassMeshPositionY: number = 0


let floorMesh: THREE.Object3D<THREE.Event>;
let rawFloorMeshPositionZ: number = 0

let XAxisMesh: THREE.Object3D<THREE.Event>;
let x: number = 0

let YAxisMesh: THREE.Object3D<THREE.Event>;
let y: number = 0


let ZAxisMesh: THREE.Object3D<THREE.Event>;
let z: number = 0
  

viewEntryRef.viewEntry.scene.traverse((child) => {
  if (child.name === 'glass') {
    glassMesh = child;
    rawGlassMeshPositionY = glassMesh.position.y;
    console.log('rawGlassMeshPositionY: ', rawGlassMeshPositionY);
  }
  if (child.name === 'floor') {
    floorMesh = child;
    rawFloorMeshPositionZ = floorMesh.position.z;
    console.log('rawFloorMeshPositionZ: ', rawFloorMeshPositionZ);
  }

  if (child.name === 'X-axis') {
    XAxisMesh = child;
    x = XAxisMesh.position.x
    console.log('x : ', x );
  }

  if (child.name === 'Y-axis') {
    YAxisMesh = child;
    y = YAxisMesh.position.y
    console.log('y: ', y);
  }

  if (child.name === 'Z-axis') {
    ZAxisMesh = child;
    z = XAxisMesh.position.z
    console.log('z : ', z );
  }
});


//  X-axis
//  Y-axis
//  Z-axis

const glassAnimateObj = useAnimate({ y: rawGlassMeshPositionY }, { y: 8 }, (obj: Record<string, number>) => {
  glassMesh.position.y = obj.y;
});

const xAnimate = useAnimate({ x }, { x: 2 }, (obj: Record<string, number>) => {
  XAxisMesh.position.x = obj.x;
});

const yAnimate = useAnimate({ y }, { y: -1 }, (obj: Record<string, number>) => {
  YAxisMesh.position.y = obj.y;
});

const zAnimate = useAnimate({ z }, { z: 2.1 }, (obj: Record<string, number>) => {
  ZAxisMesh.position.z = obj.z;
});

const threeAxisAnimate =   {
  open: ()=> {
    xAnimate.open();
    yAnimate.open();
    zAnimate.open();
  },
  close: () => {
    xAnimate.close();
    yAnimate.close();
    zAnimate.close();
  }
}


let count = 0;
const LoopAnimate = useAnimate(
  { x , y, z }, 
  {  x: 2, y: -1, z : 2.1,  }, 
  (obj: Record<string, number>
) => {
  XAxisMesh.position.x = obj.x;
  YAxisMesh.position.y = obj.y;
  ZAxisMesh.position.z = obj.z;
}, () => {
  count++;
  setTimeout(() => {
    ((count % 2) === 0 ) ? LoopAnimate.open() : LoopAnimate.close();
  }, 3000)
});


const btnList = reactive([
  { name: 'glassAction开', action: true, type: 'glass', handler: glassAnimateObj.open },
  { name: 'glassAction关', action: false, type: 'glass', handler: glassAnimateObj.close },
  { name: '三轴联动运动', action: true, type: 'floor', handler: threeAxisAnimate.open },
  { name: '三轴联动复位', action: false, type: 'floor', handler: threeAxisAnimate.close },

  { name: '循环运动', action: false, type: 'floor', handler: LoopAnimate.open },
]);

const clickBtn = (item: Record<string, any>) => {
  (typeof item.handler === 'function') && item.handler()
}
</script>
  
<style scoped>
button{
  font-size: 16px;
  padding: 10px 20px;
  border: 1px solid #ccc;
  margin: 0 20px;
}
button + button {
  margin-left: 10px;
}
</style>