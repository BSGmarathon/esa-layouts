<script setup lang="ts">
import { watch, nextTick, onMounted, ref } from 'vue';
import { RouteLocationNormalized, useRoute, useRouter } from 'vue-router';
import { getZoomAmountCSS } from '@esa-layouts/_misc/helpers';
import { updateCapturePositionData } from '@esa-layouts/_misc/update-capture-position-data';
import { gameLayouts } from '@esa-layouts/browser_shared/replicant_store';
import { generateClipPath } from '../_misc/cut-background';
import { defaultCode } from './list';

const clipPath = ref('unset');
const zoom = getZoomAmountCSS();

const router = useRouter();

watch(() => gameLayouts.data, async (newVal, oldVal) => {
  if (!oldVal || oldVal.selected !== newVal?.selected) {
    const code = newVal?.selected || defaultCode;
    try {
      await router.push(`/${code}`);
    } catch (err) {
      // This can error if the route is already the correct one
    }
  }

  if (oldVal && oldVal.crowdCamera !== newVal?.crowdCamera) {
    await nextTick();
    clipPath.value = generateClipPath();
    updateCapturePositionData(document.title);
  }
}, { immediate: true });

function updateSelected(code: string): void {
  const gameData = gameLayouts.data;

  if (gameData) {
    gameData.selected = code;
  }
}

function layoutChanged(route: RouteLocationNormalized): void {
  // Is the last replace needed?
  const code = route.path.replace('/', '').replace('*', '');

  updateSelected(code || defaultCode);

  clipPath.value = generateClipPath();

  updateCapturePositionData(document.title);
}

onMounted(() => {
  const route = useRoute();

  layoutChanged(route);

  router.afterEach(async (to) => {
    try {
      await nextTick();
      layoutChanged(to);
    } catch (err) {
      // Not sure if this will error but better be safe
    }
  });
});
</script>

<template>
  <div id="GameLayout" :style="{ zoom }">
    <div
      id="Background"
      :style="{ 'clip-path': clipPath }"
    />
    <RouterView id="Layout" />
  </div>
</template>
