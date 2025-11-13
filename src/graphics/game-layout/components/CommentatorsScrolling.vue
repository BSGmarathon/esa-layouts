<script setup lang="ts">
import { computed, ref, watch, nextTick, useTemplateRef, onMounted } from 'vue';
import { commentatorsNew } from '@esa-layouts/browser_shared/replicant_store';

const rerenderTrigger = ref(true);
const show = computed(() => commentatorsNew.data?.length);
const scroller = useTemplateRef<HTMLMarqueeElement>('scroller');

watch(() => commentatorsNew?.data, async () => {
  rerenderTrigger.value = false;

  await nextTick();

  rerenderTrigger.value = true;
}, { deep: true, immediate: true });

onMounted(async () => {
  while (!scroller.value) {
    await nextTick();
  }

  console.log(scroller.value);

  scroller.value!.addEventListener('bounce', () => {
    console.log('boink');
    scroller.value!.stop();
  });
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
        width: '89px',
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
      class="Flex"
      :style="{
        // width: '486px',
        width: '100%',
        height: '43px',
        'justify-content': 'center',
        'align-items': 'center',
        overflow: 'hidden',
      }"
    >
      <div
        class="Flex"
        :style="{
        'text-align': 'center',
        'align-self': 'center',
      }">
        <span
          ref="Fit"
          :style="{
            'white-space': 'nowrap',
            display: 'flex !important',
          }"
        >
          <marquee
            v-if="rerenderTrigger"
            ref="scroller"
            behavior="alternate"
            direction="left"
            width="100%"
            scrolldelay="500"
            scrollamount="20"
          >
            <!-- weird html? I know -->
            <!-- new lines are taken as extra spacing here -->
            <span v-for="({ name, pronouns }, i) in commentatorsNew.data" :key="i">
              {{ name }}
              <span
                v-if="pronouns"
                class="Pronouns">{{ pronouns }}</span><template
              v-if="i < commentatorsNew.data!.length - 1">,</template>
            </span>
          </marquee>
        </span>
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

  marquee {
    padding-left: 10px;
    padding-right: 10px;
  }
</style>
