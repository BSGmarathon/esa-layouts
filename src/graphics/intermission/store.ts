import { defineStore } from 'pinia';
import { computed } from 'vue';
import { speedControl, upcomingRunID } from '@esa-layouts/browser_shared/replicant_store';

export const useIntermissionStore = defineStore('intermission', () => {
  const nextRuns = computed(() => {
    const id = upcomingRunID.data!;
    const runIndex = speedControl.findRunIndex(id);

    if (runIndex > -1) {
      return speedControl.getRunDataArray().slice(runIndex, runIndex + 4);
    }

    return [];
  });

  return {
    nextRuns,
  };
});
