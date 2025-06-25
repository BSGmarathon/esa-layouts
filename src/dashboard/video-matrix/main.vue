<script setup lang="ts">
import { useHead } from '@vueuse/head';
import { computed, onMounted, ref, watch } from 'vue';

useHead({ title: 'video matrix' });

const cfg = nodecg.bundleConfig;
const { online } = cfg.event;
const obsConfig = cfg.obs;

const gameCaptures = ref<string[]>([]);
const selectedCaptures = ref<number[]>([]);
const locked = ref(false);

function computeGameCaptures(): string[] {
  const gameCaptureNames = Array.isArray(obsConfig.names.groups.gameCaptures)
    ? obsConfig.names.groups.gameCaptures
    : [obsConfig.names.groups.gameCaptures];
  const cameraCaptures = Array.isArray(obsConfig.names.groups.cameraCaptures)
    ? obsConfig.names.groups.cameraCaptures
    : [obsConfig.names.groups.cameraCaptures];

  return gameCaptureNames.concat(cameraCaptures);
}

const gameSources = computed(() => {
  const gameSourceNames = Array.isArray(obsConfig.names.sources.gameSources)
    ? obsConfig.names.sources.gameSources
    : [obsConfig.names.sources.gameSources];
  const cameraSources = Array.isArray(obsConfig.names.sources.cameraSources)
    ? obsConfig.names.sources.cameraSources
    : [obsConfig.names.sources.cameraSources];

  return gameSourceNames.concat(cameraSources);
});

const selectedCapturesComputed = computed(() => JSON.parse(JSON.stringify(selectedCaptures.value)));

watch(selectedCapturesComputed, async (newVal: number[], oldVal?: number[]) => {
  if (locked.value || !oldVal) {
    return;
  }

  // find the index that changed, there's no way more than one index changes at once
  let captureIndex = -1;

  // eslint-disable-next-line no-plusplus
  for (let i = 0; i < newVal.length; i++) {
    const newNum = newVal[i];
    const oldNum = oldVal[i];

    if (newNum !== oldNum) {
      captureIndex = i;
      break;
    }
  }

  // Sanity check
  if (captureIndex === -1) {
    return;
  }

  locked.value = true;

  const captureName = gameCaptures.value[captureIndex];
  const sourceName = gameSources.value[newVal[captureIndex]];

  // We're using a different event here to prevent loops.
  await nodecg.sendMessage('setSelectedCaptures', {
    sceneName: captureName,
    sourceName,
  });

  locked.value = false;
});

onMounted(async () => {
  if (online) {
    return;
  }

  locked.value = true;
  gameCaptures.value = computeGameCaptures();

  nodecg.listenFor('gameSourceVisibilityUpdated', (data: number[]) => {
    selectedCaptures.value = data;
  });

  // load initial settings
  selectedCaptures.value = await nodecg.sendMessage('getGameSourceVisibility');

  locked.value = false;
});
</script>

<template>
  <v-app v-if="online">
    <p>Disabled for online events</p>
  </v-app>
  <v-app v-else>
    <v-table>
      <template #default>
        <thead>
          <tr>
            <th class="text-left text-muted input-dash-output">
              <span>input</span>
              <hr/>
              <span>output</span>
            </th>
            <th v-for="capture in gameSources"
                :key="capture"
                class="text-left">
              {{ capture }}
            </th>
          </tr>
        </thead>
        {{ locked }}
        <tbody>
          <tr v-for="(source, si) in gameCaptures" :key="source">
            <td class="text--lighten-5">{{ source }}</td>
            <td v-for="ci in gameSources.length" :key="ci">
              <v-radio-group v-model="selectedCaptures[si]" row :name="`selctor-${source}`">
                <v-radio :value="ci - 1"/>
              </v-radio-group>
            </td>
          </tr>
        </tbody>
      </template>
    </v-table>
  </v-app>
</template>

<style lang="scss" scoped>
.theme--dark.v-data-table>.v-data-table__wrapper>table>tbody>tr:hover:not(.v-data-table__expanded__content):not(.v-data-table__empty-wrapper) {
  background: #1e1e1e !important;
}

.input-dash-output {
  position: relative;

  hr {
    transform: rotate(21deg);
  }

  span {
    position: absolute;

    &:first-of-type {
      top: 5px;
      right: 25px;
    }

    &:last-of-type {
      left: 17px;
    }
  }
}
</style>
