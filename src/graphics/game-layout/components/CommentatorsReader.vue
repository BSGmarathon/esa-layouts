<script setup lang="ts">
import fitty, { FittyInstance } from 'fitty';
import { defineProps, useTemplateRef, onMounted, onUnmounted, computed } from 'vue';
import { commentatorsNew, donationReaderNew } from '@esa-layouts/browser_shared/replicant_store';

const props = defineProps<{
  showReader: boolean;
  lineTop: boolean;
}>();
const toFit = useTemplateRef<HTMLElement>('Fit');
const show = computed(() => !!(props.showReader ? donationReaderNew.data : commentatorsNew.data?.length));

let fittyInstance: FittyInstance;

onMounted(() => {
  fittyInstance = fitty(toFit.value!, {
    minSize: 1,
    maxSize: 30,
    multiLine: false,
  });
});

onUnmounted(() => {
  fittyInstance.unsubscribe();
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
      [borderLocation]: '5px solid var(--bsg-color)',
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
      <template v-if="showReader">Host</template>
      <template v-else>Comm</template>
    </div>
    <div
      class="Flex"
      :style="{
        // width: '486px',
        width: '100%',
        height: '43px',
        'justify-content': 'center',
        'align-items': 'center',
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
          <template v-if="showReader">
            <template v-if="donationReaderNew">{{ donationReaderNew.name }}</template><span
              v-if="donationReaderNew && donationReaderNew.pronouns"
              class="Pronouns">{{ donationReaderNew.pronouns }}</span>
          </template>

          <template v-else>
            <!-- weird html? I know -->
            <!-- new lines are taken as extra spacing here -->
            <span v-for="({ name, pronouns }, i) in commentatorsNew" :key="i">
              {{ name }}
              <span
                v-if="pronouns"
                class="Pronouns">{{ pronouns }}</span><template
              v-if="i < comms.length - 1">,</template>
            </span>
          </template>
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
</style>
