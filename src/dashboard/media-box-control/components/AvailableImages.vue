<script setup lang="ts">
import type NodeCGTypes from '@nodecg/types';
import Draggable from 'vuedraggable';
import { assetsMediaBoxImages as images } from '@esa-layouts/browser_shared/replicant_store';
import { MediaBox } from '../../../types';
import MediaCard from './MediaCard.vue';
import { clone as cloneShared } from './shared';

const { bundleName } = nodecg;

function clone(original: NodeCGTypes.AssetFile): MediaBox.RotationElem {
  return cloneShared('image', original.sum);
}
</script>

<template>
  <div>
    <v-toolbar-title>
      Available Images
    </v-toolbar-title>
    <div
      :style="{
        'max-height': '400px',
        'overflow-y': 'auto',
      }"
    >
      <MediaCard
        v-if="!images.length"
        :style="{
          'font-style': 'italic',
          'white-space': 'unset',
        }"
      >
        Add images under "Assets" > "{{ bundleName }}" > "Media Box Images".
      </MediaCard>
      <Draggable
        v-else
        :list="images"
        :group="{ name: 'media', pull: 'clone', put: false }"
        :sort="false"
        :clone="clone"
        item-key="sum"
      >
        <template #item="{ element: image }">
          <MediaCard>
            {{ image.name }}
          </MediaCard>
        </template>
      </Draggable>
    </div>
  </div>
</template>
