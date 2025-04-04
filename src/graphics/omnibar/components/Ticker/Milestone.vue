<template>
  <div
    class="Flex Milestone"
    :style="{
      height: '100%',
      'align-items': 'center',
      'white-space': 'nowrap',
    }"
  >
    <div
      class="Flex"
      :style="{
        position: 'relative',
        'flex-grow': 1,
        margin: '10px',
        height: '65px',
        'background-color': 'rgba(0, 0, 0, 0.3)',
      }"
    >
      <div
        class="Bar"
        :style="{
          position: 'absolute',
          'z-index': 0,
          width: `${progressTweened}%`,
          height: '100%',
          'background-color': '#6DD47E',
        }"
      />
      <div
        :style="{
          display: 'flex',
          'justify-content': 'space-between',
          'align-items': 'center',
          'align-content': 'center',
          // position: 'absolute',
          'z-index': 1,
          width: '100%',
          height: '100%',
          padding: '0 10px',
          'box-sizing': 'border-box',
        }"
      >
        <!-- Why is the font size set to 0px here? REMOVING IT PUSHES THE TEXT OFF CENTER -->
        <div :style="{ width: '20%', 'font-size': '0px', }">
          <span class="BarText" :style="{ 'font-size': '25px' }">
            <span v-if="isMet" :style="{ 'color': '#e8d53a', 'font-weight': 700 }">MET!</span>
            <span v-else>
              <span :style="{ 'font-weight': 600 }">Remaining:</span>
              {{ amountLeft }}
            </span>
          </span>
        </div>
        <div class="BarText" :style="{ 'font-size': '30px' }">
          <span>{{ name }}</span>
        </div>
        <div
          :style="{
            width: '20%',
            'text-align': 'right',
            'font-size': '0px',
          }"
        >
          <span
            class="BarText" :style="{ 'font-size': '25px' }">
            <span :style="{ 'font-weight': 600 }">Goal:</span>
            {{ amount }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { replicantNS } from '@esa-layouts/browser_shared/replicant_store';
import { formatUSD, wait } from '@esa-layouts/graphics/_misc/helpers';
import { DonationTotal, DonationTotalMilestones } from '@esa-layouts/types/schemas';
import gsap from 'gsap';
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';

@Component({
  name: 'Milestone',
})
export default class extends Vue {
  @Prop({ type: Number, default: 25 }) readonly seconds!: number;
  @Prop({ type: Object, required: true }) readonly milestone!: DonationTotalMilestones[0];
  @replicantNS.State((s) => s.reps.donationTotal) readonly donationTotal!: DonationTotal;
  progressTweened = 0;
  totalTweened = 0;

  get name(): string {
    return this.milestone.name;
  }

  get amount(): string {
    return formatUSD(this.milestone.amount || 0);
  }

  get amountLeft(): string {
    return formatUSD(Math.max((this.milestone.amount || 0) - this.totalTweened, 0));
  }

  getProgress(): number {
    if (!this.milestone.amount || !this.donationTotal) return 0;
    const lower = this.milestone.addition ? this.milestone.amount - this.milestone.addition : 0;
    return Math.min((this.donationTotal - lower) / (this.milestone.amount - lower), 1) * 100;
  }

  get isMet(): boolean {
    return !!(this.milestone.amount
      && this.totalTweened && this.milestone.amount <= this.totalTweened);
  }

  tweenValues(): void {
    gsap.to(this, {
      progressTweened: this.getProgress(),
      totalTweened: this.donationTotal,
      duration: 2.5,
    });
  }

  end(): void {
    this.$emit('end');
  }

  async created(): Promise<void> {
    this.tweenValues();
    if (this.seconds >= 0) {
      await wait(this.seconds * 1000); // Wait the specified length.
      this.end();
    }
  }

  // Update tween values if donation total is changed while milestone is being displayed.
  @Watch('donationTotal')
  onAmountLeftChange(): void {
    this.tweenValues();
  }
}
</script>

<style scoped>
  .BarText {
    background-color: rgba(0, 0, 0, 0.4);
    padding: 7px 10px;
    border-radius: 15px;
  }
</style>
