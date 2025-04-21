<script setup lang="ts">
import { IntermissionSlides } from '@esa-layouts/types/schemas';
import MediaCard from '@esa-layouts/dashboard/_misc/components/MediaCard.vue';
import { v4 as uuid } from 'uuid';
import Draggable from 'vuedraggable';

type SelectionItem = { type: IntermissionSlides['rotation'][0]['type'], name: string };

const selection: SelectionItem[] = [
  {
    type: 'UpcomingRuns',
    name: 'Upcoming Runs',
  },
  {
    type: 'RandomBid',
    name: 'Random Bid',
  },
  {
    type: 'RandomPrize',
    name: 'Random Prize',
  },
];

function clone(item: SelectionItem): IntermissionSlides['rotation'][0] {
  return {
    type: item.type,
    id: uuid(),
    mediaUUID: '-1',
  };
}
</script>

<template>
  <div>
    <v-toolbar-title>
      Other Slides
    </v-toolbar-title>
    <div
      :style="{
        'max-height': '400px',
        'overflow-y': 'auto',
      }"
    >
      <Draggable
        :list="selection"
        :group="{ name: 'intermission', pull: 'clone', put: false }"
        :sort="false"
        :clone="clone"
        item-key="type"
      >
        <template #item="{ element: item }">
          <MediaCard
            :key="item.type"
            :title="item.name"
          >
            {{ item.name }}
          </MediaCard>
        </template>
      </Draggable>
    </div>
  </div>
</template>
