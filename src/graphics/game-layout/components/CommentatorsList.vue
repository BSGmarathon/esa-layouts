<script setup lang="ts">
import { commentatorsNew, donationReaderNew } from '@esa-layouts/browser_shared/replicant_store';
</script>

<template>
  <div v-if="commentatorsNew?.data">
    <div
      v-for="({ name, pronouns }, i) in commentatorsNew.data"
      :key="i"
      class="Flex"
      :class="{
        'BorderTop': i > 0,
      }"
      :style="{
      width: '100%',
      'align-items': 'center',
      height: '44px',
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
      >Comm
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
            <span>
              {{ name }}
              <span
                v-if="pronouns"
                class="Pronouns">{{ pronouns }}</span>
            </span>
        </span>
        </div>
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
