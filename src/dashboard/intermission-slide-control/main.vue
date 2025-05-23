<script setup lang="ts">
import { intermissionSlides } from '@esa-layouts/browser_shared/replicant_store';
import { IntermissionSlides } from '@esa-layouts/types/schemas';
import clone from 'clone';
import { computed, onMounted, watch } from 'vue';
import { waitForReplicant } from '@esa-layouts/browser_shared/helpers';
import { useHead } from '@vueuse/head';
import AvailableImagesVideos from './components/AvailableImagesVideos.vue';
import CurrentItem from './components/CurrentItem.vue';
import OtherSlides from './components/OtherSlides.vue';
import Rotation from './components/Rotation.vue';
import { useIntermissionSlideStore } from './store';

useHead({ title: 'Intermission Slide Control' });

const slideStore = useIntermissionSlideStore();
const isEdited = computed(() => slideStore.localEdits);

function setLocalRotationFromGlobal(val?: IntermissionSlides['rotation']): void {
  slideStore.setLocalRotation({ val: clone(val || intermissionSlides.data!.rotation) });
}

function save(): void {
  slideStore.storeToGlobalLocation();
}

watch(() => intermissionSlides.data?.rotation, (newVal) => {
  if (!slideStore.localEdits) {
    setLocalRotationFromGlobal(newVal);
  }
});

onMounted(async () => {
  await waitForReplicant(intermissionSlides);

  setLocalRotationFromGlobal();
});
</script>

<template>
  <v-app v-if="intermissionSlides.data">
    <AvailableImagesVideos />
    <!-- Available Prizes -->
    <!-- Available Bids -->
    <!-- Available Goals? -->
    <OtherSlides :style="{ 'margin-top': '20px' }" />

    <Rotation v-model="slideStore.localRotation" :style="{ 'margin-top': '20px' }" />

    <!-- Save/Revert -->
    <div class="d-flex mt-4">
      <v-btn class="flex-grow-1 mr-2" :disabled="!isEdited" @click="save">
        Save
      </v-btn>
      <v-btn :disabled="!isEdited" @click="setLocalRotationFromGlobal()">
        <v-icon>mdi-refresh</v-icon>
      </v-btn>
    </div>

    <current-item :style="{ 'margin-top': '20px' }" />
  </v-app>
</template>
