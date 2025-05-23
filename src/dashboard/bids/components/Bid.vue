<script setup lang="ts">
import MediaCard from '@esa-layouts/dashboard/_misc/components/MediaCard.vue';
import { Bids } from '@esa-layouts/types/schemas';
import { omnibar, soloedBidID } from '@esa-layouts/browser_shared/replicant_store';
import { computed } from 'vue';

interface BidProps {
  bid: Bids[0];
  index: number;
}

const props = defineProps<BidProps>();
const isPinned = computed(() => omnibar.data?.pin?.type === 'Bid' && omnibar.data?.pin?.id === props.bid.id);
const isSoloed = computed(() => soloedBidID.data === props.bid.id);

function pin(): void {
  if (!omnibar.data) return;

  if (isPinned.value) {
    omnibar.data.pin = null;
  } else {
    omnibar.data.pin = { type: 'Bid', id: props.bid.id };
  }

  omnibar.save();
}

function toggleSolo(): void {
  if (isSoloed.value) {
    soloedBidID.data = null;
  } else {
    soloedBidID.data = props.bid.id;
  }

  soloedBidID.save();
}
</script>

<template>
  <MediaCard
    class="d-flex align-center px-2"
    :style="{ 'text-align': 'unset', height: '40px', 'margin-top': index > 0 ? '10px' : 0 }"
  >
    <div class="flex-grow-1" :style="{ overflow: 'hidden' }">
      <span
        :class="{ 'font-italic': isPinned && bid.name.includes('no longer available') }"
      >
        {{ bid.game || 'N/A' }} - {{ bid.name }}
      </span>
    </div>
    <v-spacer />
    <v-icon @click="pin">
      <template v-if="isPinned">mdi-pin-off</template>
      <template v-else>mdi-pin</template>
    </v-icon>
    <v-spacer />
    <v-btn elevation="2" :color="isSoloed ? 'warning' : ''" @click="toggleSolo">
      <v-icon>
        <template v-if="isSoloed">mdi-crosshairs-gps</template>
        <template v-else>mdi-crosshairs</template>
      </v-icon>
    </v-btn>
  </MediaCard>
</template>
