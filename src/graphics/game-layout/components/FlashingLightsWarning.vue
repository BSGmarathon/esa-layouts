<script setup lang="ts">
import { computed, defineEmits, watch } from 'vue';
import { runDataActiveRun } from '@esa-layouts/browser_shared/replicant_store';

const emit = defineEmits<{
  'flashing-lights-updated': [newVal: boolean],
}>();

const hasFlashingLights = computed(
  () => runDataActiveRun.data?.customData?.flashingLights === 'true',
);

watch(() => hasFlashingLights.value, (newVal) => {
  emit('flashing-lights-updated', newVal);
}, { immediate: true });
</script>

<template>
  <div class="flashingLightsWarning"
       v-if="hasFlashingLights"
  >
    This game contains flashing lights
  </div>
</template>

<style scoped>
.flashingLightsWarning {
  background-color: red;
  box-sizing: border-box;
  padding: 7px;
  /*position: relative;*/
  color: white;
  line-height: 50px;

  width: 100%;

  font-size: 21pt;
  white-space: normal;
  font-family: Goodlight-light;
}
</style>
