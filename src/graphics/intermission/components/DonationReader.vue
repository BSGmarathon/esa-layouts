<template>
  <div
    v-if="donationReader"
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
      >
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

<script lang="ts">
import { Commentators, DonationReader } from '@esa-layouts/types/schemas';
import { Component, Vue } from 'vue-property-decorator';
import { State } from 'vuex-class';

@Component
export default class extends Vue {
  @State readonly commentators!: Commentators;
  @State donationReader!: DonationReader;
  theme = nodecg.bundleConfig.event.theme;

  // For SWCF
  get comms(): { name: string, pronouns?: string }[] {
    return this.commentators.map((c) => ({
      name: c.replace(/\((.*?)\)/g, '').trim(),
      pronouns: (c.match(/\((.*?)\)/g) || [])[0]?.replace(/[()]/g, ''),
    }));
  }

  get name(): string | undefined {
    if (!this.donationReader) {
      return undefined;
    }
    return this.donationReader.replace(/\((.*?)\)/g, '').trim();
  }

  get pronouns(): string | undefined {
    if (!this.donationReader) {
      return undefined;
    }
    return (this.donationReader.match(/\((.*?)\)/g) || [])[0]?.replace(/[()]/g, '');
  }
}
</script>

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
