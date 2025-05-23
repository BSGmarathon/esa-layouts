<script setup lang="ts">
import { gameLayouts, runDataActiveRun } from '@esa-layouts/browser_shared/replicant_store';
import { computed, nextTick, onMounted, ref, watch } from 'vue';
import { waitForReplicant } from '@esa-layouts/browser_shared/helpers';
import { useGoTo } from 'vuetify';
import { useHead } from '@vueuse/head';

useHead({ title: 'Game layout override' });

const goTo = useGoTo();

const selected = computed({
  get: () => gameLayouts.data?.selected,
  set: (val) => {
    gameLayouts.data!.selected = val;
    gameLayouts.save();
  },
});
const flashingLightsLocalState = ref(false);
const flashingLightsWarning = computed({
  get: () => flashingLightsLocalState.value,
  set: (val: boolean) => {
    nodecg.sendMessage('updateFlashingLightsWarning', val);
  },
});

watch(() => runDataActiveRun.data, (newVal) => {
  flashingLightsLocalState.value = newVal?.customData?.flashingLights === 'true';
}, { deep: true, immediate: true });

async function scrollToSelectedLayout(): Promise<void> {
  try {
    await nextTick();
    if (selected.value) {
      await goTo(`#layout-${selected.value}`, { container: '#LayoutList', offset: 25 });
    } else {
      await goTo(0, { container: '#LayoutList' });
    }
  } catch (err) {
    // Not sure if this can error, but better be safe
  }
}

watch(() => gameLayouts.data, () => {
  if (gameLayouts.data?.available?.length) {
    scrollToSelectedLayout();
  }
});

onMounted(async () => {
  await waitForReplicant(gameLayouts, runDataActiveRun);
  scrollToSelectedLayout();
});
</script>

<template>
  <v-app>
    <div
      v-if="!gameLayouts.data?.available?.length"
      :style="{ 'font-style': 'italic' }"
    >
      "Game Layout" graphic must be open.
    </div>
    <template v-else>
      <v-switch
        v-model="flashingLightsWarning"
        class="mx-3 mt-1 mb-2 pa-0"
        inset
        hide-details
        label="Flashing Lights Warning"
      />
      <div
        id="LayoutList"
        :style="{
          'max-height': '250px',
          'overflow-y': 'auto',
        }"
      >
        <v-radio-group
          v-model="selected"
          hide-details
          :style="{
            margin: '0px',
            padding: '10px',
          }"
        >
          <v-radio
            v-for="layout in gameLayouts.data.available"
            :id="`layout-${layout.code}`"
            :key="layout.code"
            :value="layout.code"
            :label="layout.name"
          />
        </v-radio-group>
      </div>
    </template>
  </v-app>
</template>

<style>
  .v-input--hide-details > .v-input__control > .v-input__slot {
    margin-bottom: 2px !important;
  }
</style>
