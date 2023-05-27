<template>
  <teleport to="body">
    <transition name="fade">
      <div class="loading-container">
        <div class="loading-wrap">
          <img :src="loadingImage" alt="loading image" />
          <p class="loading-txt">3D模型构建中，请稍后<span>{{pointer}}</span></p>
        </div>
      </div>
    </transition>  
  </teleport>
</template>

<script lang="ts" setup>
import { onUnmounted, ref, Ref } from 'vue';
import loadingImage from '@/assets/imgs/loading.gif'

const pointer: Ref<string> = ref('.');
let count: number = 0;
let timer = setInterval(() => {
  count = count % 3;
  pointer.value = new Array(count + 1).fill('.').join('');
  count++;
}, 300)

onUnmounted(() => {
  clearInterval(timer)
});
</script>

<style scoped lang="less">
.loading-container{
  display: flex;
  width: 100%;
  height: 100%;
  justify-content: center;
  align-items: center;
  position: fixed;
  left: 0;
  top: 0;
  bottom: 0;
  right: 0;
  z-index: 999999;

   .loading-wrap {
    width: 240px;
    height: 200px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    .loading-txt {
      font-size: 18px;
      margin-top: 20px;
      font-weight: 800;
      letter-spacing: 2px;
      color: #8ccbe7;
      span{
        display: inline-block;
        width: 30px;
      }
    }
  }
  
}


</style>
