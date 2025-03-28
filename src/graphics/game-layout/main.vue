<script setup lang="ts">
import { watch, nextTick, onMounted, onBeforeUnmount, ref } from 'vue';
import { RouteLocationNormalized, useRoute, useRouter } from 'vue-router';
import { getZoomAmountCSS } from '@esa-layouts/_misc/helpers';
import { updateCapturePositionData } from '@esa-layouts/_misc/update-capture-position-data';
import { gameLayouts } from '@esa-layouts/browser_shared/replicant_store';
import { generateClipPath } from '../_misc/cut-background';
import { defaultCode } from './list';
import type { GameLayouts } from '@esa-layouts/types/schemas';
import { sleep } from '@esa-layouts/browser_shared/helpers';
import { useHead } from '@vueuse/head';

useHead({ title: 'Game Layout' });

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

// Collect list of available game layouts to add to replicant.
function getAvailable(): GameLayouts['available'] {
  return router.getRoutes().reduce((prev, route) => {
    if (typeof route.name === 'string') {
      prev.push({
        name: route.name,
        code: route.path.replace('/', ''),
      });
    }
    return prev;
  }, [] as GameLayouts['available']);
}

onMounted(async () => {
  // Wait for replicant to become ready.
  while (!gameLayouts?.data) {
    await sleep(100);
  }

  gameLayouts.data.available = getAvailable();
  gameLayouts.save();

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

onBeforeUnmount(() => {
  gameLayouts.data!.available = [];
  gameLayouts.save();
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
