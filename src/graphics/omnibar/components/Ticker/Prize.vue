<script setup lang="ts">
import { wait } from '@esa-layouts/graphics/_misc/helpers';
import { Prizes } from '@esa-layouts/types/schemas';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import utc from 'dayjs/plugin/utc';
import en from 'dayjs/locale/en-gb';
import { computed, onMounted } from 'vue';

dayjs.extend(relativeTime);
dayjs.extend(utc);

// Sets up custom locale (used later) to tweak some relativeTime strings.
dayjs.locale({
  ...en,
  name: 'en-prizes',
  relativeTime: {
    ...en.relativeTime,
    s: 'few seconds',
    m: 'minute',
    h: 'hour',
    d: 'day',
    M: 'month',
    y: 'year',
  },
}, {}, true);

interface PrizeProps {
  seconds: number;
  prize: Prizes[0];
}

const emit = defineEmits<{ end: [] }>();
const { seconds, prize } = withDefaults(defineProps<PrizeProps>(), {
  seconds: 25,
});
const timeUntilString = computed(() => (prize.endTime
  ? dayjs.unix(prize.endTime / 1000).utc().locale('en-prizes').fromNow(true)
  : ''));

onMounted(async () => {
  await wait(seconds * 1000); // Wait the specified length.
  emit('end');
});
</script>

<template>
  <div
    class="Flex"
    :style="{
      padding: '0 17px',
      'padding-top': '10px',
      height: '100%',
      'font-weight': 500,
      'flex-direction': 'column',
      'align-items': 'flex-start',
    }"
  >
    <div :style="{ 'font-size': '35px' }">
      Prize Available: {{ prize.name }}
    </div>
    <div :style="{ 'font-size': '20px' }">
      Provided by {{ prize.provided }}, minimum donation amount: ${{ prize.minimumBid.toFixed(2) }}
      (donate in the next {{ timeUntilString }})
    </div>
  </div>
</template>
