<script setup lang="ts">
import { computed, ref, onMounted } from 'vue';
import { commentatorsNew } from '@esa-layouts/browser_shared/replicant_store';

const show = computed(() => commentatorsNew.data?.length);

const namesParentRef = ref();
const namesContentRef = ref();

const timeBeforeBeginOfScrolling = 5000;
const timeToWaitAtEndOfScrolling = 2500;
const currentLoop = ref(0);
const scrollToPosition = ref(0);

function scrollLoop() {
  setTimeout(() => {
    namesParentRef.value.scroll({ top: 0, left: currentLoop.value, behavior: 'smooth' });
    currentLoop.value += 1;
    if (currentLoop.value < scrollToPosition.value) {
      scrollLoop();
    } else {
      // after we're done scrolling the entire length we dawdle on the end a bit before scrolling back
      setTimeout(() => {
        namesParentRef.value.scroll({ top: 0, left: 0, behavior: 'smooth' });
        currentLoop.value = 0;
      }, timeToWaitAtEndOfScrolling);
      setTimeout(() => {
        scrollLoop();
      }, timeBeforeBeginOfScrolling);
    }
  }, 50);
}

// This checks if we need to scroll at all
// this does rely on the parent container having the overflow: hidden; property set
// as that impacts the rendered width
function namesOverflow() {
  if (namesContentRef.value.clientWidth > namesParentRef.value.clientWidth) {
    // the difference in parent container and all the names content is the width we need to scroll
    // we do add 20 to account for margins and fancy lines in the actual border
    scrollToPosition.value = (namesContentRef.value.clientWidth - namesParentRef.value.clientWidth) + 20;
    scrollLoop();
  }
}

onMounted(() => {
  setTimeout(() => {
    namesOverflow();
  }, timeBeforeBeginOfScrolling);
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
    <div class="namesParent" ref="namesParentRef">
      <div class="namesContent" ref="namesContentRef">
        <span v-for="({ name, pronouns }, i) in commentatorsNew.data" :id="`name_${i}`" :key="i" class="">
          {{ name }}
          <span
            v-if="pronouns"
            class="Pronouns">{{ pronouns }}</span><template
          v-if="i < commentatorsNew.data!.length - 1">,</template>
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

  .namesParent {
    padding-left: 5px;
    padding-right: 5px;
    white-space: nowrap;
    width: 100%;
    display: flex;
    overflow: hidden;
  }
</style>
