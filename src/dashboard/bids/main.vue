<script setup lang="ts">
import { bids, omnibar } from '@esa-layouts/browser_shared/replicant_store';
import { Bids } from '@esa-layouts/types/schemas';
import { sortBy } from 'lodash';
import { computed, onMounted, ref } from 'vue';
import { waitForReplicant } from '@esa-layouts/browser_shared/helpers';
import { useHead } from '@vueuse/head';
import Bid from './components/Bid.vue';

useHead({ title: 'Bids control' });

const currentPin = computed(() => omnibar.data?.pin);

const sortOpt = ref(1);
const searchTerm = ref<string | null>(null);

const pinnedBid = computed<Bids[0] | undefined>(
  () => (currentPin.value?.type === 'Bid'
    ? bids.data!.find((b) => b.id === currentPin.value?.id)
    : undefined),
);
const bidsSorted = computed<Bids>(() => sortBy(bids.data, [sortOpt.value === 1 ? 'endTime' : 'game']));
const bidsFiltered = computed<Bids>(() => {
  const filtered: Bids = [];

  if (!pinnedBid.value && currentPin.value?.type === 'Bid') {
    // @ts-expect-error This is allowed but the type is technically wrong
    filtered.push({ name: 'Pinned bid no longer available!', id: currentPin.value.id as number });
  }

  // It works so we don't touch it
  filtered.push(...bidsSorted.value.filter((b) => {
    const str = searchTerm.value ? searchTerm.value.toLowerCase() : '';
    return !str || (str && (b.game?.toLowerCase().includes(str)
      || b.name.toLowerCase().includes(str)));
  }));

  return filtered;
});

onMounted(async () => {
  await waitForReplicant(bids, omnibar);
});
</script>

<template>
  <v-app>
    <div v-if="!bidsSorted.length" class="pa-3 font-italic">
      No open bids available.
    </div>
    <template v-else>
      <div class="d-flex">
        <v-spacer />
        <v-radio-group v-model="sortOpt" inline class="pa-0 ma-0" hide-details label="Sort By">
          <v-radio label="Name" :value="0" />
          <v-radio label="End Time" :value="1" class="mr-0" />
        </v-radio-group>
      </div>
      <v-text-field
        class="mt-2"
        v-model="searchTerm"
        filled
        clearable
        label="Search..."
        append-icon="mdi-magnify"
        :messages="`${bidsFiltered.length} bid${bidsFiltered.length === 1 ? '' : 's'} found.`"
      />
      <div :style="{ height: '350px', 'overflow-y': 'scroll' }">
        <Bid
          v-for="(bid, i) in bidsFiltered"
          :key="bid.id"
          :bid="bid"
          :index="i"
        />
      </div>
    </template>
  </v-app>
</template>
