<template>
  <!-- todo: locally store class CSS properties for safety -->
  <div
    v-show="subscription"
    :class="vertical ? 'FlexColumn' : 'Flex'"
    :style="{
      'font-size': '0.75em',
      'text-align': 'center',
      padding: '25px',
      'box-sizing': 'border-box',
    }"
  >
    <img
      src="./esaHype.png"
      :style="{ 'margin-bottom': vertical ? '10px' : 0 }"
    >
    <div
      class="FlexColumn"
      :style="{ 'margin-left': vertical ? 0 : '10px' }"
    >
      <div
        :style="{
          'font-size': '0.8em',
          color: 'white', // move to theme!
        }"
      >
        {{ subscription.systemMsg }}
      </div>
      <div
        v-if="subscription.message"
        :style="{
          'font-size': '0.7em',
          color: 'lightgrey', // move to theme!
        }"
      >
        {{ subscription.message }}
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
import { MediaBox as MediaBoxRep } from '@esa-layouts/types/schemas';
import { MediaBox } from '@esa-layouts/types';
import { replicantNS } from '@esa-layouts/browser_shared/replicant_store';

@Component
export default class extends Vue {
  @replicantNS.State((s) => s.reps.mediaBox) readonly mediaBox!: MediaBoxRep;
  @Prop(Boolean) vertical!: boolean;

  get subscription(): MediaBox.AlertElem['data'] | undefined {
    return this.mediaBox.alertQueue.find((a) => a.id === this.mediaBox.current?.mediaUUID)?.data;
  }
}
</script>
