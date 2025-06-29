<script setup lang="ts">
import { IntermissionSlides } from '@esa-layouts/types/schemas';
import dayjs from 'dayjs';
import en from 'dayjs/locale/en-gb';
import relativeTime from 'dayjs/plugin/relativeTime';
import utc from 'dayjs/plugin/utc';
import { computed, defineEmits, defineProps, onMounted } from 'vue';
import { prizes } from '@esa-layouts/browser_shared/replicant_store';
import { formatUSD } from '../../../_misc/helpers';
import Container from '../Container.vue';

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

const props = defineProps<{
  current: IntermissionSlides['current'],
}>();
const emit = defineEmits<{
  end: [],
}>();

const prize = computed(() => prizes.data!.find((p) => p.id === props.current?.prizeId));
const etaUntil = computed(() => (prize.value?.endTime
  ? dayjs.unix(prize.value.endTime / 1000).utc().locale('en-prizes').fromNow(true)
  : undefined));

onMounted(() => {
  // We should always have a prize, this is just a backup in case.
  if (!prize.value) {
    emit('end');
  } else {
    window.setTimeout(() => emit('end'), 20 * 1000);
  }
});
</script>

<template>
  <Container v-if="prize">
    <template v-slot:header>
      Prize Available
    </template>
    <template v-slot:content>
      <img
        v-if="prize.image"
        :src="prize.image"
        :style="{
          height: '400px',
          'object-fit': 'contain',
        }"
      />
      <div :style="{ 'font-size': '30px' }">
        {{ prize.name }}
        <template v-if="prize.provided">
          provided by {{ prize.provided }}
        </template>
      </div>
      <div :style="{ 'font-size': '30px' }">
        Minimum donation amount: {{ formatUSD(prize.minimumBid) }}
      </div>
      <div
        v-if="etaUntil"
        :style="{ 'font-size': '30px' }"
      >
        Donate in the next {{ etaUntil }}
      </div>
    </template>
  </Container>
</template>
