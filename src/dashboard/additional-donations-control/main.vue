<script setup lang="ts">
import { additionalDonations } from '@esa-layouts/browser_shared/replicant_store';
import { computed, onMounted } from 'vue';
import { waitForReplicant } from '@esa-layouts/browser_shared/helpers';
import { useHead } from '@vueuse/head';
import Donation from './components/Donation.vue';

useHead({ title: 'Additional donations control' });

const additionalDonationsCfg = nodecg.bundleConfig.additionalDonations;
const additionalDonationsMapped = computed(
  () => additionalDonationsCfg.map((d) => ({
    key: d.key,
    description: d.description,
    amount: d.amount,
    active: additionalDonations.data?.find((a) => a.key === d.key)?.active ?? false,
  })),
);

function formatAmount(val: number): string {
  return val.toLocaleString('en-US', { maximumFractionDigits: 0 });
}

onMounted(async () => {
  await waitForReplicant(additionalDonations);
});
</script>

<template>
  <v-app>
  <div class="mb-2">
    <Donation
      v-for="donation of additionalDonationsMapped"
      :key="donation.key"
      :donation="donation"
    />
  </div>
  </v-app>
</template>
