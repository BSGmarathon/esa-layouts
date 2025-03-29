<script setup lang="ts">
import { Bids } from '@esa-layouts/types/schemas';
import Goal from './Bid/Goal.vue';
import War1v1 from './Bid/War-1v1.vue';
import WarOther from './Bid/War-Other.vue';

interface BidProps {
  seconds: number;
  bid: Bids[0];
  bidId: number;
}

const emit = defineEmits(['end']);
withDefaults(defineProps<BidProps>(), {
  seconds: 25,
});

function end(): void {
  emit('end');
}
</script>

<template>
  <div :style="{ height: '100%', overflow: 'hidden' }">
    <!-- Goal -->
    <Goal v-if="bid && !bid.war" :bid-id="bidId" :seconds="seconds" @end="end" />
    <!-- Wars -->
    <template v-else-if="bid">
      <!-- If we have exactly 2 options, it's a 1v1 bid war. -->
      <War1v1
        v-if="bid.options.length === 2 && !bid.allowUserOptions"
        :bid-id="bidId"
        :seconds="seconds"
        @end="end"
      />
      <WarOther v-else :bid-id="bidId" :seconds="seconds" @end="end" />
    </template>
  </div>
</template>
