<script setup lang="ts">
import { NotableDonations } from '@esa-layouts/types/schemas';
import { computed, defineProps } from 'vue';

const props = defineProps<{
  donation: NotableDonations[0],
  padding?: number | string | undefined,
}>();

const tierClass = computed(() => {
  const rand = 1 + Math.floor(Math.random() * 3);

  if (props.donation.amount < 50) { // Under $50
    return `DonationBoxTier1-${rand}`;
  }

  if (props.donation.amount >= 50 && props.donation.amount < 100) { // $50 - $100
    return `DonationBoxTier2-${rand}`;
  }

  if (props.donation.amount >= 100) { // $100+
    return 'DonationBoxTier3';
  }

  return 'DonationBox';
});
</script>

<template>
  <div
    :class="`Flex ${tierClass}`"
    :style="{
      height: '100%',
      padding: `0 ${padding ?? 15}px`,
      'margin-right': '3px',
      'white-space': 'nowrap',
    }"
  >
    ${{ Number.isInteger(donation.amount)
      ? donation.amount : donation.amount.toFixed(2)
    }} [{{ donation.donor_visiblename }}]
  </div>
</template>
