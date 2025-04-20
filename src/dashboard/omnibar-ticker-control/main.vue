<script setup lang="ts">
import { omnibar } from '@esa-layouts/browser_shared/replicant_store';
import { Omnibar } from '@esa-layouts/types/schemas';
import clone from 'clone';
import { v4 as uuid } from 'uuid';
import Draggable from 'vuedraggable';
import { computed, onMounted, watch } from 'vue';
import { waitForReplicant } from '@esa-layouts/browser_shared/helpers';
import { useHead } from '@vueuse/head';
import Bid from './components/Bid.vue';
import EditDialog from './components/EditDialog.vue';
import GenericMsg from './components/GenericMsg.vue';
import Milestone from './components/Milestone.vue';
import Prize from './components/Prize.vue';
import UpcomingRun from './components/UpcomingRun.vue';
import MusicTrack from './components/MusicTrack.vue';
import { useOmnibarStore } from './store';

useHead({ title: 'Omnibar ticker control' });

const omnibarTypes = {
  GenericMsg,
  UpcomingRun,
  Prize,
  Bid,
  Milestone,
  MusicTrack,
};

const store = useOmnibarStore();

type CurrentItem = {
  index: number,
  type?: string,
  name?: string,
  seconds: number,
  secondsStr: string,
  msg: string,
};

const availableTypes: { key: Omnibar['rotation'][0]['type'], name: string }[] = [
  {
    key: 'GenericMsg',
    name: 'Generic Message',
  },
  {
    key: 'MusicTrack',
    name: 'Current song',
  },
  {
    key: 'Bid',
    name: 'Random Bid (favours sooner)',
  },
  {
    key: 'Milestone',
    name: 'Random Milestone',
  },
  {
    key: 'Prize',
    name: 'Random Prize',
  },
  {
    key: 'UpcomingRun',
    name: 'Upcoming Run (1 of next 4)',
  },
];

const currentItem = computed<CurrentItem>(() => ({
  index: omnibar.data!.rotation.findIndex((r) => r.id === omnibar.data?.current?.id),
  type: omnibar.data?.current?.type,
  name: availableTypes.find((t) => t.key === omnibar.data?.current?.type)?.name || omnibar.data?.current?.type,
  seconds: omnibar.data?.current?.props?.seconds || 0,
  secondsStr: ['Bid', 'MiniCredits'].includes(omnibar.data?.current?.type || '')
    ? 'Minimum Length (seconds)'
    : 'Length (seconds)',
  msg: (omnibar.data?.current?.props?.msg as string | undefined) || '',
}));

function cloneRot(original: { key: Omnibar['rotation'][0]['type'], name: string }): Omnibar['rotation'][0] {
  return {
    type: original.key,
    id: uuid(),
    props: {
      seconds: 25,
      msg: original.key === 'GenericMsg'
        ? 'Message?'
        : undefined,
    },
  };
}

const localRotation = computed({
  get: () => store.localRotation,
  set: (newRot) => {
    store.setLocalRotation({ val: newRot, manual: true });
  },
});
const isEdited = computed(() => store.localEdits);

function setLocalRotationFromGlobal(val?: Omnibar['rotation']): void {
  store.setLocalRotation({ val: clone(val || omnibar.data!.rotation) });
}

function save(): void {
  store.storeToGlobalLocation();
}

watch(() => omnibar.data?.rotation, (newRot) => {
  if (!store.localEdits) {
    setLocalRotationFromGlobal(newRot);
  }
});

onMounted(async () => {
  await waitForReplicant(omnibar);

  setLocalRotationFromGlobal();
});
</script>

<template>
  <v-app v-if="omnibar.data">
    <!-- Edit Dialog -->
    <EditDialog />

    <!-- New Components -->
    <span class="text-h6">New Components</span>
    <Draggable
      class="d-flex flex-wrap"
      :list="availableTypes"
      :group="{ name: 'ticker', pull: 'clone', put: false }"
      :clone="cloneRot"
      :sort="false"
      item-key="key"
      :style="{ gap: '0px 10px' }"
    >
      <template #item="{ element }">
        <v-card
          class="pa-2 mt-2"
          :key="element.key"
        >
          {{ element.name }}
        </v-card>
      </template>
    </Draggable>

    <!-- Rotation -->
    <span class="text-h6 mt-4">Rotation</span>
    <v-card v-if="!localRotation.length" class="pa-2 mt-2 font-italic">
      Drag elements from above to here to add.
    </v-card>
    <Draggable
      v-model="localRotation"
      group="ticker"
      ghost-class="Ghost"
      tag="transition-group"
      :animation="200"
      :componentData="{
        props: {
          tag: 'div',
        },
      }"
      :style="{
        'max-height': '400px',
        'overflow-y': 'auto',
      }"
      item-key="id"
    >
      <template #item="{ element }">
        <div>
          <component
            class="mt-2"
            :key="element.id"
            :is="omnibarTypes[element.type]"
            :id="element.id"
            v-bind="element.props"
          />
        </div>
      </template>
    </Draggable>

    <!-- Save/Revert -->
    <div class="d-flex mt-2">
      <v-btn class="flex-grow-1 mr-2" :disabled="!isEdited" @click="save">
        Save
      </v-btn>
      <v-btn :disabled="!isEdited" @click="setLocalRotationFromGlobal()">
        <v-icon>mdi-refresh</v-icon>
      </v-btn>
    </div>

    <!-- Cycle Information -->
    <div v-if="currentItem.type" class="text-center mt-4">
      <span class="font-weight-bold">Current:</span>
      {{ currentItem.name }}
      <br><span class="font-weight-bold">{{ currentItem.secondsStr }}:</span>
      {{ currentItem.seconds }} -
      <span class="font-weight-bold">Position:</span>
      {{ (currentItem.index + 1) || '?' }}/{{ omnibar.data.rotation.length }}
      <template v-if="currentItem.type === 'GenericMsg'">
        <br><span class="font-weight-bold">Message:</span>
        {{ currentItem.msg }}
      </template>
    </div>
  </v-app>
</template>

<style scoped>
  .Ghost {
    opacity: 0.5;
  }
</style>
