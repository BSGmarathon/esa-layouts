<script setup lang="ts">
import { additionalDonations } from '@esa-layouts/browser_shared/replicant_store';
import { computed } from 'vue';

interface DonationProps {
  donation: {
    key: string,
    description: string,
    amount: number,
    active: boolean,
  };
}

const { donation } = defineProps<DonationProps>();

function toggleItem(active: boolean) {
  if (!additionalDonations.data) {
    return;
  }

  const donationIndex = additionalDonations.data.findIndex((d) => d.key === donation.key);

  if (donationIndex > -1) {
    additionalDonations.data[donationIndex].active = active;
  } else {
    additionalDonations.data.push({ key: donation.key, active });
  }

  additionalDonations.save();
  nodecg.sendMessage('additionalDonationToggle', { key: donation.key, active });
}

const toggle = computed({
  get: () => donation.active,
  set: (active: boolean) => toggleItem(active),
});
</script>

<template>
  <div class="d-flex">
    {{ donation.description }} - ${{ donation.amount }}
    - <v-checkbox class="ma-0 pa-0 ml-1" v-model="toggle" />
  </div>
</template>
