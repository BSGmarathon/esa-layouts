<script setup lang="ts">
import { IntermissionSlides } from '@esa-layouts/types/schemas';
import MediaCard from '@esa-layouts/dashboard/_misc/components/MediaCard.vue';
import Draggable from 'vuedraggable';
import { computed } from 'vue';
import { assetsIntermissionSlides } from '@esa-layouts/browser_shared/replicant_store';
import { useIntermissionSlideStore } from '../store';

const slideStore = useIntermissionSlideStore();
const localRotation = computed({
  get: () => slideStore.localRotation,
  set: (newRot) => {
    slideStore.setLocalRotation({ val: newRot, manual: true });
  },
});

function name(media: IntermissionSlides['rotation'][0]): string {
  if (media.type === 'Media') {
    return assetsIntermissionSlides.value.find((a) => a.sum === media.mediaUUID)?.name || '';
  }

  if (media.type === 'UpcomingRuns') {
    return 'Upcoming Runs';
  }

  if (media.type === 'RandomBid') {
    return 'Random Bid';
  }

  if (media.type === 'RandomPrize') {
    return 'Random Prize';
  }
  return '?';
}

function del(id: string): void {
  slideStore.deleteItem(id);
}
</script>

<template>
  <div>
    <v-toolbar-title>
      Rotation
    </v-toolbar-title>
    <div
      :style="{
        'max-height': '400px',
        'overflow-y': 'auto',
      }"
    >
      <MediaCard
        v-if="!localRotation.length"
        :style="{ 'font-style': 'italic' }"
      >
        Drag elements from above to here to configure.
      </MediaCard>
      <Draggable
        v-model="localRotation"
        group="intermission"
        item-key="id"
      >
        <template #item="{ element: media }">
          <MediaCard
            class="d-flex"
          >
            <div
              class="d-flex align-center justify-center flex-grow-1"
              :style="{ 'overflow': 'hidden' }"
            >
              {{ name(media) }}
            </div>
            <div class="d-flex">
              <v-icon @click="del(media.id)">
                mdi-delete
              </v-icon>
            </div>
          </MediaCard>
        </template>
      </Draggable>
    </div>
  </div>
</template>
