<script setup lang="ts">
import NodeCGTypes from '@nodecg/types';
import { assetsIntermissionSlides as media } from '@esa-layouts/browser_shared/replicant_store';
import { IntermissionSlides } from '@esa-layouts/types/schemas';
import MediaCard from '@esa-layouts/_misc/components/MediaCard.vue';
import { v4 as uuid } from 'uuid';
import Draggable from 'vuedraggable';

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
        v-if="!media.value.length"
        :style="{
          'font-style': 'italic',
          'white-space': 'unset',
        }"
      >
        Add images/videos under "Assets" > "{{ nodecg.bundleName }}" > "Intermission Slide Images/Videos".
      </MediaCard>
      <Draggable
        v-else
        :list="media.value"
        :group="{ name: 'intermission', pull: 'clone', put: false }"
        :sort="false"
        :clone="clone"
      >
        <MediaCard
          v-for="asset in media.value"
          :key="asset.sum"
          :title="asset.name"
        >
          {{ asset.name }}
        </MediaCard>
      </Draggable>
    </div>
  </div>
</template>
