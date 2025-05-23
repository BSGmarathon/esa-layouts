<script setup lang="ts">
import Draggable from 'vuedraggable';
import { useHead } from '@vueuse/head';
import { MediaBox } from '../../types';
import AvailableImages from './components/AvailableImages.vue';
import AvailablePrizes from './components/AvailablePrizes.vue';
import CurrentMediaInfo from './components/CurrentMediaInfo.vue';
import MediaCard from './components/MediaCard.vue';
import Rotation from './components/Rotation.vue';
import { clone } from './components/shared';
import { useMediaBoxControlStore } from './store';

useHead({ title: 'Media Box control' });

const store = useMediaBoxControlStore();

withDefaults(defineProps<{ prizes: boolean }>(), {
  prizes: true,
});

function cloneText(): MediaBox.RotationElem {
  return clone('text', undefined, 'Your text here');
}
</script>

<template>
  <v-app>
    <AvailableImages />
    <AvailablePrizes v-if="prizes" :style="{ 'margin-top': '20px' }" />
    <div :style="{ 'margin-top': '20px' }">
      <v-toolbar-title>
        Custom Text Element
      </v-toolbar-title>
      <div>
        <Draggable
          :list="['text']"
          :group="{ name: 'media', pull: 'clone', put: false }"
          :sort="false"
          :clone="cloneText"
        >
          <template #item>
            <MediaCard key="text" :style="{ 'font-weight': '500' }">
              Drag to rotation to configure a custom text element.
            </MediaCard>
          </template>
        </Draggable>
      </div>
    </div>
    <Rotation :style="{ 'margin-top': '20px' }" />

    <!-- Save Button -->
    <v-btn
      :loading="store.disableSave"
      :disabled="store.disableSave"
      :style="{ 'margin-top': '20px' }"
      @click="store.save()"
    >
      Save
    </v-btn>

    <CurrentMediaInfo :style="{ 'margin-top': '10px' }" />
  </v-app>
</template>
