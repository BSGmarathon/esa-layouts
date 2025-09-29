<script setup lang="ts">
import { Bids } from '@esa-layouts/types/schemas';
import gsap from 'gsap';
import { formatUSD, wait } from '@esa-layouts/graphics/_misc/helpers';
import { bids as allBids } from '@esa-layouts/browser_shared/replicant_store';
import { getBid } from '@esa-layouts/graphics/omnibar/utils/bidwars';
import { computed, onMounted, ref, watch } from 'vue';
import { waitForReplicant } from '@esa-layouts/browser_shared/helpers';

const emit = defineEmits<{ end: [] }>();
const { bidId, seconds } = defineProps<{
  seconds: number;
  bidId: number;
}>();
const tweened = ref({ progress: 0, total: 0 });
const bid = ref<Bids[0]>({
  id: -1,
  goal: 69,
  game: '',
  name: '',
  options: [],
  war: true,
  allowUserOptions: false,
  total: 0,
});
const amountLeft = computed(() => formatUSD(Math.max((bid.value.goal ?? 0) - tweened.value.total, 0)));

function tweenValues(): void {
  gsap.to(tweened.value, {
    progress: (bid.value.total / (bid.value.goal ?? 0)) * 100,
    total: bid.value.total,
    duration: 2.5,
  });
}

watch(() => allBids.data, (newVal) => {
  if (!newVal) return;

  try {
    bid.value = getBid(newVal, bidId);
    tweenValues();
  } catch (e) {
    emit('end');
  }
}, { deep: true, immediate: true });

onMounted(async () => {
  await waitForReplicant(allBids);

  try {
    bid.value = getBid(allBids.data!, bidId);
    tweenValues();
  } catch (e) {
    emit('end');
    return;
  }

  if (seconds >= 0) {
    await wait(seconds * 1000); // Wait the specified length.
    emit('end');
  }
});
</script>

<template>
  <div
    class="Goal"
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
      <div
        class="Bar"
        :style="{
          position: 'absolute',
          width: `${tweened.progress}%`,
          height: '100%',
          'background-color': '#6DD47E', // BSG
        }"
      />
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
        }"
      >
        <div :style="{ width: '30%', 'font-size': '0px', }">
          <span class="BarText" :style="{ 'font-size': '20px' }">
            <span
              v-if="bid.goal! <= bid.total"
              :style="{
                'color': '#42ff38', // Basic green, no need to use theme
                'font-weight': 700,
              }"
            >
              MET!
            </span>
            <span v-else>
              <span :style="{ 'font-weight': 600 }">Remaining:</span>
              {{ amountLeft }}
            </span>
          </span>
        </div>
        <div class="BarTextFull" :style="{ 'font-size': '20px', 'text-align': 'center' }">
          <div>
            {{ bid.game }}
            <br/>{{ bid.name }}
          </div>
        </div>
        <div
          :style="{
            width: '30%',
            'text-align': 'right',
            'font-size': '0px',
          }"
        >
          <span class="BarText" :style="{ 'font-size': '25px' }">
            <span :style="{ 'font-weight': 600 }">Goal:</span>
            {{ formatUSD(bid.goal || 0) }}
          </span>
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

  .BarTextFull {
    background-color: rgba(0, 0, 0, 0.4);
    padding: 0 10px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    line-height: 150%;
    height: 100%
  }
</style>
