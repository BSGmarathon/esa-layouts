<template>
  <div class="Flex">
    <div
      id="Total"
      class="Flex"
    >
      <span
        v-for="(char, i) in totalStr"
        :key="i"
        :class="{
          'no-bg': !noBackground,
          'Comma': char === ',',
        }"
      >
        {{ char }}
      </span>
    </div>
  </div>
</template>

<script lang="ts">
import { formatUSD } from '@esa-layouts/graphics/_misc/helpers';
import { State } from 'vuex-class';
import { Vue, Component, Prop } from 'vue-property-decorator';
import { DonationTotal } from '@esa-layouts/types/schemas';

@Component
export default class extends Vue {
  @State donationTotal!: DonationTotal;
  @Prop({ default: false }) noBackground!: boolean;

  get totalStr(): string {
    return formatUSD(this.donationTotal);
  }
}
</script>

<style scoped lang="scss">
#Total {
  padding: 0 13px 0 0;
  font-size: 60px;
  font-weight: 500;
  text-align: left;
  float: right;
  color: white !important;
}

/* Each character in the total is in a span; setting width so the numbers appear monospaced. */
#Total > span {
  padding-top: 40px;
  display: inline-block;
  text-align: center;
  position: relative;
  color: white !important;

  &:not(.no-bg) {
    background: var(--slide-color);
 }
}

#Total span:first-of-type {
  padding-left: 10px;
}

#Total span:last-of-type {
  padding-right: 10px;
}

#Total > .Comma {
  display: inline-block;
  width: 0.22em;
  color: white !important;
  text-align: center;
}
</style>
