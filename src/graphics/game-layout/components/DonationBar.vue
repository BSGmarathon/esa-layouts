<script setup lang="ts">
import { notableDonations } from '@esa-layouts/browser_shared/replicant_store';
import DonationBox from './DonationBar/DonationBox.vue';

defineProps<{
  padding?: number | string | undefined;
}>();
</script>

<template>
  <transition-group
    tag="div"
    name="donations"
    class="Fixed Flex DonationBar"
    :style="{
      'justify-content': 'flex-start',
      'font-size': '30px',
    }"
  >
    <DonationBox
      v-for="donation in notableDonations.data"
      :key="donation._id"
      :donation="donation"
      :padding="padding"
    />
  </transition-group>
</template>

<style scoped>
  .donations-enter-active {
    transition: all 1s;
  }
  .donations-enter, .donations-leave-to {
    opacity: 0;
    transform: translateY(100%);
  }
  .donations-move {
    transition: transform 1s;
  }
</style>
