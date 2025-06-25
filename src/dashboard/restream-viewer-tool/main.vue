<script setup lang="ts">
import { GameLayouts, RtmpFeed as RtmpSettings } from '@esa-layouts/types/schemas';
import { gameLayouts, obsData } from '@esa-layouts/browser_shared/replicant_store';
import { computed, onMounted, ref, watch } from 'vue';
import { waitForReplicant } from '@esa-layouts/browser_shared/helpers';
import { useHead } from '@vueuse/head';
import RTMPFeed from './components/RTMPFeed.vue';

useHead({ title: 'Restream viewer control' });

const gameLayoutName = nodecg.bundleConfig.obs.names.scenes.gameLayout;
const isOnline = nodecg.bundleConfig.event.online;
const feeds = ref<RtmpSettings[]>([
  {
    streamKey: '',
    editAllowed: true,
    enabled: true,
    feedIndex: 1,
    server: 'eu',
  },
  {
    streamKey: '',
    editAllowed: true,
    enabled: false,
    feedIndex: 2,
    server: 'na',
  },
]);

const selected = computed<GameLayouts['selected']>(() => gameLayouts.data?.selected);
const canEdit = computed(() => feeds.value.map((feed) => feed.editAllowed).reduce((a, b) => a || b, false));

async function updateInObs(): Promise<void> {
  await nodecg.sendMessage('setRtmpSettings', feeds.value);
}

async function refreshRtmpSources(): Promise<void> {
  const indexes = feeds.value.filter((feed) => feed.enabled).map((feed) => feed.feedIndex);

  await nodecg.sendMessage('refreshRtmpSources', indexes);
}

watch(() => obsData.data, () => {
  if (!isOnline) {
    return;
  }
  const isOnGame = obsData.data?.scene === gameLayoutName;

  for (const feed of feeds.value) {
    feed.editAllowed = !isOnGame;
  }
}, { deep: true });

watch(selected, async (newSelected) => {
  if (!isOnline) {
    return;
  }

  feeds.value[1].enabled = newSelected?.includes('2p') || false;

  await updateInObs();
});

onMounted(async () => {
  if (!isOnline) {
    return;
  }

  await waitForReplicant(obsData, gameLayouts);

  feeds.value = await nodecg.sendMessage('geRtmpSettings');

  const isOnGame = obsData.data!.scene === gameLayoutName;

  for (const feed of feeds.value) {
    feed.editAllowed = !isOnGame;
  }

  // TODO: Stream keys auto generated from runner's username ({usn + rng}?)
});
</script>

<template>
  <v-app v-if="isOnline">
    <div v-for="feed in feeds" :key="feed.feedIndex">
      <RTMPFeed :value="feed" />
      <hr/>
    </div>
    <v-row>
      <v-col>
        <v-btn :disabled="!canEdit" @click="updateInObs">Update OBS</v-btn>
      </v-col>
      <v-col>
        <v-btn @click="refreshRtmpSources">Refresh active</v-btn>
      </v-col>
    </v-row>
  </v-app>
  <v-app v-else>
    <p>Disabled for in-person events</p>
  </v-app>
</template>

<style>
hr {
  margin-bottom: 5px;
}
</style>
