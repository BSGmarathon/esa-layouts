<script setup lang="ts">
import NodeCGTypes from '@nodecg/types';
import { assetsIntermissionSlides as media } from '@esa-layouts/browser_shared/replicant_store';
import { IntermissionSlides } from '@esa-layouts/types/schemas';
import MediaCard from '@esa-layouts/dashboard/_misc/components/MediaCard.vue';
import { v4 as uuid } from 'uuid';
import Draggable from 'vuedraggable';

const { bundleName } = nodecg;

function clone(original: NodeCGTypes.AssetFile): IntermissionSlides['rotation'][0] {
  return {
    type: 'Media',
    id: uuid(),
    mediaUUID: original.sum,
  };
}
</script>

<template>
  <div>
    <v-toolbar-title>
      Available Images/Videos
    </v-toolbar-title>
    <div
      :style="{
        'max-height': '400px',
        'overflow-y': 'auto',
      }"
    >
      <MediaCard
        v-if="!media.length"
        :style="{
          'font-style': 'italic',
          'white-space': 'unset',
        }"
      >
        Add images/videos under "Assets" > "{{ bundleName }}" > "Intermission Slide Images/Videos".
      </MediaCard>
      <Draggable
        v-else
        :list="media"
        :group="{ name: 'intermission', pull: 'clone', put: false }"
        :sort="false"
        :clone="clone"
        item-key="sum"
      >
        <template #item="{ element: asset }">
          <MediaCard
            :title="asset.name"
          >
            {{ asset.name }}
          </MediaCard>
        </template>
      </Draggable>
    </div>
  </div>
</template>
