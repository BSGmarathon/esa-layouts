<script setup lang="ts">
import Draggable from 'vuedraggable';
import { MediaBox, Tracker } from '@esa-layouts/types';
import { prizes } from '@esa-layouts/browser_shared/replicant_store';
import { clone as cloneRw, isPrizeApplicable } from './shared';
import MediaCard from './MediaCard.vue';
import ApplicableIcon from './ApplicableIcon.vue';

function clone(original: Tracker.FormattedPrize): MediaBox.RotationElem {
  return cloneRw('prize', original.id.toString());
}

function cloneGeneric(): MediaBox.RotationElem {
  return cloneRw('prize_generic');
}
</script>

<template>
  <div v-if="prizes.data">
    <v-toolbar-title>
      Available Prizes
    </v-toolbar-title>
    <div
      :style="{
        'max-height': '400px',
        'overflow-y': 'auto',
      }"
    >
      <MediaCard
        v-if="!prizes.data?.length"
        :style="{ 'font-style': 'italic' }"
      >
        No prizes available from the tracker.
      </MediaCard>
      <!-- All Prizes -->
      <Draggable
        v-else
        :list="prizes.data"
        :group="{ name: 'media', pull: 'clone', put: false }"
        :sort="false"
        :clone="clone"
        item-key="id"
      >
        <template #item="{ element: prize }">
          <MediaCard
            class="d-flex"
          >
            <applicable-icon :is-applicable="isPrizeApplicable(prize)" />
            <div
              class="flex-grow-1"
              :title="prize.name"
            >
              {{ prize.name }}
            </div>
          </MediaCard>
        </template>
      </Draggable>

      <!-- Generic Prize Slide -->
      <Draggable
        :list="['generic_prize']"
        :group="{ name: 'media', pull: 'clone', put: false }"
        :sort="false"
        :clone="cloneGeneric"
      >
        <template #item>
          <MediaCard
            key="generic_prize"
            class="d-flex"
            :style="{ 'font-weight': '500' }"
          >
            <ApplicableIcon :is-applicable="!!prizes.data!.filter(isPrizeApplicable).length" />
            <div
              class="flex-grow-1"
              title="Generic Prize Slide"
            >
              Generic Prize Slide
            </div>
          </MediaCard>
        </template>
      </Draggable>
    </div>
  </div>
</template>
