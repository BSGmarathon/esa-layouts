<script setup lang="ts">
import { computed, ref } from 'vue';
import { countdown } from '@esa-layouts/browser_shared/replicant_store';
import { msToTimeStr } from '@esa-layouts/browser_shared/helpers';
import { useHead } from '@vueuse/head';

useHead({ title: 'Countdown control' });

const entry = ref('');

const currentCountdown = computed(() => {
  const seconds = Math.round((countdown.data?.remaining ?? 0) / 1000);
  return msToTimeStr(seconds * 1000);
});

function change(): void {
  nodecg.sendMessage('startCountdown', entry.value);
  entry.value = '';
}
</script>

<template>
  <v-app>
    <div>
      Current Countdown: {{ currentCountdown }}
    </div>
    <v-time-picker
      scrollable
      v-model="entry"
      format="24hr"
      full-width
      class="mb-4 mt-0"
      style="width: 100%; background-color: transparent"
    />
    <v-btn @click="change()">
      Apply
    </v-btn>
  </v-app>
</template>
