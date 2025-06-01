<script setup lang="ts">
import { Tracker } from '@esa-layouts/types';

interface DonationItemProps {
  data: Tracker.FormattedDonation;
  index: number;
}

withDefaults(defineProps<DonationItemProps>(), {
  index: 0,
});
</script>

<template>
  <div :style="{ padding: '20px 0', 'border-top': '3px solid white' }">
    <div :style="{ 'font-size': '35px' }">
      #{{ index + 1 }}: {{ data.name }} donated ${{ data.amount.toFixed(2) }}
    </div>
    <div
      v-if="data.comment"
      :style="{ 'font-size': '25px' }"
    >
      {{ data.comment }}
    </div>
  </div>
</template>
