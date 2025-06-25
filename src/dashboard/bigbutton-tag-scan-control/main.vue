<script setup lang="ts">
import { runDataActiveRun, runDataArray } from '@esa-layouts/browser_shared/replicant_store';
import { useHead } from '@vueuse/head';
import { computed, onMounted } from 'vue';
import { waitForReplicant } from '@esa-layouts/browser_shared/helpers';

useHead({ title: 'FLag carrier control' });

const config = nodecg.bundleConfig;
const activeRunInArr = computed(() => runDataArray.data?.find((r) => r.id === runDataActiveRun.data?.id));

async function testShortPress(buttonId: number): Promise<void> {
  await fetch(
    `/${nodecg.bundleName}/button/${buttonId}`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        action: 'toggle-timer',
      }),
    },
  );
}

async function testLongPress(buttonId: number): Promise<void> {
  await fetch(
    `/${nodecg.bundleName}/button/${buttonId}`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        action: 'reset-timer',
      }),
    },
  );
}

onMounted(async () => {
  await waitForReplicant(runDataArray, runDataActiveRun);
});
</script>

<template>
  <v-app v-if="config.event.online">
    <span class="font-italic">
      Not used for online only events.
    </span>
  </v-app>
  <v-app v-else-if="!config.flagcarrier.enabled">
    <span class="font-italic">
      Flagcarrier support is not enabled.
    </span>
  </v-app>
  <v-app v-else>
    <div v-if="!runDataActiveRun.data || !activeRunInArr">
      There is currently no active run available.
    </div>
    <div v-else>
      <div
        v-for="btn of config.flagcarrier.availableButtons"
        :key="btn.id"
        class="mt-2"
      >
        Test button {{ btn.id }} ({{ btn.name }})<br/>
        <v-btn @click="testShortPress(btn.id)">
          Normal press
        </v-btn>
        <v-btn @click="testLongPress(btn.id)">
          Long press
        </v-btn>
      </div>
    </div>
  </v-app>
</template>
