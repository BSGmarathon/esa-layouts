<script setup lang="ts">
import { areObjectsEqual, formatUSD, wait } from '@esa-layouts/graphics/_misc/helpers';
import { Bids } from '@esa-layouts/types/schemas';
import gsap from 'gsap';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';
import { orderBy } from 'lodash';
import { bids as allBids } from '@esa-layouts/browser_shared/replicant_store';
import { getBid } from '@esa-layouts/graphics/omnibar/utils/bidwars';
import { computed, nextTick, onBeforeUnmount, onMounted, ref, useTemplateRef, watch } from 'vue';
import { waitForReplicant } from '@esa-layouts/browser_shared/helpers';

gsap.registerPlugin(ScrollToPlugin);

type Option = { id: number, name: string, total: number, winning: boolean };

const emit = defineEmits<{ end: [] }>();
const { bidId, seconds } = defineProps<{
  seconds: number;
  bidId: number;
}>();
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
const options = computed(() => {
  const ordered = orderBy(bid.value.options, ['total'], ['desc']);
  return ordered.map(({ id, name, total }, i) => (
    { id, name, total, winning: (i === 0 || total >= ordered[0].total) && total > 0 }));
});
const optionCache = ref<Option[]>([]);
const optionsBar = useTemplateRef<HTMLElement>('OptionsBar');
let timeline: gsap.core.Timeline | undefined;
let bidHasUpdated = false;

function getOptions(): Option[] {
  const ordered = orderBy(bid.value.options, ['total'], ['desc']);
  return ordered.map(({ id, name, total }, i) => (
    { id, name, total, winning: (i === 0 || total >= ordered[0].total) && total > 0 }));
}

function killTimeline(): void {
  timeline?.kill();
  timeline = undefined;
}

async function resetForBidUpdate() {
  try {
    killTimeline();

    bid.value = getBid(allBids.data!, bidId);
    optionCache.value = getOptions();

    // Do we need this wait? IDK
    // Do I feel more comfy having it here? YES!!!!
    await nextTick();

    // eslint-disable-next-line @typescript-eslint/no-use-before-define
    await mountedCallback();
  } catch {
    emit('end');
  }
}

async function createTimeline(): Promise<void> {
  if (!optionsBar.value) {
    return;
  }

  bidHasUpdated = false;

  timeline = gsap.timeline({
    paused: true,
    onComplete: () => {
      window.setTimeout(() => {
        if (seconds >= 0) {
          emit('end');
        } else if (bidHasUpdated) {
          resetForBidUpdate().catch(console.log);
        } else {
          // If pinned and no updates, restart the timeline on end.
          timeline?.restart();
        }
      }, 4000);
    },
  });

  await wait(4000);
  const loopLength = bid.value.allowUserOptions ? options.value.length + 1 : options.value.length;
  const endPos = optionsBar.value.scrollWidth - optionsBar.value.clientWidth;

  // Check how many times we need to scroll along to fit everything in.
  let scrollCount = 0;
  for (let i = 1; i < loopLength; i += 1) {
    const rep = document.getElementById(`Option${i + 1}`)!;
    if (endPos > rep.offsetLeft) scrollCount += 1;
  }

  // Add animations to timeline to scroll correctly.
  for (let i = 1; i < loopLength; i += 1) {
    const rep = document.getElementById(`Option${i + 1}`)!;
    const insertionPosition = i > 1
      ? `+=${Math.max((seconds - 8) / (scrollCount + 1), 2)}`
      : undefined;

    timeline.to(optionsBar.value, {
      scrollLeft: Math.min(rep.offsetLeft, endPos),
      duration: 2,
    }, insertionPosition);
    if (endPos <= rep.offsetLeft) break;
  }

  // If pinned, scroll back to the start on finish.
  if (seconds < 1) {
    timeline.to(optionsBar.value, {
      scrollTo: { x: 0 },
      duration: 2,
    }, '+=4');
  }

  timeline.resume();
}

async function mountedCallback(): Promise<void> {
  // If no need to scroll, just wait a flat X seconds before ending.
  if (optionsBar.value!.scrollWidth <= optionsBar.value!.clientWidth) {
    if (seconds >= 0) {
      await wait(seconds * 1000);
      // emit('end');
    }

    return;
  }

  await createTimeline();
}

watch(() => allBids.data, (newVal) => {
  if (!newVal) {
    return;
  }

  const ourBId = getBid(newVal, bidId);

  if (!areObjectsEqual(bid.value, ourBId)) {
    bidHasUpdated = true;

    if (!timeline?.isActive()) {
      resetForBidUpdate().catch(console.log);
    }
  }
}, { deep: true });

onMounted(async () => {
  await waitForReplicant(allBids);

  try {
    // Copied in case the prop changes and ruins the animations.
    bid.value = getBid(allBids.data!, bidId);
    optionCache.value = getOptions();

    await nextTick();

    await mountedCallback();
  } catch (e: unknown) {
    console.error(e);
    emit('end');
  }
});

onBeforeUnmount(() => {
  killTimeline();
});
</script>

<template>
  <div
    class="WarOther"
    :style="{
      height: '100%',
      display: 'flex',
      'align-items': 'center',
    }"
  >
    <div
      :style="{
        'flex-grow': 1,
        display: 'flex',
        height: '70px',
        overflow: 'hidden',
      }"
    >
      <div
        :style="{
          display: 'flex',
          'justify-content': 'center',
          'flex-direction': 'column',
          'font-size': '20px',
          'text-align': 'center',
          padding: '0 10px',
          'white-space': 'nowrap',
          'line-height': '150%',
        }"
      >
        {{ bid.game }}
        <br>{{ bid.name }}
      </div>
      <div
        :style="{
          width: '3px',
          'background-color': 'white',
        }"
      />
      <div
        ref="OptionsBar"
        :style="{
          position: 'relative',
          'flex-grow': 1,
          'white-space': 'nowrap',
          'font-size': '20px',
          overflow: 'hidden',
          display: 'flex',
          'align-items': 'center',
        }"
      >
        <div
          v-for="(option, i) in optionCache" :key="option.id"
          class="Option"
          :style="{
            'background-color': option.winning ? '#6DD47E' : '#B37BA4',
            'margin-left': i > 0 ? '5px' : '0',
          }"
          :id="`Option${i + 1}`"
        >
          <span :style="{ 'font-weight': 600 }">
            {{ option.name }}
            </span>: {{ formatUSD(option.total) }}
        </div>
        <div
          v-if="bid.allowUserOptions"
          class="Option"
          :id="`Option${options.length + 1}`"
        >
          <template v-if="!options.length">No options submitted yet, be the first!</template>
          <template v-else>...or submit your own!</template>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
  .WarOther {
    --mask: linear-gradient(to right,
    rgba(0,0,0, 1) 0,   rgba(0,0,0, 1) 40%,
    rgba(0,0,0, 1) 98%, rgba(0,0,0, 0) 100%
    ) 100% 50% / 100% 100% repeat-y;

    -webkit-mask: var(--mask);
    mask: var(--mask);
  }

  .Option {
    display: flex;
    align-items: center;
    height: 100%;
    padding: 0 12px;
    font-size: 25px;

    &:last-of-type {
      margin-right: 10px;
    }
  }
</style>
