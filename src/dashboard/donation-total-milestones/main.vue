<script setup lang="ts">
import {
  donationTotal as total,
  donationTotalMilestones as milestones,
} from '@esa-layouts/browser_shared/replicant_store';
import { sortBy } from 'lodash';
import { computed, ref } from 'vue';
import { v4 as uuid } from 'uuid';
import { useHead } from '@vueuse/head';
import Milestone from './components/Milestone.vue';

useHead({ title: 'Donation total milestones' });

const sortOpt = ref(2);
const milestonesSorted = computed(() => {
  if (sortOpt.value === 1) {
    return sortBy(milestones.data, ['name']);
  }

  if (sortOpt.value === 2) {
    return sortBy(milestones.data, (o) => (o.addition ? (total.data ?? 0) + o.addition : o.amount));
  }

  return milestones.data;
});

function formatAmount(val: number): string {
  return val.toLocaleString('en-US', { maximumFractionDigits: 0 });
}

function addBlank(): void {
  milestones.data?.push({
    id: uuid(),
    name: 'Default Milestone Name',
    enabled: false,
  });
  milestones.save();
}
</script>

<template>
  <v-app>
    <div class="mb-2 d-flex">
      <div>
        <span class="font-weight-bold">Donation Total:</span>
        €{{ formatAmount(total) }}
      </div>
      <v-spacer />
      <div>
        <v-radio-group v-model="sortOpt" row class="pa-0 ma-0" hide-details label="Sort By">
          <v-radio label="Added" :value="0" />
          <v-radio label="Name" :value="1" />
          <v-radio label="Amount" :value="2" class="mr-0" />
        </v-radio-group>
      </div>
    </div>
    <v-btn @click="addBlank">Add New Milestone</v-btn>
    <div v-if="!milestonesSorted.length" class="pa-3 font-italic">
      No milestones created, add a new one with the button above.
    </div>
    <div v-else :style="{ height: '350px', 'overflow-y': 'scroll', 'margin-top': '10px' }">
      <Milestone
        v-for="(milestone, i) in milestonesSorted"
        :key="milestone.id"
        :milestone="milestone"
        :index="i"
      />
    </div>
  </v-app>
</template>
