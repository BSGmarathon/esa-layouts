<template>
  <!-- todo: locally store class CSS properties for safety -->
  <div
    v-show="prize"
    :class="vertical ? 'FlexColumn' : 'Flex'"
    :style="{
      'font-size': '1em', // move to prop?
      padding: '10px',
      'box-sizing': 'border-box',
      'text-align': 'center',
    }"
  >
    <img
      :src="prize.image"
      :style="{
        height: vertical ? '80%' : '100%',
        'object-fit': 'contain',
        'max-height': '350px',
        'margin-left': vertical ? 0 : '20px',
        'margin-bottom': vertical ? '10px' : 0,
      }"
    >
    <div :style="{ 'margin-left': vertical ? 0 : '20px' }">
      <div
        :style="{
          'font-size': '0.7em',
          color: 'white', // move to theme!
        }"
      >
        Want a chance to win prizes like...
      </div>
      <div :style="{ 'font-size': '1em' }">
        {{ prize.name }}?
      </div>
      <div
        :style="{
          'font-size': '1em',
          color: 'lightgrey', // move to theme!
        }"
      >
        Find more @ {{ prizesUrl }}
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import { formatUSD } from '@esa-layouts/browser_shared/helpers';
import { replicantNS } from '@esa-layouts/browser_shared/replicant_store';
import { Tracker } from '@esa-layouts/types';
import { MediaBox, Prizes } from '@esa-layouts/types/schemas';

@Component
export default class extends Vue {
  @replicantNS.State((s) => s.reps.prizes) readonly prizes!: Prizes;
  @replicantNS.State((s) => s.reps.mediaBox) readonly mediaBox!: MediaBox;
  @Prop(Boolean) vertical!: boolean;
  formatUSD = formatUSD;

  get prize(): Tracker.FormattedPrize | undefined {
    return this.prizes.find((s) => s.id.toString() === this.mediaBox.current?.mediaUUID);
  }

  get prizesUrl(): string {
    return nodecg.bundleConfig?.tracker?.prizesUrl || 'prizes.esamarathon.com';
  }
}
</script>
