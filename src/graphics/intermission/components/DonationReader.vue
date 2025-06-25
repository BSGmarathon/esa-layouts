<script setup lang="ts">
import { computed } from 'vue';
import { donationReaderNew } from '@esa-layouts/browser_shared/replicant_store';

const name = computed(() => donationReaderNew.data?.name);
const pronouns = computed(() => donationReaderNew.data?.pronouns);
</script>

<template>
  <div
    v-if="donationReaderNew.data"
    class="FlexI DonationReader"
    :style="{ height: '100%' }"
  >
    <div
      class="Flex Mic"
      :style="{
        'box-sizing': 'border-box',
        height: '85%',
        padding: '0px'
      }"
    >
      <img
        src="./Mic.png"
        :style="{ height: '100%' }"
      />
    </div>
    <div
      :style="{
        'display': 'flex',
        padding: '0 15px',
      }"
    >
      {{ name }}
      <div
        v-if="pronouns"
        class="Pronouns"
        :style="{
            padding: '10px 5px',
            'margin-left': '10px',
          }"
      >
        {{ pronouns }}
      </div>
    </div>
  </div>
</template>

<style scoped>
  .Pronouns {
    position: relative;
    display: inline-block;
    font-weight: 400;
    font-size: 25px !important;
    top: -0.1em;
    line-height: 1.5em;
    text-transform: uppercase;
    padding: 0 3px;
    margin-left: 3px;
  }
</style>
