<template>
  <div
    class="War1v1"
    :style="{
      height: '100%',
      display: 'flex',
      'align-items': 'center',
    }"
  >
    <div
      :style="{
        position: 'relative',
        'flex-grow': 1,
        // margin: '10px',
        height: '70px',
        'background-color': 'rgba(0, 0, 0, 0.3)',
      }"
    >
      <!-- Coloured Bars -->
      <div
        :style="{
          display: 'flex',
          'justify-content': 'space-between',
          position: 'absolute',
          width: '100%',
          height: '100%',
        }"
      >
        <div
          :style="{
            width: `${tweened.progress1}%`,
            'background-color': '#FFD55A',
          }"
        />
        <div
          :style="{
            width: `${tweened.progress2}%`,
            'background-color': '#6DD47E',
          }" />
      </div>
      <!-- Both Options -->
      <div
        :style="{
          display: 'flex',
          'justify-content': 'space-between',
          'align-items': 'center',
          position: 'absolute',
          width: '100%',
          height: '100%',
          padding: '0 10px',
          'box-sizing': 'border-box',
          'z-index': 1,
          'font-size': '0px',
        }"
      >
        <div>
          <span class="BarText" :style="{ 'font-size': '20px' }">
            {{ bid.options[0].name }} - {{ formatUSD(tweened.total1) }}
          </span>
        </div>
        <div :style="{ 'text-align': 'right' }">
          <span class="BarText" :style="{ 'font-size': '20px' }">
             {{ formatUSD(tweened.total2) }} - {{ bid.options[1].name }}
          </span>
        </div>
      </div>
      <!-- Name -->
      <div
        :style="{
          position: 'absolute',
          width: '100%',
          height: '100%',
          'z-index': 2,
          'display': 'flex',
          'justify-content': 'center',
        }"
      >
        <div
          :style="{
            'font-size': '20px',
            'text-align': 'center',
            'background-color': 'rgba(0, 0, 0, 0.4)',
            'padding': '0 10px',
            'display': 'flex',
            'flex-direction': 'column',
            'justify-content': 'center',
            'line-height': '150%',
            'height': '100%',
          }"
        >
          {{ bid.game }}
          <br>{{ bid.name }}
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { formatUSD, wait } from '@esa-layouts/graphics/_misc/helpers';
import { Bids } from '@esa-layouts/types/schemas';
import { Vue, Component, Prop, Watch } from 'vue-property-decorator';
import gsap from 'gsap';
import { replicantNS } from '@esa-layouts/browser_shared/replicant_store';
import clone from 'clone';

@Component
export default class extends Vue {
  @Prop({ type: Number, required: true }) readonly seconds!: number;
  @Prop({ type: Number, required: true }) readonly bidId!: number;
  formatUSD = formatUSD;
  tweened = { progress1: 0, progress2: 0, total1: 0, total2: 0 };
  bid: Bids[0] = {
    id: -1,
    game: '',
    name: '',
    options: [
      {
        name: '',
        parent: -1,
        total: 0,
        id: 1,
      },
      {
        name: '',
        parent: -1,
        total: 0,
        id: 2,
      },
    ],
    war: true,
    allowUserOptions: false,
    total: 0,
  };
  @replicantNS.State(
    (s) => s.reps.bids,
  ) readonly allBids!: Bids;

  tweenValues(): void {
    gsap.to(this.tweened, {
      progress1: (this.bid.options[0].total / this.bid.total) * 100,
      progress2: (this.bid.options[1].total / this.bid.total) * 100,
      total1: this.bid.options[0].total,
      total2: this.bid.options[1].total,
      duration: 2.5,
    });
  }

  // We watch all the bids so we can watch for changes. Props in pinned stuff do not change.
  @Watch('allBids', { deep: true, immediate: true })
  onBidRepChange(newVal: Bids): void {
    this.bid = this.getBid(newVal);
    this.tweenValues();
  }

  async created(): Promise<void> {
    this.bid = this.getBid(this.allBids);
    this.tweenValues();
    if (this.seconds >= 0) {
      await wait(this.seconds * 1000); // Wait the specified length.
      this.$emit('end');
    }
  }

  getBid(bids: Bids): Bids[0] {
    const check = bids.find((x) => x.id === this.bidId);

    if (!check) {
      throw new Error(`Bid with id ${this.bidId} not found.`);
    }

    return clone(check);
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
