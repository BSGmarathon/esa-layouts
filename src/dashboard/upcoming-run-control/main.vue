<script setup lang="ts">
import { runDataActiveRunSurrounding, runDataArray, upcomingRunID } from '@esa-layouts/browser_shared/replicant_store';
import { useHead } from '@vueuse/head';
import type { RunDataActiveRunSurrounding } from 'speedcontrol-util/types/schemas';

useHead({ title: 'Upcomming run control' });

const rundataKeys: (keyof RunDataActiveRunSurrounding)[] = ['previous', 'current', 'next'];

function forceUpcomingRun(id?: string): void {
  nodecg.sendMessage('forceUpcomingRun', id);
}

function getRunStr(id: string | undefined): string {
  const run = runDataArray.data?.find((r) => r.id === id);

  if (run) {
    const arr = [
      run.game || '?',
      run.category,
    ].filter(Boolean);
    return arr.join(' - ');
  }

  return '?';
}
</script>

<template>
  <v-app>
    <div :style="{ 'font-style': 'italic', 'margin-bottom': '5px' }">
      This should only need to be used if the automatically set one is incorrect.
    </div>
    <div :style="{ overflow: 'hidden', 'white-space': 'nowrap' }">
      <span :style="{ 'font-weight': 'bold' }">
        Currently Set:
      </span>
      <span
        v-if="upcomingRunID.data"
        :title="getRunStr(upcomingRunID.data)"
      >
        {{ getRunStr(upcomingRunID.data) }}
      </span>
      <span v-else>
        none
      </span>
    </div>
    <div
      v-for="(type, i) in rundataKeys"
      :key="i"
      :style="{ 'margin-top': '5px' }"
    >
      <v-btn
        v-if="runDataActiveRunSurrounding.data && runDataActiveRunSurrounding.data[type]"
        class="ForceUpcomingRunBtn"
        width="100%"
        block
        :title="getRunStr(runDataActiveRunSurrounding.data[type])"
        @click="forceUpcomingRun(runDataActiveRunSurrounding.data[type])"
      >
        <div
          class="d-flex justify-center"
          :style="{ width: '100%' }"
        >
          <div :style="{ overflow: 'hidden' }">
            Force to {{ type }} ({{ getRunStr(runDataActiveRunSurrounding.data[type]) }})
          </div>
        </div>
      </v-btn>
      <v-btn
        v-else
        width="100%"
        block
        disabled
      >
        {{ type }} not available
      </v-btn>
    </div>
    <v-btn
      :style="{ 'margin-top': '5px' }"
      @click="forceUpcomingRun()"
    >
      Force to nothing
    </v-btn>
  </v-app>
</template>

<style>
  .ForceUpcomingRunBtn > .v-btn__content {
    width: 100%;
  }
</style>
