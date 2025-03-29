<script setup lang="ts">
import { donationTotal } from '@esa-layouts/browser_shared/replicant_store';
import { formatUSD, wait } from '@esa-layouts/graphics/_misc/helpers';
import { DonationTotalMilestones } from '@esa-layouts/types/schemas';
import gsap from 'gsap';
import { computed, onMounted, ref, watch } from 'vue';

interface MilstoneProps {
  seconds: number;
  milestone: DonationTotalMilestones[0];
}

const { milestone, seconds } = withDefaults(defineProps<MilstoneProps>(), {
  seconds: 25,
});
const emit = defineEmits<{ end: [] }>();
const tweenedValues = ref({ progressTweened: 0, totalTweened: 0 });
const name = computed(() => milestone.name);
const amount = computed(() => formatUSD(milestone.amount || 0));
const amountLeft = computed(() => formatUSD(Math.max((milestone.amount || 0) - tweenedValues.value.totalTweened, 0)));
const isMet = computed(() => !!(milestone.amount
  && tweenedValues.value.totalTweened && milestone.amount <= tweenedValues.value.totalTweened));

function getProgress(): number {
  if (!milestone.amount || !donationTotal.data) return 0;
  const lower = milestone.addition ? milestone.amount - milestone.addition : 0;
  return Math.min((donationTotal.data - lower) / (milestone.amount - lower), 1) * 100;
}

function tweenValues(): void {
  gsap.to(tweenedValues.value, {
    progressTweened: getProgress(),
    totalTweened: donationTotal.data!,
    duration: 2.5,
  });
}

watch(() => donationTotal.data, () => {
  tweenValues();
});

function end(): void {
  emit('end');
}

onMounted(async () => {
  tweenValues();

  if (seconds >= 0) {
    await wait(seconds * 1000); // Wait the specified length.
    end();
  }
});
</script>

<template>
  <div
    class="Flex Milestone"
    :style="{
      height: '100%',
      'align-items': 'center',
      'white-space': 'nowrap',
    }"
  >
    <div
      class="Flex"
      :style="{
        position: 'relative',
        'flex-grow': 1,
        margin: '10px',
        height: '65px',
        'background-color': 'rgba(0, 0, 0, 0.3)',
      }"
    >
      <div
        class="Bar"
        :style="{
          position: 'absolute',
          'z-index': 0,
          width: `${tweenedValues.progressTweened}%`,
          height: '100%',
          'background-color': '#6DD47E',
        }"
      />
      <div
        :style="{
          display: 'flex',
          'justify-content': 'space-between',
          'align-items': 'center',
          'align-content': 'center',
          // position: 'absolute',
          'z-index': 1,
          width: '100%',
          height: '100%',
          padding: '0 10px',
          'box-sizing': 'border-box',
        }"
      >
        <!-- Why is the font size set to 0px here? REMOVING IT PUSHES THE TEXT OFF CENTER -->
        <div :style="{ width: '20%', 'font-size': '0px', }">
          <span class="BarText" :style="{ 'font-size': '25px' }">
            <span v-if="isMet" :style="{ 'color': '#e8d53a', 'font-weight': 700 }">MET!</span>
            <span v-else>
              <span :style="{ 'font-weight': 600 }">Remaining:</span>
              {{ amountLeft }}
            </span>
          </span>
        </div>
        <div class="BarText" :style="{ 'font-size': '30px' }">
          <span>{{ name }}</span>
        </div>
        <div
          :style="{
            width: '20%',
            'text-align': 'right',
            'font-size': '0px',
          }"
        >
          <span
            class="BarText" :style="{ 'font-size': '25px' }">
            <span :style="{ 'font-weight': 600 }">Goal:</span>
            {{ amount }}
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
</style>
