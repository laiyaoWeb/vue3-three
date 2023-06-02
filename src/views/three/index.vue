<template>
  <div class="view-container" ref="viewContainer"></div>
  <controlPanel v-if="isLoad" />
  <formView />
</template>

<script setup lang="ts">
import { ref, shallowRef, provide, onMounted, onUnmounted, reactive } from 'vue'
import ViewEntry from './modules/ViewEntry'
import * as THREE from 'three';
import { GLTF } from 'three/examples/jsm/loaders/GLTFLoader';
import controlPanel from './components/control-panel.vue'
import formView from './components/form.vue'

const viewEntryRef: any = shallowRef(null);
const isLoad = ref(false)

let viewContainer = ref(null)
let viewEntry: ViewEntry;
const objData = reactive<{ viewEntry: ViewEntry | null }>({
  viewEntry: null 
})
provide('viewEntryRef', objData);
onMounted(async () => {
  viewEntry = new ViewEntry(viewContainer.value!);
  objData.viewEntry = viewEntry as ViewEntry
  viewEntryRef.value = viewEntry;

  const gltf: GLTF = await viewEntry.threeLoader.GLTFLoaders('/model/xyz520.gltf')
  console.log('gltf', gltf);
  const gltfScene: THREE.Group = gltf.scene
  const box: THREE.Box3 = new THREE.Box3().setFromObject(gltfScene);
  // let helper = new THREE.Box3Helper(box, new THREE.Color(0, 255, 0));
  let size = box.getSize(new THREE.Vector3());
  console.log('size: ', size);

  const x = (box.max.x - box.min.x)
  const y = (box.max.y - box.min.y)
  const z = (box.max.z - box.min.z)

  console.log('x: ' + x + ', y: '+ y + ', z: ' + z)

  gltfScene.scale.set(10, 10, 10);
  viewEntry.animations = gltf.animations;
  viewEntry.mixer = new THREE.AnimationMixer(gltf.scene);
  console.log('gltfScene', gltfScene);
  console.log('gltf.animations:', gltf.animations)
  gltfScene.traverse((child: THREE.Object3D) => {
    child.receiveShadow = true;
    console.log('child.name: ', child.name);
    if (['glass', 'floor' ].includes(child.name)) {
      viewEntry.addOutLine(child)
    }
  });

  // viewEntry.animationPaly(['glassAction'], 1, THREE.LoopOnce, true);
  isLoad.value = true;
});

onUnmounted(() => {
  console.log('unmounted');
  viewEntry.clearCache();
});
</script>

<style scoped>
.view-container {
  position: fixed;
  width: 100%;
  height: 100%;
  right: 0;
  top: 0;
}
</style>
