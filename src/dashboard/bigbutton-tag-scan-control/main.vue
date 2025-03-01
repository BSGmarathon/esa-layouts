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
    <div v-if="!activeRun || !activeRunInArr">
      There is currently no active run available.
    </div>
    <div v-else>
      <div
        v-for="btn of config.flagcarrier.availableButtons"
        :key="btn.id"
        class="mt-2"
      >
        Test button {{ btn.id }} ({{ btn.name }})<br>
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

<script lang="ts">
import { replicantNS } from '@esa-layouts/browser_shared/replicant_store';
import { RunData, RunDataActiveRun, RunDataArray } from 'speedcontrol-util/types';
import { Component, Vue } from 'vue-property-decorator';

@Component
export default class extends Vue {
  @replicantNS.State((s) => s.reps.runDataArray) readonly runArray!: RunDataArray;
  @replicantNS.State((s) => s.reps.runDataActiveRun) readonly activeRun!: RunDataActiveRun;
  config = nodecg.bundleConfig;

  get activeRunInArr(): RunData | undefined {
    return this.runArray.find((r) => r.id === this.activeRun?.id);
  }

  async testShortPress(buttonId: number): Promise<void> {
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

  async testLongPress(buttonId: number): Promise<void> {
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
}
</script>
