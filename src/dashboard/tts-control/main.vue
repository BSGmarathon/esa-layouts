<script setup lang="ts">
import { ttsVoices as voices } from '@esa-layouts/browser_shared/replicant_store';
import { useHead } from '@vueuse/head';
import { computed, onMounted, watch } from 'vue';
import { waitForReplicant } from '@esa-layouts/browser_shared/helpers';
import { useGoTo } from 'vuetify';

useHead({ title: 'TTS control' });

const goTo = useGoTo();

const config = nodecg.bundleConfig.tts;
const selected = computed({
  get: () => voices.data?.selected,
  set: (val) => {
    voices.data!.selected = val;
    voices.save();
  },
});

function scrollToSelectedVoice(): void {
  if (config.enabled) {
    goTo(`#${voices.data?.selected}`, { container: '#VoiceList', offset: 25 });
  }
}

function playExample(): void {
  nodecg.sendMessage('ttsExample');
}

watch(() => voices.data, () => {
  if (config.enabled) {
    scrollToSelectedVoice();
  }
});

onMounted(async () => {
  await waitForReplicant(voices);

  scrollToSelectedVoice();
});
</script>

<template>
  <v-app>
    <div
      v-if="!config.enabled"
      :style="{ 'font-style': 'italic' }"
    >
      This feature is not enabled.
    </div>
    <template v-else>
      <div
        id="VoiceList"
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
            v-for="voice in voices.data.available"
            :id="voice.code"
            :key="voice.code"
            :value="voice.code"
            :label="voice.name"
          />
        </v-radio-group>
      </div>
      <v-btn @click="playExample">
        Play Example Donation
      </v-btn>
    </template>
  </v-app>
</template>

<style>
  .v-input--hide-details > .v-input__control > .v-input__slot {
    margin-bottom: 2px !important;
  }
</style>
