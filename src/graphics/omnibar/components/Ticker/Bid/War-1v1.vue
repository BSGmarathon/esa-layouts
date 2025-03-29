<script setup lang="ts">
import { formatUSD, wait } from '@esa-layouts/graphics/_misc/helpers';
import { Bids } from '@esa-layouts/types/schemas';
import gsap from 'gsap';
import { bids as allBids } from '@esa-layouts/browser_shared/replicant_store';
import { getBid } from '@esa-layouts/graphics/omnibar/utils/bidwars';
import { onMounted, ref, watch } from 'vue';
import { waitForReplicant } from '@esa-layouts/browser_shared/helpers';

const emit = defineEmits<{ end: [] }>();
const { bidId, seconds } = defineProps<{
  seconds: number;
  bidId: number;
}>();
const tweened = ref({ progress1: 0, progress2: 0, total1: 0, total2: 0 });
const bid = ref<Bids[0]>({
  id: -1,
  game: '',
  name: '',
  options: [
    {
      name: '',
      parent: -1,
      total: 0,
      id: 1,
    },
    {
      name: '',
      parent: -1,
      total: 0,
      id: 2,
    },
  ],
  war: true,
  allowUserOptions: false,
  total: 0,
});

function tweenValues(): void {
  gsap.to(tweened.value, {
    progress1: (bid.value.options[0].total / bid.value.total) * 100,
    progress2: (bid.value.options[1].total / bid.value.total) * 100,
    total1: bid.value.options[0].total,
    total2: bid.value.options[1].total,
    duration: 2.5,
  });
}

watch(() => allBids.data, (newVal) => {
  if (!newVal) return;

  bid.value = getBid(newVal, bidId);
  tweenValues();
}, { deep: true, immediate: true });

onMounted(async () => {
  await waitForReplicant(allBids);

  bid.value = getBid(allBids.data!, bidId);
  tweenValues();

  if (seconds >= 0) {
    await wait(seconds * 1000); // Wait the specified length.
    emit('end');
  }
});
</script>

<template>
  <div
    class="War1v1"
    :style="{
      height: '100%',
      display: 'flex',
      'align-items': 'center',
    }"
  >
    <div
      :style="{
        position: 'relative',
        'flex-grow': 1,
        // margin: '10px',
        height: '70px',
        'background-color': 'rgba(0, 0, 0, 0.3)',
      }"
    >
      <!-- Coloured Bars -->
      <div
        :style="{
          display: 'flex',
          'justify-content': 'space-between',
          position: 'absolute',
          width: '100%',
          height: '100%',
        }"
      >
        <div
          :style="{
            width: `${tweened.progress1}%`,
            'background-color': '#FFD55A',
          }"
        />
        <div
          :style="{
            width: `${tweened.progress2}%`,
            'background-color': '#6DD47E',
          }" />
      </div>
      <!-- Both Options -->
      <div
        :style="{
          display: 'flex',
          'justify-content': 'space-between',
          'align-items': 'center',
          position: 'absolute',
          width: '100%',
          height: '100%',
          padding: '0 10px',
          'box-sizing': 'border-box',
          'z-index': 1,
          'font-size': '0px',
        }"
      >
        <div>
          <span class="BarText" :style="{ 'font-size': '20px' }">
            {{ bid.options[0].name }} - {{ formatUSD(tweened.total1) }}
          </span>
        </div>
        <div :style="{ 'text-align': 'right' }">
          <span class="BarText" :style="{ 'font-size': '20px' }">
             {{ formatUSD(tweened.total2) }} - {{ bid.options[1].name }}
          </span>
        </div>
      </div>
      <!-- Name -->
      <div
        :style="{
          position: 'absolute',
          width: '100%',
          height: '100%',
          'z-index': 2,
          'display': 'flex',
          'justify-content': 'center',
        }"
      >
        <div
          :style="{
            'font-size': '20px',
            'text-align': 'center',
            'background-color': 'rgba(0, 0, 0, 0.4)',
            'padding': '0 10px',
            'display': 'flex',
            'flex-direction': 'column',
            'justify-content': 'center',
            'line-height': '150%',
            'height': '100%',
          }"
        >
          {{ bid.game }}
          <br>{{ bid.name }}
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
  .BarText {
    background-color: rgba(0, 0, 0, 0.4);
    padding: 7px 10px;
    border-radius: 15px;
  }
</style>
