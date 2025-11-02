<script setup lang="ts">
import { computed, ref, watch, nextTick, useTemplateRef, onMounted } from 'vue';
import { commentatorsNew } from '@esa-layouts/browser_shared/replicant_store';
import gsap from 'gsap';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';
import { waitForReplicant } from '@esa-layouts/browser_shared/helpers';

gsap.registerPlugin(ScrollToPlugin);

const nameContainer = useTemplateRef<HTMLSpanElement>('NameFit');
const show = computed(() => commentatorsNew.data?.length);
let timeline: gsap.core.Timeline | null = null;
const hasTimeline = ref(false);

function killTimeline() {
  if (timeline) {
    timeline.kill();
    timeline = null;
    hasTimeline.value = false;
  }
}

async function initTimeline() {
  const container = nameContainer.value;

  if (!container) {
    return;
  }

  timeline = gsap.timeline({
    paused: true,
    yoyo: true,
    repeat: -1,
    repeatDelay: 4,
    delay: 0,
  });

  hasTimeline.value = true;

  timeline.to(container, {
    scrollTo: { x: container.scrollWidth },
    duration: 4,
    delay: -10,
    ease: 'none',
  });

  timeline.resume();
}

function createTimelineIfNeeded() {
  if (nameContainer.value!.scrollWidth <= nameContainer.value!.clientWidth) {
    console.log('Timeline is not needed');
    hasTimeline.value = false;
    return;
  }

  initTimeline();
}

watch(() => commentatorsNew.data, async () => {
  killTimeline();

  await nextTick();

  createTimelineIfNeeded();
}, { deep: true });

onMounted(async () => {
  await waitForReplicant(commentatorsNew);

  while (!nameContainer.value) {
    await nextTick();
  }

  createTimelineIfNeeded();
});
</script>

<template>
  <div
    v-show="show"
    class="Flex"
    :style="{
      width: '100%',
      'align-items': 'center',
      height: show ? '44px' : 0,
      opacity: show ? 1 : 0,
      'font-weight': 600,
      color: 'var(--text-color)',
      'font-family': 'Bahnschrift',
      'font-size': '1.5em',
    }"
  >
    <div
      class="Flex"
      :style="{
        width: '90px',
        height: '100%',
        background: 'var(--bsg-color)',
        'justify-content': 'center',
        'align-items': 'center',
        'font-weight': 300,
        'font-size': '15pt',
        'text-transform': 'uppercase',
        'font-family': 'pixelmix',
      }"
    >
      Comm
    </div>

    <div
      ref="NameFit"
      class="Flex namesParent"
      :style="{
          position: 'relative',
          width: '100%',
          height: '43px',
          'white-space': 'nowrap',
          display: 'flex !important',
          'align-items': 'center',
          'justify-content': hasTimeline ? undefined : 'center',
          overflow: 'hidden',
        }"
    >
      <!-- weird html? I know -->
      <!-- new lines are taken as extra spacing here -->
      <div v-for="({ name, pronouns }, i) in commentatorsNew.data" :id="`name_${i}`" :key="i">
        {{ name }}
        <span
          v-if="pronouns"
          class="Pronouns">{{ pronouns }}</span><template
        v-if="i < commentatorsNew.data!.length - 1">,</template>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
  .Pronouns {
    position: relative;
    height: 19px;
    margin-left: 5px;
    margin-right: 5px;

    font-size: 12pt;

    padding: 4px;

    //font-size: 0.8em;
    background: var(--slide-color);
    color: var(--text-color);
    text-transform: uppercase;
    font-family: pixelmix;
  }

  .namesParent {
    padding-left: 5px;
    padding-right: 5px;
  }
</style>
