<template>
  <div>
    <a href="#/three" class="btn" @click="clickHandler">three3D page</a>
    <a href="#" class="btn" @click="clickHandler">发送mqtt</a>
  </div>
</template>

<script setup lang="ts">
import mqttClient from '@/utils/mqttClient';

const clickHandler = () => {
  const data = JSON.stringify({ gcode: 'x100 y300'})
  mqttClient.publish('pdu/client', data)
}
</script>

<style scoped>

</style>