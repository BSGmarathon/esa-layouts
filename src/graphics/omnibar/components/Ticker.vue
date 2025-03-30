<script setup lang="ts">
import { omnibar } from '@esa-layouts/browser_shared/replicant_store';
import { awaitTimeout, wait, areObjectsEqual, areOmnibarObjectsEqual } from '@esa-layouts/graphics/_misc/helpers';
import { DashProps, Omnibar } from '@esa-layouts/types/schemas';
import { ref, nextTick, watch } from 'vue';
import GenericMsg from './Ticker/GenericMsg.vue';
import Tweet from './Ticker/Tweet.vue';
import MiniCredits from './Ticker/MiniCredits.vue';
import CrowdControl from './Ticker/CrowdControl.vue';
import UpcomingRun from './Ticker/UpcomingRun.vue';
import Prize from './Ticker/Prize.vue';
import Bid from './Ticker/Bid.vue';
import Milestone from './Ticker/Milestone.vue';
import MusicTrack from './Ticker/MusicTrack.vue';

const omnibarTypes = {
  GenericMsg,
  Tweet,
  MiniCredits,
  CrowdControl,
  UpcomingRun,
  Prize,
  Bid,
  Milestone,
  MusicTrack,
};

const emit = defineEmits<{
  'set-dash': [nextDash: DashProps | null | undefined]
}>();
const mayShow = ref(true);

// Sends "omnibarShowNext" to extension; retries if not successful after 5s.
async function showNext(): Promise<void> {
  try {
    await awaitTimeout(nodecg.sendMessage('omnibarShowNext'), 5000);
  } catch (err) {
    showNext();
  }
}

async function onOmnibarChange(newVal?: Omnibar, oldVal?: Omnibar): Promise<void> {
  // if there was no change, we don't need to hide stuff
  if (areOmnibarObjectsEqual(newVal, oldVal)) {
    return;
  }

  mayShow.value = false;
  await nextTick();
  await wait(500);

  const oldDash = oldVal?.current?.props?.dash;
  const nextDash = newVal?.current?.props?.dash;

  // if the dash has changed, we need to clear it out and set the new dash
  if (!areObjectsEqual(oldDash, nextDash)) {
    // Wait for the dash to hide before showing next
    emit('set-dash', null);
    await wait(500);
    await nextTick();

    // wait before starting the next animation
    await wait(600);

    emit('set-dash', nextDash);
    await nextTick();

    if (nextDash) {
      await wait(600);
    }
  }

  mayShow.value = true;
}

watch(() => omnibar.data, (newVal, oldVal) => onOmnibarChange(newVal, oldVal));
</script>

<template>
  <div
    id="Ticker"
    class="Grid"
    :style="{
      flex: 1,
      overflow: 'hidden',
      height: '100%',
      'padding-top': '0',
      // 'min-width': 0, // was probably used for overlapping things?
    }"
  >
    <transition name="ticker">
      <component
        v-if="omnibar.data?.current && mayShow"
        :is="omnibarTypes[omnibar.data.current.type]"
        :key="`${omnibar.data.current.type}${JSON.stringify(omnibar.data.current.props)}`"
        v-bind="omnibar.data.current.props"
        @end="showNext"
      />
    </transition>
  </div>
</template>

<style lang="scss" scoped>
#Ticker {
  height: 100%;
  min-width: 0;
  flex: 1;
  padding-top: 2px;
  margin-left: 0px;
  align-items: center;
  font-family: 'Bahnschrift', sans-serif;
}

.ticker-leave-active {
  animation: fadeOutUp;
  animation-duration: 500ms;
  animation-timing-function: ease-in-out;
}

.ticker-enter-active {
  animation: fadeInUp;
  animation-duration: 500ms;
  animation-timing-function: ease-in-out;
}

.ticker-enter, .ticker-leave-to {
  opacity: 0;
}
</style>
