<script setup lang="ts">
import { IntermissionSlides } from '@esa-layouts/types/schemas';
import { computed, defineEmits, defineProps, onMounted } from 'vue';
import { bids } from '@esa-layouts/browser_shared/replicant_store';
import { formatUSD } from '../../../_misc/helpers';
import Container from '../Container.vue';

const props = defineProps<{
  current: IntermissionSlides['current'],
}>();
const emit = defineEmits<{
  end: [],
}>();
const bid = computed(() => bids.data!.find((b) => b.id === props.current?.bidId));
const runTitle = computed(() => {
  if (bid.value) {
    const arr = [
      bid.value.game || '?',
      bid.value.category,
    ].filter(Boolean);

    return arr.join(' - ');
  }

  return '?';
});

onMounted(() => {
  // We should always have a bid, this is just a backup in case.
  if (!bid.value) {
    emit('end');
  } else {
    window.setTimeout(() => emit('end'), 20 * 1000);
  }
});
</script>

<template>
  <Container v-if="bid">
    <template v-slot:header>
      <template v-if="!bid.war">
        Upcoming Goal
      </template>
      <template v-else>
        Upcoming Bid War
      </template>
    </template>
    <template v-slot:content>
      <div
        v-if="runTitle"
        :style="{ 'font-size': '45px' }"
      >
        {{ runTitle }}
      </div>
      <div :style="{ 'font-size': '32px' }">
        {{ bid.name }}
      </div>
      <div :style="{ 'font-size': '40px' }">
        <template v-if="!bid.war">
          {{ formatUSD(bid.total) }}/{{ bid.goal ? formatUSD(bid.goal) : '?' }}
        </template>
        <template v-else>
          <div v-if="bid.options.length">
            <div
              v-for="option in bid.options.slice(0, 5)"
              :key="`${option.name}${option.total}`"
            >
              {{ option.name }} ({{ formatUSD(option.total) }})
            </div>
            <div v-if="bid.allowUserOptions">
              ...or you could submit your own idea!
            </div>
          </div>
          <div v-else-if="bid.allowUserOptions">
            No options submitted yet, be the first!
          </div>
        </template>
      </div>
    </template>
  </Container>
</template>

<style scoped>
  .Content > * {
    padding: 10px 0;
  }
</style>
