<script setup lang="ts">
import { useIntermissionStore } from '@esa-layouts/graphics/intermission/store';
import { defineEmits, onMounted } from 'vue';
import UpcomingRun from '../UpcomingRun.vue';
import Container from '../Container.vue';

const emit = defineEmits<{
  end: [],
}>();
const intermissionStore = useIntermissionStore();

onMounted(() => {
  window.setTimeout(() => emit('end'), 20 * 1000);
});
</script>

<template>
  <div
    v-if="intermissionStore.nextRuns.slice(1).length"
    class="Flex"
    :style="{
      'flex-direction': 'column',
      'justify-content': 'space-around',
    }"
  >
    <UpcomingRun
      v-for="(run, i) in intermissionStore.nextRuns.slice(1)"
      :key="run.id"
      :run-data="run"
      :slot-no="i + 1"
    />
  </div>
  <Container v-else>
    <template v-slot:header>
      ...And that's the end!
    </template>
    <template v-slot:content>
      <span :style="{ 'font-size': '120px' }">
        No More Runs
        <img
          src="./notlikethis_112.png"
          :style="{ height: '1em' }"
        >
      </span>
    </template>
  </Container>
</template>
